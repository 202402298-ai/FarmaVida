const router = require('express').Router();
const ctrl = require('../controllers/categoria.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/',    verificarToken, ctrl.getAll);
router.post('/',   verificarToken, soloAdmin, ctrl.create);
router.put('/:id', verificarToken, soloAdmin, ctrl.update);
router.delete('/:id', verificarToken, soloAdmin, ctrl.remove);

module.exports = router;