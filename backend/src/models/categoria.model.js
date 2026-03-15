const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query(`SELECT * FROM categorias ORDER BY nombre`);
  return result.rows;
};

const create = async ({ nombre, descripcion }) => {
  const result = await pool.query(
    `INSERT INTO categorias (nombre, descripcion) VALUES ($1,$2) RETURNING *`,
    [nombre, descripcion]
  );
  return result.rows[0];
};

const update = async (id, { nombre, descripcion }) => {
  const result = await pool.query(
    `UPDATE categorias SET nombre=$1, descripcion=$2 WHERE id=$3 RETURNING *`,
    [nombre, descripcion, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    `DELETE FROM categorias WHERE id=$1 RETURNING *`, [id]
  );
  return result.rows[0];
};

module.exports = { getAll, create, update, remove };