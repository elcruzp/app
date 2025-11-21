const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
