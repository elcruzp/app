const dbService = require('../services/database.service');

class EspaciosController {
  // GET /api/espacios
  async getAll(req, res) {
    try {
      const espacios = await dbService.getAllEspacios();
      const espaciosFormatted = espacios.map(e => ({
        ...e,
        disponible: e.estado === 'disponible'
      }));
      res.json(espaciosFormatted);
    } catch (error) {
      console.error('Error en getAll espacios:', error);
      res.status(500).json({ error: 'Error al obtener espacios' });
    }
  }

  // GET /api/espacios/disponibles
  async getDisponibles(req, res) {
    try {
      const disponibles = await dbService.getEspaciosDisponibles();
      const espaciosFormatted = disponibles.map(e => ({
        ...e,
        disponible: true
      }));
      res.json(espaciosFormatted);
    } catch (error) {
      console.error('Error en getDisponibles:', error);
      res.status(500).json({ error: 'Error al obtener espacios disponibles' });
    }
  }

  // GET /api/espacios/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);
      const espacio = await dbService.findEspacioById(id);
      
      if (!espacio) {
        return res.status(404).json({ error: 'Espacio no encontrado' });
      }
      
      res.json({
        ...espacio,
        disponible: espacio.estado === 'disponible'
      });
    } catch (error) {
      console.error('Error en getById espacio:', error);
      res.status(500).json({ error: 'Error al obtener espacio' });
    }
  }

  // POST /api/espacios
  async create(req, res) {
    try {
      const { numero_espacio, piso, tipo } = req.body;
      
      if (!numero_espacio || !piso || !tipo) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      
      // Esta funcionalidad requiere agregar método al servicio
      res.status(501).json({ error: 'Funcionalidad no implementada' });
    } catch (error) {
      console.error('Error en create espacio:', error);
      res.status(500).json({ error: 'Error al crear espacio' });
    }
  }

  // PUT /api/espacios/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;
      
      if (estado) {
        const espacio = await dbService.updateEspacioEstado(id, estado);
        if (!espacio) {
          return res.status(404).json({ error: 'Espacio no encontrado' });
        }
        res.json({
          ...espacio,
          disponible: espacio.estado === 'disponible'
        });
      } else {
        res.status(400).json({ error: 'Estado es requerido' });
      }
    } catch (error) {
      console.error('Error en update espacio:', error);
      res.status(500).json({ error: 'Error al actualizar espacio' });
    }
  }

  // DELETE /api/espacios/:id
  async delete(req, res) {
    try {
      res.status(501).json({ error: 'Funcionalidad no implementada' });
    } catch (error) {
      console.error('Error en delete espacio:', error);
      res.status(500).json({ error: 'Error al eliminar espacio' });
    }
  }
}

module.exports = new EspaciosController();
