const express = require('express');
const authRoutes = require('./auth.routes');
const espaciosRoutes = require('./espacios.routes');
const vehiculosRoutes = require('./vehiculos.routes');
const reservasRoutes = require('./reservas.routes');

function setupRoutes(app) {
  // Rutas de autenticación
  app.use('/api/auth', authRoutes);
  
  // Rutas de espacios
  app.use('/api/espacios', espaciosRoutes);
  
  // Rutas de vehículos
  app.use('/api/vehiculos', vehiculosRoutes);
  
  // Rutas de reservas
  app.use('/api/reservas', reservasRoutes);
  
  // Ruta raíz - Información del API
  app.get('/', (req, res) => {
    res.json({
      name: 'API Sistema de Parqueadero',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me'
        },
        espacios: {
          all: 'GET /api/espacios',
          disponibles: 'GET /api/espacios/disponibles'
        },
        vehiculos: 'GET /api/vehiculos (requiere auth)',
        reservas: 'GET /api/reservas (requiere auth)'
      }
    });
  });
  
  // Ruta de health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
  });
  
  // Ruta 404
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada', path: req.originalUrl });
  });
}

module.exports = setupRoutes;
