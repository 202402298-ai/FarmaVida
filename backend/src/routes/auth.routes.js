const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.post('/login', login);
router.post('/register', register);

// Rutas de Google
// Ruta de diagnóstico: construye manualmente la URL de autorización de Google y redirige (temporal)
router.get('/google/test', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: process.env.GOOGLE_CALLBACK_URL || '',
    response_type: 'code',
    scope: 'profile email',
    access_type: 'offline',
    prompt: 'consent'
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  console.log('DEBUG: /api/auth/google/test ->', authUrl);
  return res.redirect(authUrl);
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:4200/login?error=google', session: false }),
  (req, res) => {
    const usuario = req.user;
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'farmavida_secret_key_2024',
      { expiresIn: '8h' }
    );
    // Redirige al frontend con el token
    res.redirect(`http://localhost:4200/auth/callback?token=${token}&usuario=${encodeURIComponent(JSON.stringify({ id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }))}`);
  }
);

module.exports = router;