angular
  .module('app')
  .controller('emrShowPrivateNotes', function ($http, $mdDialog, GeneralService) {
    var ctrlDlgPNotes = this;

    ctrlDlgPNotes.genVars = {
      currentUser: GeneralService.getCurrentUser(),
      currentAttendingUser: GeneralService.getCurrentAttendingUser(),
      currentAppointmentPointer: GeneralService.getCurrentAppointmentPointer(),
      currentDrgList: GeneralService.getCurrentDrgList(),
      currentPrivateNotes: [],
      privateNoteTemp: {}
    };

    ctrlDlgPNotes.labels = {
      privateNotes: "Anotações privadas",
      notes: "Anotações",
      notesExp: "Suas anotações sobre essa consulta",
      close: "Fechar"
    };

    // Labels buttons
    ctrlDlgPNotes.btns = {
      save: "Salvar"
    };

    ctrlDlgPNotes.fns = {
      init: function () {
        function restorePrivateNotesTemp() {
          ctrlDlgPNotes.genVars.currentPrivateNotes.forEach(function (elementDrg, indexD) {
            if (elementDrg._id === ctrlDlgPNotes.genVars.currentAppointmentPointer._idEmr) {
              elementDrg.arr_consultas.forEach(function (elementAppointment, indexA) {
                if (elementAppointment._id ===
                  ctrlDlgPNotes.genVars.currentAppointmentPointer._idAppointment) {
                  ctrlDlgPNotes.genVars.privateNoteTemp =
                    ctrlDlgPNotes.genVars.currentPrivateNotes[indexD]
                      .arr_consultas[indexA].fld_anotacoesPrivadas[0];
                }
              });
            }
          });
        }

        if (GeneralService.getCurrentPrivateNotesList()) {
          ctrlDlgPNotes.genVars.currentPrivateNotes = GeneralService.getCurrentPrivateNotesList();
          restorePrivateNotesTemp();
        }
        else {
          $http.post(
            GeneralService.getServerAddress() + '/col_prontuarios/list/privateNotes',
            {_id: ctrlDlgPNotes.genVars.currentAttendingUser._id}
          )
            .then(function (response) {
              GeneralService.setCurrentPrivateNotesList(response.data);
              ctrlDlgPNotes.genVars.currentPrivateNotes = GeneralService.getCurrentPrivateNotesList();
              restorePrivateNotesTemp();
            });
        }
      },
      closeMe: function () {
        $mdDialog.hide();
      },
      saveNotes: function () {
        function restorePrivateNotesLocalList() {
          var indexD;
          ctrlDlgPNotes.genVars.currentPrivateNotes.forEach(function (elementDrg, indexDTemp) {
            if (elementDrg._id === ctrlDlgPNotes.genVars.currentAppointmentPointer._idEmr) {indexD = indexDTemp;}
          });

          if (typeof indexD === "undefined") {
            ctrlDlgPNotes.genVars.currentPrivateNotes.push({
              _id: ctrlDlgPNotes.genVars.currentAppointmentPointer._idEmr,
              arr_consultas: []
            });
            indexD = ctrlDlgPNotes.genVars.currentPrivateNotes.length - 1;
          }

          var indexA;
          ctrlDlgPNotes.genVars.currentPrivateNotes[indexD].arr_consultas
            .forEach(function (elementAppointment, indexATemp) {
              if (elementAppointment._id ===
                ctrlDlgPNotes.genVars.currentAppointmentPointer._idAppointment) {
                indexA = indexATemp;
              }
            });

          if (typeof indexA === "undefined") {
            ctrlDlgPNotes.genVars.currentPrivateNotes[indexD].arr_consultas.push({
              _id: ctrlDlgPNotes.genVars.currentAppointmentPointer._idAppointment,
              fld_anotacoesPrivadas: []
            });
            indexA = ctrlDlgPNotes.genVars.currentPrivateNotes[indexD].arr_consultas.length - 1;
          }

          ctrlDlgPNotes.genVars.currentPrivateNotes[indexD].arr_consultas[indexA].fld_anotacoesPrivadas[0] =
            ctrlDlgPNotes.genVars.privateNoteTemp;
          GeneralService.setCurrentPrivateNotesList(ctrlDlgPNotes.genVars.currentPrivateNotes);
        }

        ctrlDlgPNotes.genVars.privateNoteTemp._idEmr =
          ctrlDlgPNotes.genVars.currentAppointmentPointer._idEmr;
        ctrlDlgPNotes.genVars.privateNoteTemp._idAppointment =
          ctrlDlgPNotes.genVars.currentAppointmentPointer._idAppointment;

        if (typeof ctrlDlgPNotes.genVars.privateNoteTemp._id === "undefined") {
          ctrlDlgPNotes.genVars.privateNoteTemp.fld_profissionalId = ctrlDlgPNotes.genVars.currentUser._id;

          $http.post(
            GeneralService.getServerAddress() + '/col_prontuarios/create/privateNotes',
            ctrlDlgPNotes.genVars.privateNoteTemp
          )
            .then(function (response) {
              delete ctrlDlgPNotes.genVars.privateNoteTemp._idEmr;
              delete ctrlDlgPNotes.genVars.privateNoteTemp._idAppointment;
              ctrlDlgPNotes.genVars.privateNoteTemp._id = response.data._id;
              ctrlDlgPNotes.genVars.privateNoteTemp.fld_data = new Date();

              restorePrivateNotesLocalList();

              var mdDIalogConfirmPresc = $mdDialog.alert()
              .title('Anotação privada registrada com sucesso')
              .textContent('Código de identificação: ' + response.data._id)
              .ariaLabel('Confirmação')
              .ok('ok');

              $mdDialog.show(mdDIalogConfirmPresc).then($mdDialog.hide());
            });
        }
        else {
          ctrlDlgPNotes.genVars.privateNoteTemp._idPrivateNote = ctrlDlgPNotes.genVars.privateNoteTemp._id;
          delete ctrlDlgPNotes.genVars.privateNoteTemp._id;
          ctrlDlgPNotes.genVars.privateNoteTemp.fld_data = new Date();

          $http.post(
            GeneralService.getServerAddress() + '/col_prontuarios/update/privateNotes',
            ctrlDlgPNotes.genVars.privateNoteTemp
          )
            .then(function (response) {
              delete ctrlDlgPNotes.genVars.privateNoteTemp._idEmr;
              delete ctrlDlgPNotes.genVars.privateNoteTemp._idAppointment;
              ctrlDlgPNotes.genVars.privateNoteTemp._id = ctrlDlgPNotes.genVars.privateNoteTemp._idPrivateNote;
              delete ctrlDlgPNotes.genVars.privateNoteTemp._idPrivateNote;

              restorePrivateNotesLocalList();

              var mdDIalogConfirmPresc = $mdDialog.alert()
              .title('Anotação privada atualizada com sucesso')
              .textContent('Código de identificação: ' + response.data._id)
              .ariaLabel('Confirmação')
              .ok('ok');

              $mdDialog.show(mdDIalogConfirmPresc).then($mdDialog.hide());
            });
        }
      }
    };

    ctrlDlgPNotes.fns.init();
  });
