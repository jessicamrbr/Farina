var express = require('express');
var router = express.Router();
var controller = require('./../controller/col_aux_generos');
var auxFn = require('./auxFn');

router.post('/list', auxFn.fnEnsureAuthorized(['usuario', 'recepcao', 'profissional', 'administrador']),
  controller.doGeneroList);

module.exports = router;
