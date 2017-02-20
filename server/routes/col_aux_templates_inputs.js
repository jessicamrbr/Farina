var express = require('express');
var router = express.Router();
var controller = require('./../controller/col_aux_templates_inputs');
var auxFn = require('./auxFn');

router.post('/create', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doTemplateInputsCreate);
router.post('/list', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doTemplateInputsList);
router.post('/update', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doTemplateInputsUpdate);
router.post('/delete', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doTemplateInputsDelete);

module.exports = router;
