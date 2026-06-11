-- database.sql
-- Script de inicialización para la base de datos FarmaVida

-- 1. Crear la base de datos (Ejecutar esto primero y luego conectarse a ella para ejecutar el resto)
-- CREATE DATABASE farmavida;
-- \c farmavida;

-- 2. Eliminar tablas si existen (útil para reiniciar)
DROP VIEW IF EXISTS vw_productos_stock_bajo;
DROP TABLE IF EXISTS detalle_orden CASCADE;
DROP TABLE IF EXISTS ordenes_compra CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 3. Crear Tablas

-- Roles de usuario
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    rol_id INTEGER REFERENCES roles(id),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías de productos
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proveedores
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    categoria_id INTEGER REFERENCES categorias(id),
    imagen_url TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Órdenes de Compra
CREATE TABLE ordenes_compra (
    id SERIAL PRIMARY KEY,
    numero_orden VARCHAR(50) NOT NULL UNIQUE,
    proveedor_id INTEGER REFERENCES proveedores(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_recepcion TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, en_camino, completada, cancelada
    notas TEXT,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalle de Orden de Compra
CREATE TABLE detalle_orden (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vistas

-- Vista para productos con stock bajo
CREATE VIEW vw_productos_stock_bajo AS
SELECT p.id, p.codigo, p.nombre, p.stock_actual, p.stock_minimo, c.nombre AS categoria
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.stock_actual <= p.stock_minimo AND p.activo = TRUE;

-- 5. Insertar datos iniciales

-- Roles
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador del sistema con acceso total'),
('empleado', 'Empleado de farmacia con acceso limitado');

-- Usuario Admin inicial (password es 'admin123' hasheado con bcrypt)
-- Puedes generar el tuyo modificando este hash o registrando desde la app y cambiando el rol_id manualmente
INSERT INTO usuarios (nombre, email, password, rol_id) VALUES
('Administrador', 'admin@farmavida.com', '$2a$10$xyz...', 1); -- NOTA: El hash debe ser válido, mejor usar el registro de la app

-- Algunas categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
('Medicamentos', 'Analgésicos, antibióticos, etc.'),
('Cuidado Personal', 'Shampoo, desodorantes, cremas'),
('Suplementos', 'Vitaminas, proteínas');
