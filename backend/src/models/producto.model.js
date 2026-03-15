const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     WHERE p.activo = TRUE
     ORDER BY p.nombre`
  );
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     WHERE p.id = $1 AND p.activo = TRUE`,
    [id]
  );
  return result.rows[0];
};

const create = async ({ codigo, nombre, descripcion, precio, stock_actual, stock_minimo, categoria_id, imagen_url }) => {
  const result = await pool.query(
    `INSERT INTO productos (codigo, nombre, descripcion, precio, stock_actual, stock_minimo, categoria_id, imagen_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [codigo, nombre, descripcion, precio, stock_actual, stock_minimo, categoria_id, imagen_url]
  );
  return result.rows[0];
};

const update = async (id, { codigo, nombre, descripcion, precio, stock_actual, stock_minimo, categoria_id, imagen_url }) => {
  const result = await pool.query(
    `UPDATE productos SET codigo=$1, nombre=$2, descripcion=$3, precio=$4,
     stock_actual=$5, stock_minimo=$6, categoria_id=$7, imagen_url=$8
     WHERE id=$9 AND activo=TRUE RETURNING *`,
    [codigo, nombre, descripcion, precio, stock_actual, stock_minimo, categoria_id, imagen_url, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    `UPDATE productos SET activo=FALSE WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

const getStockBajo = async () => {
  const result = await pool.query(`SELECT * FROM vw_productos_stock_bajo`);
  return result.rows;
};

module.exports = { getAll, getById, create, update, remove, getStockBajo };