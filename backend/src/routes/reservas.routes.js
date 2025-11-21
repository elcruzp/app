const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservas.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de reservas requieren autenticación
router.use(authMiddleware);

// GET /api/reservas - Obtener todas las reservas del usuario
router.get('/', reservasController.getAll);

// GET /api/reservas/activas - Obtener reservas activas del usuario
router.get('/activas', reservasController.getActivas);

// GET /api/reservas/:id - Obtener una reserva por ID
router.get('/:id', reservasController.getById);

// POST /api/reservas - Crear una nueva reserva
router.post('/', reservasController.create);

// PUT /api/reservas/:id/terminar - Terminar una reserva
router.put('/:id/terminar', reservasController.terminar);

// DELETE /api/reservas/:id - Eliminar una reserva
router.delete('/:id', reservasController.delete);

module.exports = router;
