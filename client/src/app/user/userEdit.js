angular
  .module('app')
  .component('userEdit', {
    templateUrl: 'app/user/userEdit.html',
    controller: function ($http, $mdDialog, viaCEP, GeneralService) {
      var ctrl = this;

      // General Variables
      ctrl.genVars = {
        currentUser: GeneralService.getCurrentUser(),
        currentlAttendingUserPerfil: GeneralService.getCurrentAttendingUser()
      };

      ctrl.labels = {
        divPerfil: "Perfil",
        divContact: "Contatos",
        email: "E-mail",
        password: "Senha",
        type: "Tipo",
        registerNumber: "CPF",
        healthCardNumber: "Cartão SUS",
        name: "Nome",
        legalName: "Nome legal (documentos)",
        gender: "Gênero",
        birthGender: "Gênero atribuido no nascimento",
        legalGender: "Gênero legal (documentos)",
        birthday: "Data do nascimento",
        parentName: "Filiação (Nome da mãe ou pai)",
        naturalness: "Naturalidade",
        maritalStatus: "Estado Civil",
        profession: "Profissão",
        occupation: "Ocupação",
        schooling: "Escolaridade",
        addressStreet: "Logradouro",
        addressNumber: "Número",
        addressComplement: "Complemento",
        adreessNeighborhood: "Bairro",
        addressCity: "Cidade",
        addressState: "Estado",
        addressCountry: "Pais",
        addressZip: "CEP",
        contactMobilePhone: "Celular",
        contactPhone: "Telefone (fixo)"
      };

      ctrl.frm = {
        typeDisplay: (ctrl.genVars.currentUser.fld_tipo === "administrador"),
        errorRiquered: "Este campo é obrigatório.",
        errorRiqueredPassword: "Troca ou confirmação de senha é obrigatória a cada atualização de perfil.",
        errorFormat: "Formato inválido.",
        errorFormatEmail: "Formato de e-mail inválido.",
        traditionalGenderOptions: ["Feminino", "Masculino"],
        maritalStatusOptions: ["Solteiro", "Casado", "Separado", "Divorciado", "Viúvo"],
        schoolingOptions: [
          "Fundamental - Incompleto",
          "Fundamental - Completo",
          "Médio - Incompleto",
          "Médio - Completo",
          "Superior - Incompleto",
          "Superior - Completo",
          "Pós-graduação - Incompleto",
          "Pós-graduação - Completo"
        ],
        typeOptions: ['usuario', 'recepcao', 'profissional', 'administrador']
      };

      // Labels buttons
      ctrl.btns = {
        lblUpdate: 'Salvar'
      };

      // Functions
      ctrl.fns = {
        init: function () {
          $http.post(GeneralService.getServerAddress() + '/col_usuarios/select',
             {_id: ctrl.genVars.currentlAttendingUserPerfil._id}
          )
            .then(
              function (response) { // sucess
                response.data.fld_dataNascimento = new Date(response.data.fld_dataNascimento);
                ctrl.genVars.currentlAttendingUserPerfil = response.data;
              }
            );
        },
        changeName: function () {
          ctrl.genVars.currentlAttendingUserPerfil.fld_nomeLegal = ctrl.genVars.currentlAttendingUserPerfil.fld_nome;
        },
        requestUpdateUser: function () {
          $http.post(GeneralService.getServerAddress() + '/col_usuarios/update',
             ctrl.genVars.currentlAttendingUserPerfil
          )
            .then(
              function (response) { // sucess
                var mdDIalogConfirm = $mdDialog.alert()
                  .title('Perfil atualizado com sucesso')
                  .textContent('Código de identificação: ' + response.data._id)
                  .ariaLabel('Confirmação')
                  .ok('ok');

                $mdDialog.show(mdDIalogConfirm);
              }
            );
        },
        requestAddressDataByViaCEP: function () {
          viaCEP.get(ctrl.genVars.currentlAttendingUserPerfil.fld_enderecoCEP).then(function (response) {
            ctrl.genVars.currentlAttendingUserPerfil.fld_enderecoLogradouro = response.logradouro;
            ctrl.genVars.currentlAttendingUserPerfil.fld_enderecoBairro = response.bairro;
            ctrl.genVars.currentlAttendingUserPerfil.fld_enderecoCidade = response.localidade;
            ctrl.genVars.currentlAttendingUserPerfil.fld_enderecoUF = response.uf;
          });
        }
      };

      ctrl.fns.init();
    }
  });
