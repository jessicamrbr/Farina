angular
  .module('app')
  .controller('dialogCreateDrg', function ($timeout, $q, $scope, $http, $mdDialog, GeneralService, GetListForSearch) {
    var ctrlDialog = this;

    ctrlDialog.genVars = {
      currentlAttendingUser: GeneralService.getCurrentAttendingUser()
    };

    ctrlDialog.labels = {
      titlePanel: "Novo DRG para o usuário",
      notFound: "Nenhum DRG encontrado.",
      searchDrg: "Procurar DRG"
    };

    // Labels buttons
    ctrlDialog.btns = {
      closeDialog: "Fechar janela",
      createDrg: "Registrar"
    };

    ctrlDialog.searchBox = {
      noCache: false,
      qString: "",
      selectedItem: ""
    };

    ctrlDialog.fns = {
      closeDialogCreateDrg: function () {
        $mdDialog.hide();
      },
      create: function () {
        var objDrgNew = {};
        objDrgNew.fld_drgId = ctrlDialog.searchBox.selectedItem._id;
        objDrgNew.fld_drgName = ctrlDialog.searchBox.selectedItem.fld_nome;
        objDrgNew.fld_usuarioId = ctrlDialog.genVars.currentlAttendingUser._id;
        objDrgNew.fld_usuarioName = ctrlDialog.genVars.currentlAttendingUser.fld_nome;
        objDrgNew.fld_data = new Date();
        objDrgNew.arr_consultas = [];
        $http.post(GeneralService.getServerAddress() + '/col_prontuarios/create', objDrgNew)
          .then(
            function (response) { // sucess
              objDrgNew._id = response.data._id;
              var objDrgs = GeneralService.getCurrentDrgList();
              objDrgs.push(objDrgNew);
              GeneralService.setCurrentDrgList(objDrgs);
            }
          );
        $mdDialog.hide();
      },
      querySearch: function (qString) {
        return GetListForSearch.listResult(qString, '/col_aux_drgs/list');
      }
    };
  });
