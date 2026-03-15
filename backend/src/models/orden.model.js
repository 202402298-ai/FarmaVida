const pool = require('../config/db');

const getAll = async () => {
  const result = await pool.query(
    `SELECT o.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre
     FROM ordenes_compra o
     JOIN proveedores p ON o.proveedor_id = p.id
     JOIN usuarios u ON o.usuario_id = u.id
     ORDER BY o.created_at DESC`
  );
  return result.rows;
};

const getById = async (id) => {
  const orden = await pool.query(
    `SELECT o.*, p.nombre AS proveedor_nombre, u.nombre AS usuario_nombre
     FROM ordenes_compra o
     JOIN proveedores p ON o.proveedor_id = p.id
     JOIN usuarios u ON o.usuario_id = u.id
     WHERE o.id = $1`, [id]
  );
  const detalle = await pool.query(
    `SELECT d.*, pr.nombre AS producto_nombre, pr.codigo
     FROM detalle_orden d
     JOIN productos pr ON d.producto_id = pr.id
     WHERE d.orden_id = $1`, [id]
  );
  if (!orden.rows[0]) return null;
  return { ...orden.rows[0], detalle: detalle.rows };
};

const create = async ({ proveedor_id, usuario_id, notas, items }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Generar número de orden
    const count = await client.query(`SELECT COUNT(*) FROM ordenes_compra`);
    const numero = `OC-${new Date().getFullYear()}-${String(parseInt(count.rows[0].count) + 1).padStart(3, '0')}`;

    // Calcular total
    const total = items.reduce((sum, i) => sum + (i.cantidad * i.precio_unitario), 0);

    const orden = await client.query(
      `INSERT INTO ordenes_compra (numero_orden, proveedor_id, usuario_id, notas, total)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [numero, proveedor_id, usuario_id, notas, total]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO detalle_orden (orden_id, producto_id, cantidad, precio_unitario)
         VALUES ($1,$2,$3,$4)`,
        [orden.rows[0].id, item.producto_id, item.cantidad, item.precio_unitario]
      );
    }

    await client.query('COMMIT');
    return orden.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const cambiarEstado = async (id, estado) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orden = await client.query(
      `UPDATE ordenes_compra SET estado=$1, fecha_recepcion=$2
       WHERE id=$3 RETURNING *`,
      [estado, estado === 'completada' ? new Date() : null, id]
    );

    // Si se completa, actualizar stock
    if (estado === 'completada') {
      const detalle = await client.query(
        `SELECT * FROM detalle_orden WHERE orden_id=$1`, [id]
      );
      for (const item of detalle.rows) {
        await client.query(
          `UPDATE productos SET stock_actual = stock_actual + $1 WHERE id=$2`,
          [item.cantidad, item.producto_id]
        );
      }
    }

    await client.query('COMMIT');
    return orden.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { getAll, getById, create, cambiarEstado };