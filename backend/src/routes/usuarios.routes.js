const router = require('express').Router();
const ctrl = require('../controllers/usuario.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

router.get('/',           verificarToken, soloAdmin, ctrl.getAll);
router.post('/',          verificarToken, soloAdmin, ctrl.create);
router.put('/:id/rol',    verificarToken, soloAdmin, ctrl.updateRole);
router.patch('/:id/estado',verificarToken, soloAdmin, ctrl.toggleStatus);

module.exports = router;