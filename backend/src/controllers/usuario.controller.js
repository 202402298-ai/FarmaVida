const bcrypt = require('bcryptjs');
const { findAll, createUsuario, updateRol, toggleActivo } = require('../models/usuario.model');
const { findByEmail } = require('../models/auth.model'); // Reusing this to check email exists

const getAll = async (req, res) => {
  try {
    const usuarios = await findAll();
    res.json(usuarios);
  } catch (err) {
    console.error('ERROR GET USUARIOS:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;

    if (!nombre || !email || !password || !rol_id)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const existe = await findByEmail(email);
    if (existe)
      return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const nuevo = await createUsuario({ nombre, email, password: hash, rol_id });

    res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevo });
  } catch (err) {
    console.error('ERROR CREATE USUARIO:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol_id } = req.body;

    if (!rol_id)
      return res.status(400).json({ error: 'El rol_id es requerido' });

    const actualizado = await updateRol(id, rol_id);
    if (!actualizado)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ mensaje: 'Rol de usuario actualizado', usuario: actualizado });
  } catch (err) {
    console.error('ERROR UPDATE ROL:', err);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deactivating oneself simply as a safety measure (though we could refine this)
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({ error: 'No puedes desactivar tu propio usuario' });
    }

    const actualizado = await toggleActivo(id);
    if (!actualizado)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ mensaje: 'Estado de usuario actualizado', usuario: actualizado });
  } catch (err) {
    console.error('ERROR TOGGLE ESTADO:', err);
    res.status(500).json({ error: 'Error al cambiar estado del usuario' });
  }
};

module.exports = { getAll, create, updateRole, toggleStatus };
