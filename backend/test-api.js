// Script para probar todos los endpoints del backend
// Asegúrate de que el backend esté corriendo en http://localhost:4000
// Ejecutar con: node test-api.js

const axios = require('axios');

const API_URL = 'http://localhost:4000/api';
let token = '';
let userId = 0;
let vehiculoId = 0;
let espacioId = 0;
let reservaId = 0;

async function test() {
  console.log('🧪 Iniciando pruebas del backend...');
  console.log('🔗 Conectando a:', API_URL);
  console.log('');

  try {
    // 1. Health Check
    console.log('1️⃣ Probando Health Check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health:', health.data);
    console.log('');

    // 2. Registro
    console.log('2️⃣ Probando Registro...');
    const email = `test${Date.now()}@test.com`;
    const register = await axios.post(`${API_URL}/auth/register`, {
      email,
      password: '123456',
      nombre: 'Usuario Test',
      telefono: '3001234567'
    });
    token = register.data.token;
    userId = register.data.user.id;
    console.log('✅ Registro exitoso:', register.data.user);
    console.log('');

    // 3. Login
    console.log('3️⃣ Probando Login...');
    const login = await axios.post(`${API_URL}/auth/login`, {
      email,
      password: '123456'
    });
    console.log('✅ Login exitoso:', login.data.user);
    console.log('');

    // 4. Get Me
    console.log('4️⃣ Probando Get Me...');
    const me = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Usuario actual:', me.data);
    console.log('');

    // 5. Listar espacios disponibles
    console.log('5️⃣ Probando Listar Espacios Disponibles...');
    const espacios = await axios.get(`${API_URL}/espacios/disponibles`);
    console.log('✅ Espacios disponibles:', espacios.data.length);
    if (espacios.data.length > 0) {
      espacioId = espacios.data[0].id;
      console.log('   Primer espacio:', espacios.data[0]);
    }
    console.log('');

    // 6. Crear vehículo
    console.log('6️⃣ Probando Crear Vehículo...');
    const vehiculo = await axios.post(`${API_URL}/vehiculos`, {
      placa: 'ABC123',
      marca: 'Toyota',
      modelo: 'Corolla'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    vehiculoId = vehiculo.data.id;
    console.log('✅ Vehículo creado:', vehiculo.data);
    console.log('');

    // 7. Listar vehículos
    console.log('7️⃣ Probando Listar Vehículos...');
    const vehiculos = await axios.get(`${API_URL}/vehiculos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Mis vehículos:', vehiculos.data.length);
    console.log('');

    // 8. Crear reserva
    console.log('8️⃣ Probando Crear Reserva...');
    if (espacioId && vehiculoId) {
      const reserva = await axios.post(`${API_URL}/reservas`, {
        vehiculo_id: vehiculoId,
        espacio_id: espacioId,
        fecha_entrada: new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      reservaId = reserva.data.id;
      console.log('✅ Reserva creada:', reserva.data);
    } else {
      console.log('⚠️  No se puede crear reserva (falta espacio o vehículo)');
    }
    console.log('');

    // 9. Listar reservas
    console.log('9️⃣ Probando Listar Reservas...');
    const reservas = await axios.get(`${API_URL}/reservas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Mis reservas:', reservas.data.length);
    console.log('');

    // 10. Listar reservas activas
    console.log('🔟 Probando Listar Reservas Activas...');
    const activas = await axios.get(`${API_URL}/reservas/activas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Reservas activas:', activas.data.length);
    console.log('');

    // 11. Terminar reserva
    console.log('1️⃣1️⃣ Probando Terminar Reserva...');
    if (reservaId) {
      const terminar = await axios.put(`${API_URL}/reservas/${reservaId}/terminar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Reserva terminada:', terminar.data);
    }
    console.log('');

    // 12. Actualizar vehículo
    console.log('1️⃣2️⃣ Probando Actualizar Vehículo...');
    if (vehiculoId) {
      const updated = await axios.put(`${API_URL}/vehiculos/${vehiculoId}`, {
        modelo: 'Corolla 2024'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Vehículo actualizado:', updated.data);
    }
    console.log('');

    // 13. Eliminar vehículo
    console.log('1️⃣3️⃣ Probando Eliminar Vehículo...');
    if (vehiculoId) {
      await axios.delete(`${API_URL}/vehiculos/${vehiculoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Vehículo eliminado');
    }
    console.log('');

    console.log('✨ ¡Todas las pruebas pasaron exitosamente! ✨');
    console.log('');
    console.log('📊 Resumen:');
    console.log('   - Health check: OK');
    console.log('   - Autenticación: OK');
    console.log('   - Espacios: OK');
    console.log('   - Vehículos: OK');
    console.log('   - Reservas: OK');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Ejecutar pruebas
test();
