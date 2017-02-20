angular
  .module('app')
  .component('emrShowAppointment', {
    templateUrl: 'app/emr/emrShowAppointment.html',
    controller: function ($state, $rootScope, $mdBottomSheet, GeneralService, GetListForSearch) {
      var ctrl = this;

      // General Variables
      ctrl.genVars = {
        formBlock: true,
        currentUser: GeneralService.getCurrentUser(),
        currentDrgList: GeneralService.getCurrentDrgList(),
        currentAppointmentPointer: GeneralService.getCurrentAppointmentPointer() || {},
        currentAppointmentData: GeneralService.getCurrentAppointmentData() || {}
      };

      ctrl.searchBox = {
        noCache: false,
        qString: "",
        selectedItem: "",
        emrBtnDisplay: (ctrl.genVars.currentUser.fld_tipo !== "recepcao")
      };

      // Labels
      ctrl.labels = {
        complaint: "Queixa",
        anamnesis: "Anamnese",
        conduct: "Conduta",
        observation: "Observação",
        diagnosis: "Diagnóstico",
        returnRecommendations: "Recomendações ao retorno",
        interrogationAndMeasures: "Interrogatório e Medidas",
        evaluationOfPreviousExams: "Avaliação de exames anteriores"
      };

      // Labels buttons
      ctrl.btns = {

      };

      // Functions
      ctrl.fns = {
        micListen: function (nameField) {
          if ('webkitSpeechRecognition' in window) {
            var SpeechKit = window.webkitSpeechRecognition;
            var recognition = new SpeechKit();
            recognition.lang = "pt-BR";
            recognition.onresult = function (event) {
              angular.element(document.getElementById(nameField)).val(
                ctrl.genVars.currentAppointmentData[nameField] + " " + event.results[0][0].transcript
              ).triggerHandler('input');
            };
            recognition.start();
          }
          else {
            $rootScope.$broadcast('httpErrorReturn', {
              message: "Reconhecimento de voz, não disponível no navegador, tente através de opções do sistema."
            });
          }
        },
        querySearch: function (qString) {
          return GetListForSearch.listResult(qString, '/col_aux_cids/list');
        },
        transformToChip: function (chip) {
          if (angular.isObject(chip)) {
            return chip;
          }
          return {fld_codigo: '', fld_descricao: chip, fld_situacao: ''};
        },
        showMenuBottom: function () {
          GeneralService.setCurrentAppointmentData(ctrl.genVars.currentAppointmentData);
          $mdBottomSheet.show({
            templateUrl: 'app/emr/appointmentBottomMenu.html',
            controller: 'appointmentBottomMenu',
            disableParentScroll: false
          });
        },
        init: function () {
          if (typeof ctrl.genVars.currentAppointmentPointer._idEmr === "undefined" ||
            ctrl.genVars.currentAppointmentPointer._idEmr === "") {
            $state.go("emr", {}, {reload: true});
          }

          if (typeof ctrl.genVars.currentAppointmentPointer._idAppointment === "undefined" ||
            ctrl.genVars.currentAppointmentPointer._idAppointment === "") {
            ctrl.genVars.currentAppointmentData = {};

            ctrl.genVars.currentAppointmentData.fld_especialidade = ctrl.genVars.currentUser.fld_especialidadeEm;
            ctrl.genVars.currentAppointmentData.fld_profissionalId = ctrl.genVars.currentUser._id;
            ctrl.genVars.currentAppointmentData.fld_profissionalName = ctrl.genVars.currentUser.fld_nome;
          }
          else {
            ctrl.genVars.currentAppointmentData =
              (ctrl.genVars.currentDrgList.filter(function (objDrg) {
                return objDrg._id === ctrl.genVars.currentAppointmentPointer._idEmr;
              }))[0]
                .arr_consultas.filter(function (objAppointment) {
                  return objAppointment._id === ctrl.genVars.currentAppointmentPointer._idAppointment;
                })[0];
            delete ctrl.genVars.currentAppointmentData._id;
            ctrl.genVars.currentAppointmentData._idAppointment = ctrl.genVars.currentAppointmentPointer._idAppointment;
          }

          ctrl.genVars.currentAppointmentData._idEmr = ctrl.genVars.currentAppointmentPointer._idEmr;
          ctrl.genVars.currentAppointmentData.fld_diagnostico = ctrl.genVars.currentAppointmentData.fld_diagnostico || [];

          if (ctrl.genVars.currentAppointmentData.fld_profissionalId === ctrl.genVars.currentUser._id ||
            ctrl.genVars.currentUser.fld_tipo === "administrador") {
            ctrl.genVars.formBlock = false;
          }
        }
      };

      ctrl.fns.init();
    }
  });
