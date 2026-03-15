const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { findByEmail, createUsuario } = require('../models/auth.model');

const JWT_SECRET = 'farmavida_secret_key_2024';
const JWT_EXPIRES_IN = '8h';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const usuario = await findByEmail(email);
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (err) {
    console.error('ERROR LOGIN:', err);
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Todos los campos son requeridos' });

    const existe = await findByEmail(email);
    if (existe)
      return res.status(400).json({ error: 'El email ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const nuevo = await createUsuario({ nombre, email, password: hash, rol_id: rol_id || 2 });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevo });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor', detalle: err.message });
  }
};

module.exports = { login, register };