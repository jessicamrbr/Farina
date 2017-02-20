angular
  .module('app')
  .controller('emrCreatePrescription', function ($http, $mdDialog, GeneralService) {
    var ctrlDlgPresc = this;

    ctrlDlgPresc.genVars = {
      currentUser: GeneralService.getCurrentUser(),
      currentAppointmentPointer: GeneralService.getCurrentAppointmentPointer(),
      currentDrgList: GeneralService.getCurrentDrgList(),
      currentPrescriptions: {
        fld_descricao: [
          {fld_ordem: 1, fld_item: "Nome item", fld_DescricaoItem: "Descrição Item"}
        ]
      }
    };

    ctrlDlgPresc.labels = {
      prescriptions: "Nova prescrição",
      itens: "Itens da prescrição",
      itemNum: "Item nº",
      itemTit: "Titulo",
      itemDesc: "Descrição"
    };

    // Labels buttons
    ctrlDlgPresc.btns = {
      addItemList: "Adicionar item a lista",
      save: "Salvar",
      close: "Fechar"
    };

    ctrlDlgPresc.fns = {
      init: function () {
        ctrlDlgPresc.genVars.currentPrescriptions._idEmr =
          ctrlDlgPresc.genVars.currentAppointmentPointer._idEmr;
        ctrlDlgPresc.genVars.currentPrescriptions._idAppointment =
          ctrlDlgPresc.genVars.currentAppointmentPointer._idAppointment;
        ctrlDlgPresc.genVars.currentPrescriptions.fld_profissionalId =
          ctrlDlgPresc.genVars.currentUser._id;
        ctrlDlgPresc.genVars.currentPrescriptions.fld_profissionalName =
          ctrlDlgPresc.genVars.currentUser.fld_nome;
      },
      additem: function () {
        var lastItemPresc = ctrlDlgPresc.genVars.currentPrescriptions.fld_descricao[
          ctrlDlgPresc.genVars.currentPrescriptions.fld_descricao.length - 1
        ];
        ctrlDlgPresc.genVars.currentPrescriptions.fld_descricao.push({
          fld_ordem: (parseFloat(lastItemPresc.fld_ordem) + 1), fld_item: "", fld_DescricaoItem: ""
        });
      },
      savePresc: function () {
        $http.post(
          GeneralService.getServerAddress() + '/col_prontuarios/create/prescription',
          ctrlDlgPresc.genVars.currentPrescriptions
        )
          .then(function (response) {
            var currentPrescriptionsTemp =
              Object.assign({}, ctrlDlgPresc.genVars.currentPrescriptions);
            delete currentPrescriptionsTemp._idEmr;
            delete currentPrescriptionsTemp._idAppointment;
            currentPrescriptionsTemp._id = response.data._id;
            currentPrescriptionsTemp.fld_data = new Date();

            ctrlDlgPresc.genVars.currentDrgList.forEach(function (elementDrg, indexD) {
              if (elementDrg._id === ctrlDlgPresc.genVars.currentAppointmentPointer._idEmr) {
                elementDrg.arr_consultas.forEach(function (elementAppointment, indexA) {
                  if (elementAppointment._id ===
                    ctrlDlgPresc.genVars.currentAppointmentPointer._idAppointment) {
                    if (typeof ctrlDlgPresc.genVars.currentDrgList[indexD].arr_consultas[indexA]
                      .fld_prescricoes === "undefined") {
                      ctrlDlgPresc.genVars.currentDrgList[indexD]
                        .arr_consultas[indexA].fld_prescricoes = [];
                    }
                    ctrlDlgPresc.genVars.currentDrgList[indexD].arr_consultas[indexA]
                      .fld_prescricoes.push(currentPrescriptionsTemp);
                  }
                });
              }
            });

            GeneralService.setCurrentDrgList(ctrlDlgPresc.genVars.currentDrgList);

            var mdDIalogConfirmPresc = $mdDialog.alert()
              .title('Prescrição registrada com sucesso')
              .textContent('Código de identificação: ' + response.data._id)
              .ariaLabel('Confirmação')
              .ok('ok');

            $mdDialog.show(mdDIalogConfirmPresc).then($mdDialog.hide());
          });
      },
      closeMe: function () {
        $mdDialog.hide();
      }
    };

    ctrlDlgPresc.fns.init();
  });
