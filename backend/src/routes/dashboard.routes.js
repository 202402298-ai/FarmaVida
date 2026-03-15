const router = require('express').Router();
const pool = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, async (req, res) => {
  try {
    const resumen = await pool.query('SELECT * FROM vw_dashboard');
    const stockBajo = await pool.query('SELECT * FROM vw_productos_stock_bajo LIMIT 5');
    const ordenesMes = await pool.query(
      `SELECT TO_CHAR(fecha_orden, 'Mon') AS mes,
              COUNT(*) AS total
       FROM ordenes_compra
       WHERE fecha_orden >= NOW() - INTERVAL '6 months'
       GROUP BY mes, DATE_TRUNC('month', fecha_orden)
       ORDER BY DATE_TRUNC('month', fecha_orden)`
    );
    res.json({
      resumen: resumen.rows[0],
      stock_bajo: stockBajo.rows,
      ordenes_por_mes: ordenesMes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;