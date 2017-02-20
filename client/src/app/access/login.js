angular
  .module('app')
  .component('login', {
    templateUrl: 'app/access/login.html',
    controller: function ($scope, $state, $http, $window, GeneralService) {
      var ctrl = this;

      // General variables
      ctrl.genVars = {
        currentUser: GeneralService.getCurrentUser()
      };

      // Tools
      ctrl.labels = {
        userId: 'CPF',
        userPass: 'Senha'
      };

      // Labels buttons
      ctrl.btns = {
        login: 'Entrar',
        lostPass: 'Esqueci minha senha'
      };

      ctrl.frm = {
        errorRiquered: "Este campo é obrigatório.",
        errorFormat: "Formato inválido."
      };

      // Functions
      ctrl.fns = {
        requestLogin: function (formData) {
          $http.post(GeneralService.getServerAddress() + '/col_usuarios/login', formData)
            .then(
              function (response) { // sucess
                $window.sessionStorage.token = response.data.token;
                GeneralService.initCurrentUser();
                $state.go('resume', {}, {reload: true});
              }
            );
        }
      };
    }
  });
