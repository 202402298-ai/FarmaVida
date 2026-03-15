const pool = require('../config/db');

const findByEmail = async (email) => {
  const result = await pool.query(
    `SELECT u.*, r.nombre AS rol 
     FROM usuarios u 
     JOIN roles r ON u.rol_id = r.id 
     WHERE u.email = $1 AND u.activo = TRUE`,
    [email]
  );
  return result.rows[0];
};

const createUsuario = async ({ nombre, email, password, rol_id }) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password, rol_id)
     VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol_id`,
    [nombre, email, password, rol_id]
  );
  return result.rows[0];
};

module.exports = { findByEmail, createUsuario };