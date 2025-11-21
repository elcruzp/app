# Backend - Sistema de Parqueadero

Backend API REST para un sistema de gestión de parqueadero con autenticación JWT.

## 🚀 Características

- **Autenticación JWT**: Registro e inicio de sesión seguro
- **CRUD Completo**: Gestión de vehículos, espacios y reservas
- **Arquitectura Modular**: Separación de controladores, rutas, servicios y middleware
- **Base de datos PostgreSQL**: Almacenamiento robusto con pgAdmin4

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── constants.js          # Configuración y constantes
│   ├── controllers/
│   │   ├── auth.controller.js    # Lógica de autenticación
│   │   ├── espacios.controller.js # CRUD de espacios
│   │   ├── vehiculos.controller.js # CRUD de vehículos
│   │   └── reservas.controller.js # CRUD de reservas
│   ├── middleware/
│   │   └── auth.middleware.js    # Validación de JWT
│   ├── routes/
│   │   ├── auth.routes.js        # Rutas de autenticación
│   │   ├── espacios.routes.js    # Rutas de espacios
│   │   ├── vehiculos.routes.js   # Rutas de vehículos
│   │   ├── reservas.routes.js    # Rutas de reservas
│   │   └── index.js              # Configurador de rutas
│   ├── services/
│   │   └── database.service.js   # Servicio de base de datos
│   └── app.js                     # Configuración de Express
├── db.json                        # Base de datos JSON
├── index.js                       # Punto de entrada
└── package.json
```

## 🛠️ Instalación

1. **Configurar PostgreSQL:**

   Crea una base de datos llamada `parqueadero` en pgAdmin4 y ejecuta el siguiente script SQL:

   ```sql
   CREATE TABLE usuarios (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     nombre VARCHAR(255) NOT NULL,
     telefono VARCHAR(20),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE vehiculos (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
     placa VARCHAR(10) UNIQUE NOT NULL,
     marca VARCHAR(100) NOT NULL,
     modelo VARCHAR(100) NOT NULL,
     color VARCHAR(50) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE espacios_parqueadero (
     id SERIAL PRIMARY KEY,
     numero VARCHAR(10) UNIQUE NOT NULL,
     piso INTEGER NOT NULL,
     estado VARCHAR(20) DEFAULT 'disponible',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

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

   -- Insertar 8 espacios de parqueadero (4 por piso)
   INSERT INTO espacios_parqueadero (numero, piso, estado) VALUES
   ('A1', 1, 'disponible'),
   ('A2', 1, 'disponible'),
   ('A3', 1, 'disponible'),
   ('A4', 1, 'disponible'),
   ('B1', 2, 'disponible'),
   ('B2', 2, 'disponible'),
   ('B3', 2, 'disponible'),
   ('B4', 2, 'disponible');
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=parqueadero
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   JWT_SECRET=secret123
   PORT=4000
   ```

4. **Iniciar el servidor:**
   ```bash
   npm start
   ```

El servidor estará corriendo en `http://localhost:4000` y probará la conexión a PostgreSQL al iniciar.

## 📚 API Endpoints

### Autenticación

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "telefono": "3001234567"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

#### Obtener usuario actual
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Espacios

#### Listar todos los espacios
```http
GET /api/espacios
```

#### Listar espacios disponibles
```http
GET /api/espacios/disponibles
```

#### Obtener espacio por ID
```http
GET /api/espacios/:id
```

#### Crear espacio (requiere autenticación)
```http
POST /api/espacios
Authorization: Bearer {token}
Content-Type: application/json

{
  "numero_espacio": "A1",
  "piso": 1,
  "tipo": "compacto"
}
```

#### Actualizar espacio (requiere autenticación)
```http
PUT /api/espacios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "numero_espacio": "A1",
  "piso": 1,
  "tipo": "grande",
  "available": true
}
```

#### Eliminar espacio (requiere autenticación)
```http
DELETE /api/espacios/:id
Authorization: Bearer {token}
```

### Vehículos (todas requieren autenticación)

#### Listar mis vehículos
```http
GET /api/vehiculos
Authorization: Bearer {token}
```

#### Obtener vehículo por ID
```http
GET /api/vehiculos/:id
Authorization: Bearer {token}
```

#### Crear vehículo
```http
POST /api/vehiculos
Authorization: Bearer {token}
Content-Type: application/json

{
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla"
}
```

#### Actualizar vehículo
```http
PUT /api/vehiculos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla 2023"
}
```

#### Eliminar vehículo
```http
DELETE /api/vehiculos/:id
Authorization: Bearer {token}
```

### Reservas (todas requieren autenticación)

#### Listar mis reservas
```http
GET /api/reservas
Authorization: Bearer {token}
```

#### Listar reservas activas
```http
GET /api/reservas/activas
Authorization: Bearer {token}
```

#### Obtener reserva por ID
```http
GET /api/reservas/:id
Authorization: Bearer {token}
```

#### Crear reserva
```http
POST /api/reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehiculo_id": 1,
  "espacio_id": 1,
  "fecha_entrada": "2025-11-20T10:00:00Z"
}
```

#### Terminar reserva
```http
PUT /api/reservas/:id/terminar
Authorization: Bearer {token}
```

#### Eliminar reserva
```http
DELETE /api/reservas/:id
Authorization: Bearer {token}
```

### Health Check
```http
GET /api/health
```

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para la autenticación. Después de hacer login o registro, incluye el token en el header Authorization:

```
Authorization: Bearer {tu_token_aqui}
```

## 📦 Dependencias

- **express**: Framework web
- **cors**: Manejo de CORS
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación JWT

## 🧪 Probar el Backend

Puedes usar herramientas como:
- Postman
- Thunder Client (extensión de VS Code)
- curl
- Tu frontend de Ionic React

Ejemplo con curl:
```bash
# Registro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","nombre":"Test"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 🔄 Modelo de Datos

### Usuario
```json
{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "nombre": "Juan Pérez",
  "telefono": "3001234567",
  "password": "$2a$08$..." // hasheado
}
```

### Espacio
```json
{
  "id": 1,
  "numero_espacio": "A1",
  "piso": 1,
  "tipo": "compacto", // "compacto" | "grande" | "moto"
  "available": true
}
```

### Vehículo
```json
{
  "id": 1,
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "user_id": 1
}
```

### Reserva
```json
{
  "id": 1,
  "vehiculo_id": 1,
  "espacio_id": 1,
  "fecha_entrada": "2025-11-20T10:00:00Z",
  "fecha_salida": null,
  "user_id": 1,
  "terminado": false
}
```

## 🚨 Manejo de Errores

El backend responde con códigos HTTP apropiados:
- **200**: OK
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

Ejemplo de respuesta de error:
```json
{
  "error": "Descripción del error"
}
```

## 👨‍💻 Autor

Desarrollado para el proyecto de Programación Móvil - V Semestre
