angular
  .module('app')
  .controller('appointmentBottomMenu', function ($http, $mdBottomSheet, $mdToast, $mdDialog, GeneralService) {
    var ctrl = this;

    // General variables
    ctrl.genVars = {
      currentAppointmentPointer: GeneralService.getCurrentAppointmentPointer(),
      currentAppointmentData: GeneralService.getCurrentAppointmentData(),
      currentDrgList: GeneralService.getCurrentDrgList(),
      appointmentCreated: true
    };

    // Labels
    ctrl.labels = {
      options: "Opções"
    };

    // Labels buttons
    ctrl.btns = {
      save: "Salvar",
      prescriptions: "Prescrições",
      newPrescriptions: "Nova prescrição",
      notes: "Anotações privadas",
      newNotes: "Nova anotação privada"
    };

    // Functions
    ctrl.fns = {
      init: function () {
        if (typeof ctrl.genVars.currentAppointmentPointer._idAppointment === "undefined" ||
          ctrl.genVars.currentAppointmentPointer._idAppointment === "") {
          ctrl.genVars.appointmentCreated = false;
        }
      },
      saveAppointment: function () {
        function adjustDrgList(operation) {
          var currentAppointmentTemp = Object.assign({}, ctrl.genVars.currentAppointmentData);
          delete currentAppointmentTemp._idEmr;
          currentAppointmentTemp._id = currentAppointmentTemp._idAppointment;
          delete currentAppointmentTemp._idAppointment;
          currentAppointmentTemp.fld_data = new Date();

          ctrl.genVars.currentDrgList.forEach(function (elementDrg, indexD) {
            if (elementDrg._id === ctrl.genVars.currentAppointmentPointer._idEmr) {
              if (operation === "create") {
                ctrl.genVars.currentDrgList[indexD].arr_consultas.push(currentAppointmentTemp);
              }
              else {
                elementDrg.arr_consultas.forEach(function (elementAppointment, indexA) {
                  if (elementAppointment._id === ctrl.genVars.currentAppointmentPointer._idAppointment) {
                    ctrl.genVars.currentDrgList[indexD].arr_consultas[indexA] = currentAppointmentTemp;
                  }
                });
              }
            }
          });

          GeneralService.setCurrentDrgList(ctrl.genVars.currentDrgList);
        }

        if (typeof ctrl.genVars.currentAppointmentData._idAppointment === "undefined") {
          $http.post(
            GeneralService.getServerAddress() + '/col_prontuarios/create/appointment',
            ctrl.genVars.currentAppointmentData
          )
            .then(
              function (response) { // sucess
                ctrl.genVars.currentAppointmentPointer._idAppointment = response.data._id;
                GeneralService.setCurrentAppointmentPointer(
                  ctrl.genVars.currentAppointmentPointer._idEmr,
                  ctrl.genVars.currentAppointmentPointer._idAppointment
                );
                ctrl.genVars.currentAppointmentData._idAppointment = response.data._id;
                GeneralService.setCurrentAppointmentData(ctrl.genVars.currentAppointmentData);
                adjustDrgList("create");

                var mdDIalogConfirm = $mdDialog.alert()
                  .title('Consulta registrada com sucesso')
                  .textContent('Código de identificação: ' + response.data._id)
                  .ariaLabel('Confirmação')
                  .ok('ok');

                $mdDialog.show(mdDIalogConfirm);
              }
            );
        }
        else {
          $http.post(
            GeneralService.getServerAddress() + '/col_prontuarios/update/appointment',
            ctrl.genVars.currentAppointmentData
          )
            .then(
              function (response) { // sucess
                adjustDrgList("update");

                var mdDIalogConfirm = $mdDialog.alert()
                  .title('Consulta atualizada com sucesso')
                  .textContent('Código de identificação: ' + response.data._id)
                  .ariaLabel('Confirmação')
                  .ok('ok');

                $mdDialog.show(mdDIalogConfirm);
              }
            );
        }

        $mdBottomSheet.hide();
      },
      dialogShowPrescriptions: function () {
        $mdDialog.show({
          controller: 'emrShowPrescription',
          templateUrl: 'app/emr/emrShowPrescription.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true
        });

        $mdBottomSheet.hide();
      },
      dialogCreatePrescriptions: function () {
        $mdDialog.show({
          controller: 'emrCreatePrescription',
          templateUrl: 'app/emr/emrCreatePrescription.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true
        });

        $mdBottomSheet.hide();
      },
      dialogShowNotes: function () {
        $mdDialog.show({
          controller: 'emrShowPrivateNotes',
          templateUrl: 'app/emr/emrShowPrivateNotes.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          fullscreen: true
        });

        $mdBottomSheet.hide();
      }
    };

    ctrl.fns.init();
  });
