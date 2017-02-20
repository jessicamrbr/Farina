angular
  .module('app')
  .component('userSelect', {
    templateUrl: 'app/user/userSelect.html',
    controller: function ($http, $q, $state, GeneralService, GetListForSearch) {
      var ctrl = this;

      // General variables
      ctrl.genVars = {
        currentUser: GeneralService.getCurrentUser()
      };

      // Labels
      ctrl.labels = {
        searchUser: 'Buscar usuário',
        userNotFound: "Nenhum usuário encontrado para o termo: "
      };

      // Inputs
      ctrl.searchBox = {
        noCache: false,
        qString: "",
        selectedItem: "",
        emrBtnDisplay: (ctrl.genVars.currentUser.fld_tipo !== "recepcao")
      };

      // Labels buttons
      ctrl.btns = {
        userNew: "Criar novo usuário"
      };

      // Functions
      ctrl.fns = {
        newUser: function () { $state.go("user.new", {}, {reload: true}); },
        selectedToShow: function (action, fld_nome, fld_tipo, _id) {
          GeneralService.setCucurrentAttendingUser({
            fld_nome: fld_nome,
            fld_tipo: fld_tipo,
            _id: _id
          });
          $state.go(action, {}, {reload: true});
        },
        querySearch: function (qString) {
          return GetListForSearch.listResult(qString, '/col_usuarios/list');
        }
      };
    }
  });
