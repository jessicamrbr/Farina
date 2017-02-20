angular
  .module('app')
  .component('auxsAppointmentTemplates', {
    templateUrl: 'app/auxs/appointmentTemplates.html',
    controller: function () {
      var ctrl = this;

      // General variables
      ctrl.genVars = {
        //templatesInputs: GeneralService.getCurrentTemplatesInputs()
        templatesInputs: [{
          _id: "a1",
          fld_profissionalId: "b1",
          fld_nome: "tpl1",
          fld_template:  "<b>tpl/b> -1"
        },{
          _id: "a2",
          fld_profissionalId: "b1",
          fld_nome: "tpl2",
          fld_template:  "<b>tpl/b> -2"
        },{
          _id: "a3",
          fld_profissionalId: "b1",
          fld_nome: "tpl3",
          fld_template:  "<b>tpl/b> -3"
        }]
      };

      // Tools
      ctrl.searchBox = {
        noCache: false,
        qString: "",
        selectedItem: ""
      };

      ctrl.tinymceOptions = {
        plugins: ['paste'],
        menubar: false,
        toolbar: false,
        statusbar: false,
        min_height: 450,
        font_formats: 'roboto'
      };

      // Labels
      ctrl.labels = {
        searchTemplateInput: 'Selecione um modelo',
        templateInputNotFound: "Nenhum modelo encontrado para o termo: "
      };

      // Labels buttons
      ctrl.btns = {
        templateInputNew: "Criar novo modelo"
      };

      // Functions
      ctrl.fns = {
        runCmdEditor: function (cmd, val) {
          tinyMCE.execCommand(cmd, false, val);
        },
        querySearch: function (qString) {
          var resultTemplateInputList = qString ? ctrl.genVars.templatesInputs
            .filter(function filterFn(val) {
              return (val.fld_nome.indexOf(qString) === 0);
            }) : ctrl.genVars.templatesInputs,
          deferred;
          console.log(resultTemplateInputList);
          return resultTemplateInputList;
        }
      };
    }
  });
