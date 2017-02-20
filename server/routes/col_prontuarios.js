var express = require('express');
var router = express.Router();
var controller = require('./../controller/col_prontuarios');
var auxFn = require('./auxFn');

router.post('/create', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doEmrCreate);
router.post('/create/appointment', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doAppointmentCreate);
router.post('/create/privateNotes', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doPrivateNotesCreate);
router.post('/create/prescription', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doPrescriptionCreate);
router.post('/list', auxFn.fnEnsureAuthorized(['usuario', 'recepcao', 'profissional', 'administrador']),
  controller.doEmrList);
router.post('/list/privateNotes', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doPrivateNotesList);
router.post('/update/appointment', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doAppointmentUpdate);
router.post('/update/privateNotes', auxFn.fnEnsureAuthorized(['profissional', 'administrador']),
  controller.doPrivateNotesUpdate);

module.exports = router;
