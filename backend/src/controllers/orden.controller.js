const Orden = require('../models/orden.model');

const getAll = async (req, res) => {
  try { res.json(await Orden.getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const orden = await Orden.getById(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(orden);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const { proveedor_id, notas, items } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ error: 'Debe agregar al menos un producto' });
    const nueva = await Orden.create({
      proveedor_id,
      usuario_id: req.usuario.id,
      notas,
      items
    });
    res.status(201).json({ mensaje: 'Orden creada', orden: nueva });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const estados = ['pendiente', 'completada', 'cancelada'];
    if (!estados.includes(estado))
      return res.status(400).json({ error: 'Estado inválido' });
    const orden = await Orden.cambiarEstado(req.params.id, estado);
    res.json({ mensaje: `Orden ${estado}`, orden });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, cambiarEstado };