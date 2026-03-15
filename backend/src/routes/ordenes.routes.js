const router = require('express').Router();
const ctrl = require('../controllers/orden.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/',               verificarToken, ctrl.getAll);
router.get('/:id',            verificarToken, ctrl.getById);
router.post('/',              verificarToken, ctrl.create);
router.patch('/:id/estado',   verificarToken, soloAdmin, ctrl.cambiarEstado);

module.exports = router;