const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/constants');
const setupRoutes = require('./routes');
const dbService = require('./services/database.service');

class App {
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  setupMiddlewares() {
    // CORS - Configuración permisiva para desarrollo
    this.app.use(cors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Logger
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    setupRoutes(this.app);
  }

  async start() {
    // Probar conexión a la base de datos
    const dbConnected = await dbService.testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos PostgreSQL');
      console.error('⚠️  Verifica la configuración en el archivo .env');
      process.exit(1);
    }
    
    this.app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Backend listening on http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
      console.log(`✅ PostgreSQL conectado exitosamente`);
      console.log('=================================');
    });
  }
}

module.exports = App;
