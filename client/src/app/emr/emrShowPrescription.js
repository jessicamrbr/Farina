angular
  .module('app')
  .controller('emrShowPrescription', function ($http, $mdDialog, GeneralService) {
    var ctrlDlgPresc = this;

    ctrlDlgPresc.genVars = {
      currentAppointmentPointer: GeneralService.getCurrentAppointmentPointer(),
      currentDrgList: GeneralService.getCurrentDrgList(),
      currentPrescriptions: []
    };

    ctrlDlgPresc.labels = {
      prescriptions: "Prescrições",
      close: "Fechar"
    };

    // Labels buttons
    ctrlDlgPresc.btns = {
      print: "Imprimir"
    };

    ctrlDlgPresc.fns = {
      init: function () {
        ctrlDlgPresc.genVars.currentPrescriptions =
          (ctrlDlgPresc.genVars.currentDrgList.filter(function (objDrg) {
            return objDrg._id === ctrlDlgPresc.genVars.currentAppointmentPointer._idEmr;
          }))[0]
            .arr_consultas.filter(function (objAppointment) {
              return objAppointment._id === ctrlDlgPresc.genVars.currentAppointmentPointer._idAppointment;
            })[0].fld_prescricoes;
      },
      closeMe: function () {
        $mdDialog.hide();
      },
      printPresc: function () {

      }
    };

    ctrlDlgPresc.fns.init();
  });
