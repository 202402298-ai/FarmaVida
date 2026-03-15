const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query(
    `SELECT * FROM proveedores WHERE activo=TRUE ORDER BY nombre`
  );
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM proveedores WHERE id=$1 AND activo=TRUE`, [id]
  );
  return result.rows[0];
};

const create = async ({ nombre, contacto, telefono, email, direccion }) => {
  const result = await pool.query(
    `INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [nombre, contacto, telefono, email, direccion]
  );
  return result.rows[0];
};

const update = async (id, { nombre, contacto, telefono, email, direccion }) => {
  const result = await pool.query(
    `UPDATE proveedores SET nombre=$1, contacto=$2, telefono=$3, email=$4, direccion=$5
     WHERE id=$6 AND activo=TRUE RETURNING *`,
    [nombre, contacto, telefono, email, direccion, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    `UPDATE proveedores SET activo=FALSE WHERE id=$1 RETURNING *`, [id]
  );
  return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };