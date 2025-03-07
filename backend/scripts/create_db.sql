CREATE DATABASE IF NOT EXISTS rifas_db;
USE rifas_db;

CREATE TABLE IF NOT EXISTS rifas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    boletosDisponibles INT NOT NULL,
    imagenPerfil VARCHAR(255) NOT NULL,
    imagenBanner VARCHAR(255) NOT NULL
); 