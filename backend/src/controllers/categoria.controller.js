const Categoria = require('../models/categoria.model');

const getAll = async (req, res) => {
  try { res.json(await Categoria.getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const nueva = await Categoria.create(req.body);
    res.status(201).json({ mensaje: 'Categoría creada', categoria: nueva });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const actualizada = await Categoria.update(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría actualizada', categoria: actualizada });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    const eliminada = await Categoria.remove(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, create, update, remove };