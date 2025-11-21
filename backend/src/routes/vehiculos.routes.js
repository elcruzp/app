const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculos.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas las rutas de vehículos requieren autenticación
router.use(authMiddleware);

// GET /api/vehiculos - Obtener todos los vehículos del usuario
router.get('/', vehiculosController.getAll);

// GET /api/vehiculos/:id - Obtener un vehículo por ID
router.get('/:id', vehiculosController.getById);

// POST /api/vehiculos - Crear un nuevo vehículo
router.post('/', vehiculosController.create);

// PUT /api/vehiculos/:id - Actualizar un vehículo
router.put('/:id', vehiculosController.update);

// DELETE /api/vehiculos/:id - Eliminar un vehículo
router.delete('/:id', vehiculosController.delete);

module.exports = router;
