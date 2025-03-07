<template>
  <div class="max-w-screen-xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold text-gray-800">Panel de Administración de Rifas</h1>
      <button 
        @click="cerrarSesion" 
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center"
      >
        <i class="fas fa-sign-out-alt mr-2"></i>
        Cerrar Sesión
      </button>
    </div>

    <!-- Sección de Compras Pendientes -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">
        <i class="fas fa-clock mr-2"></i>Compras Pendientes
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left">Rifa</th>
              <th class="py-3 px-4 text-left">Comprador</th>
              <th class="py-3 px-4 text-left">Números</th>
              <th class="py-3 px-4 text-left">Total</th>
              <th class="py-3 px-4 text-left">Fecha</th>
              <th class="py-3 px-4 text-left">Comprobante</th>
              <th class="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="compra in comprasPendientes" :key="compra.id" class="border-t border-gray-300 hover:bg-gray-50">
              <td class="py-3 px-4">{{ obtenerNombreRifa(compra.rifa_id) }}</td>
              <td class="py-3 px-4">
                {{ compra.nombre }}<br>
                <span class="text-sm text-gray-600">{{ compra.email }}</span><br>
                <span class="text-sm text-gray-600">{{ compra.telefono }}</span>
              </td>
              <td class="py-3 px-4">
                <span class="text-sm">
                  {{ JSON.parse(compra.numeros_seleccionados).join(', ') }}
                </span>
              </td>
              <td class="py-3 px-4">${{ compra.total_pagar }} USD</td>
              <td class="py-3 px-4">{{ formatearFecha(compra.fecha_compra) }}</td>
              <td class="py-3 px-4">
                <a 
                  :href="getImageUrl(compra.comprobante_pago)" 
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  Ver Comprobante
                </a>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button 
                    @click="aprobarCompra(compra.id)"
                    class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    <i class="fas fa-check mr-1"></i>Aprobar
                  </button>
                  <button 
                    @click="rechazarCompra(compra.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    <i class="fas fa-times mr-1"></i>Rechazar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="comprasPendientes.length === 0">
              <td colspan="7" class="py-4 px-4 text-center text-gray-600">
                No hay compras pendientes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Crear Rifa -->
    <h2 class="text-2xl font-semibold mb-4 text-gray-700">Crear Rifa</h2>
    <p class="text-sm text-gray-600 mb-2">Indica el precio por boleto y la cantidad de boletos disponibles.</p>
    <form @submit.prevent="crearRifa" class="mb-6" enctype="multipart/form-data">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="nuevaRifa.titulo" type="text" placeholder="Título" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="nuevaRifa.fecha" type="date" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div class="mb-2">
          <label class="block text-sm text-gray-600">Precio por boleto (USD)</label>
          <input v-model="nuevaRifa.precio" type="number" placeholder="0" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" />
        </div>
        <div class="mb-2">
          <label class="block text-sm text-gray-600">Cantidad de boletos</label>
          <input v-model="nuevaRifa.boletosDisponibles" type="number" placeholder="0" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="1" />
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">Descripción de la Rifa</label>
        <textarea v-model="nuevaRifa.descripcion" 
                  placeholder="Describe los detalles de la rifa..." 
                  required 
                  class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"></textarea>
      </div>

      <!-- Imagen de Perfil con Previsualización -->
      <div class="mb-6">
        <label class="block text-sm text-gray-600 mb-2">Imagen de Perfil</label>
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <input type="file" 
                   @change="handleFileUpload('imagenPerfil', $event)" 
                   required 
                   accept="image/*"
                   class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span class="text-gray-600 text-sm">Selecciona la imagen de perfil para la rifa</span>
          </div>
          <div v-if="previewImagenPerfil" class="w-32 h-32 relative">
            <img :src="previewImagenPerfil" alt="Preview Perfil" class="w-full h-full object-cover rounded-lg border-2 border-blue-500" />
            <button @click="removeImage('imagenPerfil')" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Imagen de Banner con Previsualización -->
      <div class="mb-6">
        <label class="block text-sm text-gray-600 mb-2">Imagen de Banner</label>
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <input type="file" 
                   @change="handleFileUpload('imagenBanner', $event)" 
                   required 
                   accept="image/*"
                   class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span class="text-gray-600 text-sm">Selecciona la imagen del banner para la rifa</span>
          </div>
          <div v-if="previewImagenBanner" class="w-64 h-32 relative">
            <img :src="previewImagenBanner" alt="Preview Banner" class="w-full h-full object-cover rounded-lg border-2 border-blue-500" />
            <button @click="removeImage('imagenBanner')" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">Crear Rifa</button>
    </form>

    <!-- Editar Rifa -->
    <h2 class="text-2xl font-semibold mb-4 text-gray-700">Editar Rifa</h2>
    <select v-model="rifaSeleccionada" @change="cargarRifa" class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option disabled value="">Selecciona una rifa</option>
      <option v-for="rifa in rifas" :key="rifa.id" :value="rifa.id">{{ rifa.titulo }}</option>
    </select>
    <form v-if="rifaEditada" @submit.prevent="editarRifa" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="rifaEditada.titulo" type="text" placeholder="Título" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="rifaEditada.fecha" type="date" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="rifaEditada.precio" type="number" placeholder="Precio por boleto (USD)" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="rifaEditada.boletosDisponibles" type="number" placeholder="Cantidad de boletos" required class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-2">Descripción de la Rifa</label>
        <textarea v-model="rifaEditada.descripcion" 
                  placeholder="Describe los detalles de la rifa..." 
                  required 
                  class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"></textarea>
      </div>

      <!-- Previsualización de imágenes existentes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div v-if="rifaEditada.imagenPerfil" class="relative">
          <img :src="getImageUrl(rifaEditada.imagenPerfil)" alt="Imagen de Perfil" class="w-32 h-32 object-cover rounded-lg border-2 border-blue-500" />
          <p class="text-sm text-gray-600 mt-2">Imagen de Perfil Actual</p>
        </div>
        <div v-if="rifaEditada.imagenBanner" class="relative">
          <img :src="getImageUrl(rifaEditada.imagenBanner)" alt="Imagen de Banner" class="w-64 h-32 object-cover rounded-lg border-2 border-blue-500" />
          <p class="text-sm text-gray-600 mt-2">Imagen de Banner Actual</p>
        </div>
      </div>

      <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200">Actualizar Rifa</button>
    </form>

    <!-- Eliminar Rifa -->
    <h2 class="text-2xl font-semibold mb-4 text-gray-700">Eliminar Rifa</h2>
    <div class="space-y-4">
      <select 
        v-model="rifaAEliminar" 
        class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecciona una rifa para eliminar</option>
        <option v-for="rifa in rifas" :key="rifa.id" :value="rifa.id">{{ rifa.titulo }}</option>
      </select>
      <button 
        @click="eliminarRifa" 
        class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="!rifaAEliminar"
      >
        <i class="fas fa-trash-alt mr-2"></i>
        Eliminar Rifa Seleccionada
      </button>
    </div>

    <!-- Gestión de Métodos de Pago -->
    <div class="mt-8 border-t pt-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">
        <i class="fas fa-money-bill-wave mr-2"></i>Métodos de Pago
      </h2>

      <!-- Formulario para agregar método de pago -->
      <form @submit.prevent="agregarMetodoPago" class="mb-6" enctype="multipart/form-data">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex-1">
            <input 
              v-model="nuevoMetodoPago.nombre" 
              type="text" 
              placeholder="Nombre del método de pago" 
              required 
              class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea 
              v-model="nuevoMetodoPago.descripcion"
              placeholder="Instrucciones de pago (número de cuenta, correo PayPal, etc.)"
              required
              rows="4"
              class="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div class="flex items-start space-x-4">
            <div class="flex-1">
              <input 
                type="file" 
                @change="handleMetodoPagoIcono" 
                required 
                accept="image/*"
                class="border border-gray-300 p-3 mb-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div v-if="previewIconoMetodoPago" class="w-16 h-16 relative">
              <img :src="previewIconoMetodoPago" alt="Preview Icono" class="w-full h-full object-cover rounded-lg border-2 border-blue-500" />
              <button @click="removeIconoMetodoPago" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <button type="submit" class="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200">
          <i class="fas fa-plus mr-2"></i>Agregar Método de Pago
        </button>
      </form>

      <!-- Lista de métodos de pago -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="metodo in metodosPago" :key="metodo.id" class="bg-white p-4 rounded-lg shadow border">
          <div class="flex items-center space-x-4">
            <img 
              :src="getImageUrl(metodo.icono)" 
              :alt="metodo.nombre" 
              class="w-12 h-12 object-cover rounded-lg"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-lg">{{ metodo.nombre }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ metodo.descripcion }}</p>
              <div class="flex items-center mt-2 space-x-2">
                <button 
                  @click="toggleMetodoPago(metodo)"
                  :class="[
                    'px-3 py-1 rounded text-sm',
                    metodo.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ metodo.activo ? 'Activo' : 'Inactivo' }}
                </button>
                <button 
                  @click="eliminarMetodoPago(metodo.id)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { API_URL, getImageUrl } from '../config';

const rifas = ref([]);
const nuevaRifa = ref({ 
  titulo: '', 
  fecha: '', 
  precio: 0, 
  boletosDisponibles: 0, 
  imagenPerfil: null, 
  imagenBanner: null,
  descripcion: '' 
});
const rifaSeleccionada = ref('');
const rifaEditada = ref(null);
const rifaAEliminar = ref('');

// Referencias para las previsualizaciones de imágenes
const previewImagenPerfil = ref(null);
const previewImagenBanner = ref(null);

// Nueva variable para compras pendientes
const comprasPendientes = ref([]);

// Estado para métodos de pago
const metodosPago = ref([]);
const nuevoMetodoPago = ref({
  nombre: '',
  icono: null,
  descripcion: ''
});
const previewIconoMetodoPago = ref(null);

const router = useRouter();

// Cargar rifas desde el backend
const cargarRifas = async () => {
  const response = await axios.get(`${API_URL}/rifas`);
  rifas.value = response.data;
};

// Crear nueva rifa
const crearRifa = async () => {
  const formData = new FormData();
  formData.append('titulo', nuevaRifa.value.titulo);
  formData.append('fecha', nuevaRifa.value.fecha);
  formData.append('precio', nuevaRifa.value.precio);
  formData.append('boletosDisponibles', nuevaRifa.value.boletosDisponibles);
  formData.append('descripcion', nuevaRifa.value.descripcion);
  formData.append('imagenPerfil', nuevaRifa.value.imagenPerfil);
  formData.append('imagenBanner', nuevaRifa.value.imagenBanner);

  try {
    await axios.post(`${API_URL}/rifas`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert('Rifa creada exitosamente');
    nuevaRifa.value = { 
      titulo: '', 
      fecha: '', 
      precio: 0, 
      boletosDisponibles: 0, 
      imagenPerfil: null, 
      imagenBanner: null,
      descripcion: '' 
    };
    previewImagenPerfil.value = null;
    previewImagenBanner.value = null;
    await cargarRifas();
  } catch (error) {
    alert('Error al crear la rifa: ' + error.message);
  }
};

// Cargar rifa seleccionada para editar
const cargarRifa = async () => {
  const response = await axios.get(`${API_URL}/rifas/${rifaSeleccionada.value}`);
  rifaEditada.value = response.data;
};

// Editar rifa
const editarRifa = async () => {
  await axios.put(`${API_URL}/rifas/${rifaEditada.value.id}`, rifaEditada.value);
  rifaEditada.value = null;
  await cargarRifas();
};

// Eliminar rifa
const eliminarRifa = async () => {
  if (!rifaAEliminar.value) {
    alert('Por favor, selecciona una rifa para eliminar');
    return;
  }

  if (!confirm('¿Estás seguro de que deseas eliminar esta rifa? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    await axios.delete(`${API_URL}/rifas/${rifaAEliminar.value}`);
    alert('Rifa eliminada exitosamente');
    rifaAEliminar.value = '';
    await cargarRifas();
  } catch (error) {
    console.error('Error al eliminar la rifa:', error);
    alert('Error al eliminar la rifa: ' + error.message);
  }
};

// Manejar la carga de archivos y mostrar previsualización
const handleFileUpload = (field, event) => {
  const file = event.target.files[0];
  if (file) {
    nuevaRifa.value[field] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (field === 'imagenPerfil') {
        previewImagenPerfil.value = e.target.result;
      } else {
        previewImagenBanner.value = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

// Remover imagen
const removeImage = (field) => {
  nuevaRifa.value[field] = null;
  if (field === 'imagenPerfil') {
    previewImagenPerfil.value = null;
  } else {
    previewImagenBanner.value = null;
  }
};

// Función para cargar compras pendientes
const cargarComprasPendientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/compras?estado=pendiente`);
    comprasPendientes.value = response.data;
  } catch (error) {
    console.error('Error al cargar compras pendientes:', error);
  }
};

// Función para obtener el nombre de la rifa
const obtenerNombreRifa = (rifaId) => {
  const rifa = rifas.value.find(r => r.id === rifaId);
  return rifa ? rifa.titulo : 'Rifa no encontrada';
};

// Función para formatear fecha
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Funciones para aprobar/rechazar compras
const aprobarCompra = async (compraId) => {
  try {
    await axios.put(`${API_URL}/compras/${compraId}/estado`, { estado: 'aprobado' });
    await cargarComprasPendientes();
  } catch (error) {
    console.error('Error al aprobar la compra:', error);
  }
};

const rechazarCompra = async (compraId) => {
  if (!confirm('¿Estás seguro de que deseas rechazar esta compra?')) return;
  
  try {
    await axios.put(`${API_URL}/compras/${compraId}/estado`, { estado: 'rechazado' });
    await cargarComprasPendientes();
  } catch (error) {
    console.error('Error al rechazar la compra:', error);
  }
};

// Función para cerrar sesión
const cerrarSesion = () => {
  localStorage.removeItem('adminAuth');
  router.push('/admin/login');
};

// Cargar métodos de pago
const cargarMetodosPago = async () => {
  try {
    const response = await axios.get(`${API_URL}/metodos-pago`);
    metodosPago.value = response.data;
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error);
    alert('Error al cargar los métodos de pago');
  }
};

// Manejar la subida del ícono
const handleMetodoPagoIcono = (event) => {
  const file = event.target.files[0];
  if (file) {
    nuevoMetodoPago.value.icono = file;
    previewIconoMetodoPago.value = URL.createObjectURL(file);
  }
};

// Eliminar la previsualización del ícono
const removeIconoMetodoPago = () => {
  nuevoMetodoPago.value.icono = null;
  previewIconoMetodoPago.value = null;
};

// Agregar nuevo método de pago
const agregarMetodoPago = async () => {
  try {
    const formData = new FormData();
    formData.append('nombre', nuevoMetodoPago.value.nombre);
    formData.append('icono', nuevoMetodoPago.value.icono);
    formData.append('descripcion', nuevoMetodoPago.value.descripcion);

    await axios.post(`${API_URL}/metodos-pago`, formData);
    await cargarMetodosPago();
    
    // Limpiar el formulario
    nuevoMetodoPago.value.nombre = '';
    nuevoMetodoPago.value.icono = null;
    nuevoMetodoPago.value.descripcion = '';
    previewIconoMetodoPago.value = null;
    
    alert('Método de pago agregado correctamente');
  } catch (error) {
    console.error('Error al agregar método de pago:', error);
    alert('Error al agregar el método de pago');
  }
};

// Alternar estado activo/inactivo
const toggleMetodoPago = async (metodo) => {
  try {
    await axios.put(`${API_URL}/metodos-pago/${metodo.id}`, {
      nombre: metodo.nombre,
      activo: !metodo.activo
    });
    await cargarMetodosPago();
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    alert('Error al actualizar el método de pago');
  }
};

// Eliminar método de pago
const eliminarMetodoPago = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
    return;
  }

  try {
    await axios.delete(`${API_URL}/metodos-pago/${id}`);
    await cargarMetodosPago();
    alert('Método de pago eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    alert('Error al eliminar el método de pago');
  }
};

onMounted(async () => {
  if (!localStorage.getItem('adminAuth')) {
    router.push('/admin/login');
    return;
  }
  await Promise.all([
    cargarRifas(),
    cargarComprasPendientes(),
    cargarMetodosPago()
  ]);
});
</script>

<style scoped>
/* Transiciones para las previsualizaciones */
.preview-enter-active, .preview-leave-active {
  transition: opacity 0.3s ease;
}
.preview-enter-from, .preview-leave-to {
  opacity: 0;
}
</style> 