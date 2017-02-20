var express = require('express');
var router = express.Router();
var controller = require('./../controller/col_aux_drgs');
var auxFn = require('./auxFn');

router.post('/list', auxFn.fnEnsureAuthorized(['usuario', 'recepcao', 'profissional', 'administrador']),
  controller.doDrgList);

module.exports = router;
