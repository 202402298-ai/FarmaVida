const pool = require('../config/db');

const findAll = async () => {
  const result = await pool.query(
    `SELECT u.id, u.nombre, u.email, u.activo, r.nombre AS rol, u.rol_id 
     FROM usuarios u 
     JOIN roles r ON u.rol_id = r.id 
     ORDER BY u.id ASC`
  );
  return result.rows;
};

const createUsuario = async ({ nombre, email, password, rol_id }) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, email, password, rol_id)
     VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol_id, activo`,
    [nombre, email, password, rol_id]
  );
  return result.rows[0];
};

const updateRol = async (id, rol_id) => {
  const result = await pool.query(
    `UPDATE usuarios SET rol_id = $1 WHERE id = $2 RETURNING id, rol_id`,
    [rol_id, id]
  );
  return result.rows[0];
};

const toggleActivo = async (id) => {
  // First, get the current state
  const current = await pool.query(`SELECT activo FROM usuarios WHERE id = $1`, [id]);
  if (current.rows.length === 0) return null;
  
  const nuevoEstado = !current.rows[0].activo;
  
  const result = await pool.query(
    `UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id, activo`,
    [nuevoEstado, id]
  );
  return result.rows[0];
};

module.exports = { findAll, createUsuario, updateRol, toggleActivo };
