
-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  placa VARCHAR(10) UNIQUE NOT NULL,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de espacios de parqueadero
CREATE TABLE espacios_parqueadero (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(10) UNIQUE NOT NULL,
  piso INTEGER NOT NULL,
  estado VARCHAR(20) DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (estado IN ('disponible', 'ocupado', 'mantenimiento'))
);

-- Tabla de reservas
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  vehiculo_id INTEGER REFERENCES vehiculos(id) ON DELETE CASCADE,
  espacio_id INTEGER REFERENCES espacios_parqueadero(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_entrada TIMESTAMP NOT NULL,
  fecha_salida TIMESTAMP,
  terminado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de acceso (opcional, para auditoría)
CREATE TABLE historial_acceso (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  accion VARCHAR(100) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  detalles TEXT
);

-- Insertar espacios de parqueadero iniciales (8 espacios, 4 por piso)
INSERT INTO espacios_parqueadero (numero, piso, estado) VALUES
  ('A1', 1, 'disponible'),
  ('A2', 1, 'disponible'),
  ('A3', 1, 'disponible'),
  ('A4', 1, 'disponible'),
  ('B1', 2, 'disponible'),
  ('B2', 2, 'disponible'),
  ('B3', 2, 'disponible'),
  ('B4', 2, 'disponible');

-- Índices para mejorar el rendimiento
CREATE INDEX idx_vehiculos_user_id ON vehiculos(user_id);
CREATE INDEX idx_reservas_user_id ON reservas(user_id);
CREATE INDEX idx_reservas_vehiculo_id ON reservas(vehiculo_id);
CREATE INDEX idx_reservas_espacio_id ON reservas(espacio_id);
CREATE INDEX idx_reservas_terminado ON reservas(terminado);
CREATE INDEX idx_espacios_estado ON espacios_parqueadero(estado);

-- Vista útil: Reservas activas con información completa
CREATE VIEW reservas_activas AS
SELECT 
  r.id,
  r.fecha_entrada,
  r.fecha_salida,
  u.nombre AS usuario_nombre,
  u.email AS usuario_email,
  v.placa AS vehiculo_placa,
  v.marca AS vehiculo_marca,
  v.modelo AS vehiculo_modelo,
  v.color AS vehiculo_color,
  e.numero AS espacio_numero,
  e.piso AS espacio_piso
FROM reservas r
JOIN usuarios u ON r.user_id = u.id
JOIN vehiculos v ON r.vehiculo_id = v.id
JOIN espacios_parqueadero e ON r.espacio_id = e.id
WHERE r.terminado = FALSE;

-- Comentarios para documentación
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema';
COMMENT ON TABLE vehiculos IS 'Tabla de vehículos registrados por los usuarios';
COMMENT ON TABLE espacios_parqueadero IS 'Tabla de espacios de parqueadero disponibles';
COMMENT ON TABLE reservas IS 'Tabla de reservas de parqueadero';
COMMENT ON TABLE historial_acceso IS 'Tabla de auditoría para registrar acciones de usuarios';
