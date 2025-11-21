const axios = require('axios');

async function createUser() {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/register', {
      email: 'jcruz24p@gmail.com',
      password: '123456',
      nombre: 'Juan Cruz',
      telefono: '1234567890'
    });
    console.log('✅ Usuario creado exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('⚠️  Error al crear usuario:', error.response.data);
      if (error.response.data.error === 'El email ya existe') {
        console.log('ℹ️  El usuario ya existe, puedes hacer login con:');
        console.log('   Email: jcruz24p@gmail.com');
        console.log('   Password: 123456');
      }
    } else {
      console.log('❌ Error de conexión:', error.message);
    }
  }
}

createUser();
