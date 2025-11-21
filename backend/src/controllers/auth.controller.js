const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbService = require('../services/database.service');
const { JWT_SECRET } = require('../config/constants');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, nombre, telefono } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y password son requeridos' });
      }
      
      const existingUser = await dbService.findUserByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya existe' });
      }
      
      const hash = bcrypt.hashSync(password, 8);
      const user = await dbService.createUser(email, nombre || '', telefono || '', hash);
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          telefono: user.telefono
        }
      });
    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y password son requeridos' });
      }
      
      const user = await dbService.findUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      const ok = bcrypt.compareSync(password, user.password);
      
      if (!ok) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          telefono: user.telefono
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

  async getMe(req, res) {
    try {
      const user = await dbService.findUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const { password, ...rest } = user;
      res.json(rest);
    } catch (error) {
      console.error('Error en getMe:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }
}

module.exports = new AuthController();
