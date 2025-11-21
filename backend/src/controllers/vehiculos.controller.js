const dbService = require('../services/database.service');

class VehiculosController {
  // GET /api/vehiculos
  async getAll(req, res) {
    try {
      const vehiculos = await dbService.findVehiculosByUserId(req.user.id);
      res.json(vehiculos);
    } catch (error) {
      console.error('Error en getAll vehiculos:', error);
      res.status(500).json({ error: 'Error al obtener vehículos' });
    }
  }

  // GET /api/vehiculos/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      const vehiculo = await dbService.findVehiculoById(id, req.user.id);
      
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      res.json(vehiculo);
    } catch (error) {
      console.error('Error en getById vehiculo:', error);
      res.status(500).json({ error: 'Error al obtener vehículo' });
    }
  }

  // POST /api/vehiculos
  async create(req, res) {
    try {
      const { placa, marca, modelo, color } = req.body;
      
      if (!placa) {
        return res.status(400).json({ error: 'La placa es requerida' });
      }
      
      // Verificar si ya existe un vehículo con esa placa para este usuario
      const existing = await dbService.findVehiculoByPlacaAndUserId(placa.toUpperCase(), req.user.id);
      if (existing) {
        return res.status(400).json({ error: 'Ya tienes un vehículo con esa placa' });
      }
      
      const vehiculo = await dbService.createVehiculo(
        placa.toUpperCase(),
        marca || '',
        modelo || '',
        color || '',
        req.user.id
      );
      
      res.status(201).json(vehiculo);
    } catch (error) {
      console.error('Error en create vehiculo:', error);
      res.status(500).json({ error: 'Error al crear vehículo' });
    }
  }

  // PUT /api/vehiculos/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { placa, marca, modelo, color } = req.body;
      
      const vehiculo = await dbService.updateVehiculo(
        id,
        placa ? placa.toUpperCase() : null,
        marca,
        modelo,
        color,
        req.user.id
      );
      
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      res.json(vehiculo);
    } catch (error) {
      console.error('Error en update vehiculo:', error);
      res.status(500).json({ error: 'Error al actualizar vehículo' });
    }
  }

  // DELETE /api/vehiculos/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      
      // Verificar que el vehículo no tiene reservas activas
      const reservaActiva = await dbService.findReservaActivaByVehiculoId(id);
      
      if (reservaActiva) {
        return res.status(400).json({ error: 'No puedes eliminar un vehículo con reservas activas. Termina primero la reserva.' });
      }
      
      const removed = await dbService.deleteVehiculo(id, req.user.id);
      
      if (!removed) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      res.json(removed);
    } catch (error) {
      console.error('Error en delete vehiculo:', error);
      res.status(500).json({ error: 'Error al eliminar vehículo' });
    }
  }
}

module.exports = new VehiculosController();
