require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'parqueadero',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function seedEspacios() {
  try {
    // Verificar cuántos espacios hay
    const count = await pool.query('SELECT COUNT(*) FROM espacios_parqueadero');
    const totalEspacios = parseInt(count.rows[0].count);
    
    console.log(`📊 Espacios existentes: ${totalEspacios}`);
    
    if (totalEspacios === 0) {
      console.log('⚠️  No hay espacios, creando 20 espacios...\n');
      
      // Crear 20 espacios de parqueadero
      for (let i = 1; i <= 20; i++) {
        const piso = Math.ceil(i / 10); // 10 espacios por piso
        const tipo = i <= 15 ? 'automovil' : 'moto'; // Primeros 15 para autos, últimos 5 para motos
        
        await pool.query(
          `INSERT INTO espacios_parqueadero (numero_espacio, piso, tipo, estado) 
           VALUES ($1, $2, $3, 'disponible')`,
          [`E-${i.toString().padStart(3, '0')}`, piso, tipo]
        );
      }
      
      console.log('✅ 20 espacios creados exitosamente\n');
    } else {
      console.log('✅ Ya hay espacios en la base de datos\n');
    }
    
    // Mostrar todos los espacios
    const espacios = await pool.query(
      'SELECT * FROM espacios_parqueadero ORDER BY piso, numero_espacio'
    );
    
    console.log('📋 ESPACIOS EN LA BASE DE DATOS:');
    console.log('================================');
    espacios.rows.forEach(e => {
      const icon = e.estado === 'disponible' ? '✓' : '✗';
      console.log(`${icon} ${e.numero_espacio} | Piso ${e.piso} | ${e.tipo} | ${e.estado}`);
    });
    console.log('================================\n');
    
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    pool.end();
    process.exit(1);
  }
}

seedEspacios();
