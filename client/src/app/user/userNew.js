angular
  .module('app')
  .component('userNew', {
    templateUrl: 'app/user/userNew.html',
    controller: function ($http, $mdDialog, $state, GeneralService) {
      var ctrl = this;

      // General Variables
      ctrl.genVars = {

      };

      ctrl.labels = {
        email: 'E-mail',
        cpf: 'CPF',
        csus: 'Cartão do SUS'
      };

      ctrl.frm = {
        errorRiquered: "Este campo é obrigatório.",
        errorFormat: "Formato inválido.",
        errorFormatEmail: "Formato de e-mail inválido."
      };

      // Labels buttons
      ctrl.btns = {
        lblRegister: 'Registrar'
      };

      // Functions
      ctrl.fns = {
        requestCreatUser: function () {
          ctrl.genVars.currentNewUser.fld_senha = ctrl.genVars.currentNewUser.fld_cadastroPessoaFisica.slice(-6);
          $http.post(GeneralService.getServerAddress() + '/col_usuarios/create', ctrl.genVars.currentNewUser)
            .then(
              function (response) { // sucess
                var mdDIalogConfirm = $mdDialog.confirm()
                  .title('Usuário criado com sucesso')
                  .textContent('Código de identificação: ' + response.data._id)
                  .ariaLabel('Confirmação')
                  .ok('Novo usuário')
                  .cancel('Início');

                $mdDialog.show(mdDIalogConfirm).then(function () {
                  $state.go('user.new', {}, {reload: true});
                }, function () {
                  $state.go('resume', {}, {reload: true});
                });
              }
            );
        }
      };
    }
  });
