const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'parqueadero',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

class DatabaseService {
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error en query:', error);
      throw error;
    }
  }

  async getClient() {
    return await pool.connect();
  }

  // Usuarios
  async findUserByEmail(email) {
    const result = await this.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async findUserById(id) {
    const result = await this.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async createUser(email, nombre, telefono, password) {
    const result = await this.query(
      'INSERT INTO usuarios (email, nombre, telefono, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, nombre, telefono, password]
    );
    return result.rows[0];
  }

  // Vehículos
  async findVehiculosByUserId(userId) {
    const result = await this.query(
      'SELECT * FROM vehiculos WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    return result.rows;
  }

  async findVehiculoById(id, userId) {
    const result = await this.query(
      'SELECT * FROM vehiculos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  async createVehiculo(placa, marca, modelo, color, userId) {
    const result = await this.query(
      'INSERT INTO vehiculos (placa, marca, modelo, color, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [placa, marca, modelo, color, userId]
    );
    return result.rows[0];
  }

  async updateVehiculo(id, placa, marca, modelo, color, userId) {
    const result = await this.query(
      'UPDATE vehiculos SET placa = COALESCE($1, placa), marca = COALESCE($2, marca), modelo = COALESCE($3, modelo), color = COALESCE($4, color) WHERE id = $5 AND user_id = $6 RETURNING *',
      [placa, marca, modelo, color, id, userId]
    );
    return result.rows[0];
  }

  async deleteVehiculo(id, userId) {
    const result = await this.query(
      'DELETE FROM vehiculos WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }

  async findVehiculoByPlacaAndUserId(placa, userId) {
    const result = await this.query(
      'SELECT * FROM vehiculos WHERE placa = $1 AND user_id = $2',
      [placa, userId]
    );
    return result.rows[0];
  }

  // Espacios
  async getAllEspacios() {
    const result = await this.query(
      'SELECT id, numero as numero_espacio, piso, estado, CAST(\'automovil\' AS VARCHAR) as tipo FROM espacios_parqueadero ORDER BY piso, numero'
    );
    return result.rows;
  }

  async getEspaciosDisponibles() {
    const result = await this.query(
      "SELECT id, numero as numero_espacio, piso, estado, CAST('automovil' AS VARCHAR) as tipo FROM espacios_parqueadero WHERE estado = 'disponible' ORDER BY piso, numero"
    );
    return result.rows;
  }

  async findEspacioById(id) {
    const result = await this.query(
      'SELECT * FROM espacios_parqueadero WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async updateEspacioEstado(id, estado) {
    const result = await this.query(
      'UPDATE espacios_parqueadero SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    return result.rows[0];
  }

  // Reservas
  async findReservasByUserId(userId) {
    const result = await this.query(
      `SELECT r.*, 
              v.placa, v.marca, v.modelo, v.color,
              e.numero as numero_espacio, e.piso, CAST('automovil' AS VARCHAR) as tipo, e.estado as espacio_estado,
              CASE WHEN r.terminado = false THEN 'activa' ELSE 'terminada' END as estado
       FROM reservas r
       LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
       LEFT JOIN espacios_parqueadero e ON r.espacio_id = e.id
       WHERE r.user_id = $1
       ORDER BY r.id DESC`,
      [userId]
    );
    return result.rows;
  }

  async findReservasActivasByUserId(userId) {
    const result = await this.query(
      `SELECT r.*, 
              v.placa, v.marca, v.modelo, v.color,
              e.numero as numero_espacio, e.piso, CAST('automovil' AS VARCHAR) as tipo, e.estado as espacio_estado,
              CASE WHEN r.terminado = false THEN 'activa' ELSE 'terminada' END as estado
       FROM reservas r
       LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
       LEFT JOIN espacios_parqueadero e ON r.espacio_id = e.id
       WHERE r.user_id = $1 AND r.terminado = false
       ORDER BY r.id DESC`,
      [userId]
    );
    return result.rows;
  }

  async findReservaById(id, userId) {
    const result = await this.query(
      `SELECT r.*, 
              v.placa, v.marca, v.modelo, v.color,
              e.numero as numero_espacio, e.piso, CAST('automovil' AS VARCHAR) as tipo, e.estado as espacio_estado,
              CASE WHEN r.terminado = false THEN 'activa' ELSE 'terminada' END as estado
       FROM reservas r
       LEFT JOIN vehiculos v ON r.vehiculo_id = v.id
       LEFT JOIN espacios_parqueadero e ON r.espacio_id = e.id
       WHERE r.id = $1 AND r.user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  }

  async createReserva(vehiculoId, espacioId, fechaEntrada, userId) {
    const result = await this.query(
      "INSERT INTO reservas (vehiculo_id, espacio_id, fecha_entrada, user_id, terminado) VALUES ($1, $2, $3, $4, false) RETURNING *",
      [vehiculoId, espacioId, fechaEntrada, userId]
    );
    return result.rows[0];
  }

  async terminarReserva(id, userId) {
    const result = await this.query(
      "UPDATE reservas SET terminado = true, fecha_salida = NOW() WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    return result.rows[0];
  }

  async deleteReserva(id, userId) {
    const result = await this.query(
      'DELETE FROM reservas WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    return result.rows[0];
  }

  async findReservaActivaByVehiculoId(vehiculoId) {
    const result = await this.query(
      "SELECT * FROM reservas WHERE vehiculo_id = $1 AND terminado = false",
      [vehiculoId]
    );
    return result.rows[0];
  }

  async testConnection() {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('❌ Error conectando a PostgreSQL:', error.message);
      return false;
    }
  }
}

module.exports = new DatabaseService();
