const express = require('express');
const router = express.Router();
const espaciosController = require('../controllers/espacios.controller');
const authMiddleware = require('../middleware/auth.middleware');

// GET /api/espacios - Obtener todos los espacios
router.get('/', espaciosController.getAll);

// GET /api/espacios/disponibles - Obtener espacios disponibles
router.get('/disponibles', espaciosController.getDisponibles);

// GET /api/espacios/:id - Obtener un espacio por ID
router.get('/:id', espaciosController.getById);

// POST /api/espacios - Crear un nuevo espacio (requiere autenticación)
router.post('/', authMiddleware, espaciosController.create);

// PUT /api/espacios/:id - Actualizar un espacio (requiere autenticación)
router.put('/:id', authMiddleware, espaciosController.update);

// DELETE /api/espacios/:id - Eliminar un espacio (requiere autenticación)
router.delete('/:id', authMiddleware, espaciosController.delete);

module.exports = router;
