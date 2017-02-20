var express = require('express');
var router = express.Router();
var controller = require('./../controller/col_usuarios');
var auxFn = require('./auxFn');

router.post('/create', auxFn.fnEnsureAuthorized(['recepcao', 'profissional', 'administrador']),
  controller.doUserCreate);
router.post('/list', auxFn.fnEnsureAuthorized(['recepcao', 'profissional', 'administrador']),
  controller.doUserList);
router.post('/login', controller.doUserLogin);
router.post('/recoveryPass', controller.doRecoveryPass);
router.post('/select', auxFn.fnEnsureAuthorized(['usuario', 'recepcao', 'profissional', 'administrador']),
  controller.doUserSelect);
router.post('/update', auxFn.fnEnsureAuthorized(['usuario', 'recepcao', 'profissional', 'administrador']),
  controller.doUserUpdate);


module.exports = router;
