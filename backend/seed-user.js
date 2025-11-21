require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'parqueadero',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function createUser() {
  try {
    const email = 'jcruz24p@gmail.com';
    const password = '123456';
    const nombre = 'Juan Cruz';
    const telefono = '1234567890';

    // Verificar si el usuario ya existe
    const checkUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (checkUser.rows.length > 0) {
      console.log('✅ El usuario ya existe en la base de datos');
      console.log('📧 Email:', email);
      console.log('🔑 Password: 123456');
      pool.end();
      return;
    }

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO usuarios (email, nombre, telefono, password) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, telefono',
      [email, nombre, telefono, hashedPassword]
    );

    console.log('✅ Usuario creado exitosamente:');
    console.log(JSON.stringify(result.rows[0], null, 2));
    console.log('\n🔑 Credenciales:');
    console.log('📧 Email:', email);
    console.log('🔐 Password: 123456');

    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
    process.exit(1);
  }
}

createUser();
