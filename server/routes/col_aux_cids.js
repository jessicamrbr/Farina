var express = require('express');
var router = express.Router();
var controller = require('./../controller/col_aux_cids');
var auxFn = require('./auxFn');

router.post('/list', auxFn.fnEnsureAuthorized(['usuario', 'recepcao', 'profissional', 'administrador']),
  controller.doCidList);

module.exports = router;
