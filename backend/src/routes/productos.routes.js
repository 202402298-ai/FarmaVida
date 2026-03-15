const router = require('express').Router();
const ctrl = require('../controllers/producto.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/',           verificarToken, ctrl.getAll);
router.get('/stock-bajo', verificarToken, ctrl.getStockBajo);
router.get('/:id',        verificarToken, ctrl.getById);
router.post('/',          verificarToken, soloAdmin, ctrl.create);
router.put('/:id',        verificarToken, soloAdmin, ctrl.update);
router.delete('/:id',     verificarToken, soloAdmin, ctrl.remove);

module.exports = router;