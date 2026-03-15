const Proveedor = require('../models/proveedor.model');

const getAll = async (req, res) => {
  try { res.json(await Proveedor.getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

const getById = async (req, res) => {
  try {
    const p = await Proveedor.getById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(p);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const nuevo = await Proveedor.create(req.body);
    res.status(201).json({ mensaje: 'Proveedor creado', proveedor: nuevo });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const actualizado = await Proveedor.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json({ mensaje: 'Proveedor actualizado', proveedor: actualizado });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const eliminado = await Proveedor.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json({ mensaje: 'Proveedor eliminado' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getById, create, update, remove };