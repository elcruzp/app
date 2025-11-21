const dbService = require('../services/database.service');

class ReservasController {
  // GET /api/reservas
  async getAll(req, res) {
    try {
      const reservas = await dbService.findReservasByUserId(req.user.id);
      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ error: 'Error al obtener reservas' });
    }
  }

  // GET /api/reservas/activas
  async getActivas(req, res) {
    try {
      const reservasActivas = await dbService.findReservasActivasByUserId(req.user.id);
      res.json(reservasActivas);
    } catch (error) {
      console.error('Error al obtener reservas activas:', error);
      res.status(500).json({ error: 'Error al obtener reservas activas' });
    }
  }

  // GET /api/reservas/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      const reservas = await dbService.findReservasByUserId(req.user.id);
      const reserva = reservas.find(r => r.id === id);
      
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      
      res.json(reserva);
    } catch (error) {
      console.error('Error al obtener reserva:', error);
      res.status(500).json({ error: 'Error al obtener reserva' });
    }
  }

  // POST /api/reservas
  async create(req, res) {
    try {
      const { vehiculo_id, espacio_id, fecha_entrada } = req.body;
      
      if (!vehiculo_id || !espacio_id) {
        return res.status(400).json({ error: 'vehiculo_id y espacio_id son requeridos' });
      }
      
      // Validar fecha de entrada no sea en el pasado
      const fechaEntradaDate = new Date(fecha_entrada || new Date());
      const ahora = new Date();
      
      if (fechaEntradaDate < ahora) {
        return res.status(400).json({ error: 'La fecha de entrada no puede ser anterior a la fecha actual' });
      }
      
      // Verificar que el vehículo pertenece al usuario
      const vehiculos = await dbService.findVehiculosByUserId(req.user.id);
      const vehiculo = vehiculos.find(v => v.id === vehiculo_id);
      
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      
      // Verificar que el espacio existe y está disponible
      const espacio = await dbService.findEspacioById(espacio_id);
      if (!espacio) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }
      
      if (espacio.estado !== 'disponible') {
        return res.status(400).json({ error: 'Espacio no disponible' });
      }
      
      // Verificar que el vehículo no tiene reservas activas
      const reservaActiva = await dbService.findReservaActivaByVehiculoId(vehiculo_id);
      
      if (reservaActiva) {
        return res.status(400).json({ error: 'Este vehículo ya tiene una reserva activa' });
      }
      
      // Crear reserva y actualizar espacio
      const nuevaReserva = await dbService.createReserva(
        vehiculo_id,
        espacio_id,
        fecha_entrada || new Date().toISOString(),
        req.user.id
      );
      
      await dbService.updateEspacioEstado(espacio_id, 'ocupado');
      
      // Obtener reserva con datos relacionados
      const reservas = await dbService.findReservasByUserId(req.user.id);
      const reservaCompleta = reservas.find(r => r.id === nuevaReserva.id);
      
      res.status(201).json(reservaCompleta);
    } catch (error) {
      console.error('Error al crear reserva:', error);
      res.status(500).json({ error: 'Error al crear reserva' });
    }
  }

  // PUT /api/reservas/:id/terminar
  async terminar(req, res) {
    try {
      const id = Number(req.params.id);
      const reservas = await dbService.findReservasByUserId(req.user.id);
      const reserva = reservas.find(r => r.id === id);
      
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      
      if (reserva.estado === 'terminada') {
        return res.status(400).json({ error: 'La reserva ya está terminada' });
      }
      
      // Terminar reserva y liberar espacio
      await dbService.terminarReserva(id, req.user.id);
      await dbService.updateEspacioEstado(reserva.espacio_id, 'disponible');
      
      // Obtener reserva actualizada
      const reservasActualizadas = await dbService.findReservasByUserId(req.user.id);
      const reservaTerminada = reservasActualizadas.find(r => r.id === id);
      
      res.json(reservaTerminada);
    } catch (error) {
      console.error('Error al terminar reserva:', error);
      res.status(500).json({ error: 'Error al terminar reserva' });
    }
  }

  // DELETE /api/reservas/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);
      const reservas = await dbService.findReservasByUserId(req.user.id);
      const reserva = reservas.find(r => r.id === id);
      
      if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }
      
      // Si la reserva no está terminada, liberar el espacio
      if (reserva.estado === 'activa') {
        await dbService.updateEspacioEstado(reserva.espacio_id, 'disponible');
      }
      
      await dbService.deleteReserva(id, req.user.id);
      
      res.json({ message: 'Reserva eliminada exitosamente', reserva });
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      res.status(500).json({ error: 'Error al eliminar reserva' });
    }
  }
}

module.exports = new ReservasController();
