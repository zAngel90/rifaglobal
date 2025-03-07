const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configuración de CORS para aceptar cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: '93.127.203.121',
  user: 'rifas_user',
  password: 'Rifas2024@',
  database: 'rifas_db'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nombre del archivo
  }
});

// Inicializar multer
const upload = multer({ storage: storage });

// Configuración de almacenamiento para comprobantes de pago
const comprobantesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/comprobantes/'); // Carpeta para comprobantes de pago
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadComprobante = multer({ storage: comprobantesStorage });

// Configuración de almacenamiento para íconos de métodos de pago
const metodoPagoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/metodos-pago/'); // Carpeta para íconos de métodos de pago
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadMetodoPago = multer({ storage: metodoPagoStorage });

// Crear una nueva rifa con imagen
app.post('/rifas', upload.fields([{ name: 'imagenPerfil' }, { name: 'imagenBanner' }]), (req, res) => {
  const { titulo, fecha, precio, boletosDisponibles, descripcion } = req.body;
  const imagenPerfil = req.files['imagenPerfil'] ? req.files['imagenPerfil'][0].path : null;
  const imagenBanner = req.files['imagenBanner'] ? req.files['imagenBanner'][0].path : null;
  const query = 'INSERT INTO rifas (titulo, fecha, precio, boletosDisponibles, imagenPerfil, imagenBanner, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [titulo, fecha, precio, boletosDisponibles, imagenPerfil, imagenBanner, descripcion], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, titulo, fecha, precio, boletosDisponibles, imagenPerfil, imagenBanner, descripcion });
  });
});

// Editar una rifa
app.put('/rifas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, fecha, precio, boletosDisponibles, imagenPerfil, imagenBanner, descripcion } = req.body;
  const query = 'UPDATE rifas SET titulo = ?, fecha = ?, precio = ?, boletosDisponibles = ?, imagenPerfil = ?, imagenBanner = ?, descripcion = ? WHERE id = ?';
  db.query(query, [titulo, fecha, precio, boletosDisponibles, imagenPerfil, imagenBanner, descripcion, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Rifa actualizada' });
  });
});

// Eliminar una rifa
app.delete('/rifas/:id', (req, res) => {
  const { id } = req.params;
  
  // Primero eliminamos las compras asociadas
  db.query('DELETE FROM compras WHERE rifa_id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar compras asociadas:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Luego eliminamos la rifa
    db.query('DELETE FROM rifas WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error al eliminar rifa:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Rifa y compras asociadas eliminadas correctamente' });
    });
  });
});

// Obtener todas las rifas
app.get('/rifas', (req, res) => {
  const query = 'SELECT * FROM rifas';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const rutasImagens = results.map(rifa => {
      return {
        ...rifa,
        imagenPerfil: rifa.imagenPerfil ? rifa.imagenPerfil.replace(/\\/g, '/') : null,
        imagenBanner: rifa.imagenBanner ? rifa.imagenBanner.replace(/\\/g, '/') : null
      };
    });
    console.log('Rutas de imágenes enviadas:', rutasImagens);
    res.status(200).json(rutasImagens);
  });
});

// Obtener una rifa específica por ID
app.get('/rifas/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM rifas WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Rifa no encontrada' });
    }
    res.status(200).json(results[0]);
  });
});

// Crear una nueva compra de boletos
app.post('/compras', uploadComprobante.single('comprobante'), (req, res) => {
  const { rifa_id, nombre, email, telefono, numeros_seleccionados, total_pagar } = req.body;
  const comprobante = req.file ? req.file.path : null;

  const query = `INSERT INTO compras 
    (rifa_id, nombre, email, telefono, numeros_seleccionados, total_pagar, comprobante_pago) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query, 
    [rifa_id, nombre, email, telefono, numeros_seleccionados, total_pagar, comprobante],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        id: result.insertId,
        mensaje: 'Compra registrada exitosamente'
      });
    }
  );
});

// Obtener compras por rifa
app.get('/compras/rifa/:rifaId', (req, res) => {
  const { rifaId } = req.params;
  const query = 'SELECT * FROM compras WHERE rifa_id = ?';
  
  db.query(query, [rifaId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Verificar disponibilidad de números
app.get('/rifas/:rifaId/numeros-disponibles', (req, res) => {
  const { rifaId } = req.params;
  const query = `
    SELECT numeros_seleccionados 
    FROM compras 
    WHERE rifa_id = ? AND estado != 'rechazado'`;
  
  db.query(query, [rifaId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Convertir los números seleccionados en un array
    const numerosOcupados = results.reduce((acc, row) => {
      return acc.concat(JSON.parse(row.numeros_seleccionados));
    }, []);
    
    res.status(200).json({ numerosOcupados });
  });
});

// Actualizar estado de una compra
app.put('/compras/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  const query = 'UPDATE compras SET estado = ? WHERE id = ?';
  
  db.query(query, [estado, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
  });
});

// Obtener compras por estado
app.get('/compras', (req, res) => {
  const { estado } = req.query;
  let query = 'SELECT * FROM compras';
  
  if (estado) {
    query += ' WHERE estado = ?';
  }
  
  db.query(query, estado ? [estado] : [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Formatear las rutas de los comprobantes
    const comprasFormateadas = results.map(compra => ({
      ...compra,
      comprobante_pago: compra.comprobante_pago ? compra.comprobante_pago.replace(/\\/g, '/') : null
    }));
    
    res.status(200).json(comprasFormateadas);
  });
});

// Crear un nuevo método de pago
app.post('/metodos-pago', uploadMetodoPago.single('icono'), (req, res) => {
  const { nombre, descripcion } = req.body;
  const icono = req.file ? req.file.path : null;
  
  const query = 'INSERT INTO metodos_pago (nombre, icono, descripcion) VALUES (?, ?, ?)';
  db.query(query, [nombre, icono, descripcion], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      icono: icono ? icono.replace(/\\/g, '/') : null
    });
  });
});

// Obtener todos los métodos de pago
app.get('/metodos-pago', (req, res) => {
  const query = 'SELECT * FROM metodos_pago';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const metodosFormateados = results.map(metodo => ({
      ...metodo,
      icono: metodo.icono ? metodo.icono.replace(/\\/g, '/') : null
    }));
    res.status(200).json(metodosFormateados);
  });
});

// Actualizar un método de pago
app.put('/metodos-pago/:id', uploadMetodoPago.single('icono'), (req, res) => {
  const { id } = req.params;
  const { nombre, activo, descripcion } = req.body;
  const icono = req.file ? req.file.path : null;

  let query = 'UPDATE metodos_pago SET nombre = ?, descripcion = ?';
  let params = [nombre, descripcion];

  if (icono) {
    query += ', icono = ?';
    params.push(icono);
  }
  if (activo !== undefined) {
    query += ', activo = ?';
    params.push(activo);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.query(query, params, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Método de pago actualizado correctamente' });
  });
});

// Eliminar un método de pago
app.delete('/metodos-pago/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM metodos_pago WHERE id = ?';
  
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Método de pago eliminado correctamente' });
  });
});

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
}); 