angular
  .module('app')
  .component('logout', {
    templateUrl: 'app/access/logout.html',
    controller: function ($scope, $state, $window, $timeout, GeneralService) {
      var ctrl = this;

      // General variables
      ctrl.genVars = {

      };

      // Tools
      ctrl.labels = {
        textLogout: "Sessão encerrada com sucesso"
      };

      // Labels buttons
      ctrl.btns = {

      };

      // Functions
      ctrl.fns = {
        exitLogoutScreen: function () {
          GeneralService.setCurrentUser({});
          $window.sessionStorage.removeItem('token');
          $state.go('login', {}, {reload: true});
        }
      };

      $timeout(ctrl.fns.exitLogoutScreen, 2000);
    }
  });

