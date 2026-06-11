const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findByEmail, createUsuario } = require('../models/auth.model');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let usuario = await findByEmail(email);

    if (!usuario) {
      // Crear usuario nuevo si no existe
      usuario = await createUsuario({
        nombre: profile.displayName,
        email: email,
        password: null, // usuarios de Google no tienen contraseña en la BD (ahora NULL es permitido)
        rol_id: 1  // Admin por defecto
      });
    }

    return done(null, usuario);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;