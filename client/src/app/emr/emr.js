angular
  .module('app')
  .component('emr', {
    templateUrl: 'app/emr/emr.html',
    controller: function ($rootScope, $state, $http, $mdDialog, $mdSidenav, GeneralService) {
      var ctrl = this;

      // General variables
      ctrl.genVars = {
        currentlAttendingUser: GeneralService.getCurrentAttendingUser(),
        currentDrgList: {}
      };

      // Labels
      ctrl.labels = {
        historic: "Histórico",
        attendingBar: "Prontuário de: " + ctrl.genVars.currentlAttendingUser.fld_nome,
        selectAppointment: "Selecionar consulta"
      };

      // Labels buttons
      ctrl.btns = {
        createDrg: "Registrar DRG ao usuário",
        createAppointment: "Registrar consulta a este DRG"
      };

      // Functions
      ctrl.fns = {
        init: function () {
          $http.post(GeneralService.getServerAddress() + '/col_prontuarios/list', {_id: ctrl.genVars.currentlAttendingUser._id})
            .then(
              function (response) { // sucess
                if (!angular.isArray(response.data)) {response.data = [response.data]; }
                GeneralService.setCurrentDrgList(response.data);
              }
            );
        },
        togleAppointments: function () {
          $mdSidenav('sideNavAppointments').open();
        },
        createDrg: function () {
          $mdDialog.show({
            controllerAs: 'ctrlDialog',
            controller: 'dialogCreateDrg',
            templateUrl: 'app/emr/emrNew.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
          });
        },
        acessAppointment: function (idD, idA) {
          GeneralService.setCurrentAppointmentPointer(idD, idA);
          $state.go('emr.showAppointment', {}, {reload: true});
        }
      };

      ctrl.fns.init();
      $rootScope.$on('currentDrgList:updated', function () {
        ctrl.genVars.currentDrgList = GeneralService.getCurrentDrgList();
      });
    }
  });
