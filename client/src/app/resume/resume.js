angular
  .module('app')
  .component('resume', {
    templateUrl: 'app/resume/resume.html',
    controller: function ($scope, $http, GeneralService) {
      var ctrl = this;

      // General variables
      ctrl.genVars = {
        currentUser: GeneralService.getCurrentUser(),
        currentlAttendingUserPerfil: GeneralService.getCurrentAttendingUser()
      };

      // Tools
      ctrl.alertList = [
        {description: 'Aguarde! em breve agenda integrada ao prontuário.'}
      ];

      // Labels
      ctrl.labels = {
        helloTitle: 'Bem vindo ' + GeneralService.getCurrentUser().fld_nome
      };

      // Labels buttons
      ctrl.btns = {

      };

      // Functions
      ctrl.fns = {
        init: function () {
          ctrl.fns.statusPerfil();
        },
        statusPerfil: function () {
          $http.post(GeneralService.getServerAddress() + '/col_usuarios/select',
             {_id: ctrl.genVars.currentlAttendingUserPerfil._id}
          )
            .then(
              function (response) { // sucess
                function absentValue(val) {
                  return ((typeof val === "undefined") || (val === null) || (val === ""));
                }
                var checkFull = "";
                checkFull += absentValue(response.data.fld_nome) ? ", Nome" : "";
                checkFull += absentValue(response.data.fld_nomeLegal) ? ", Nome legal (documentos)" : "";
                checkFull += absentValue(response.data.fld_genero) ? ", Gênero" : "";
                checkFull += absentValue(response.data.fld_generoAtribuidoNascimento) ? ", Gênero atribuido no nascimento" : "";
                checkFull += absentValue(response.data.fld_generoLegal) ? ", Gênero legal (documentos)" : "";
                checkFull += absentValue(response.data.fld_dataNascimento) ? ", Data de nascimento" : "";
                checkFull += absentValue(response.data.fld_naturalidade) ? ", Naturalidade" : "";
                checkFull += absentValue(response.data.fld_estadoCivil) ? ", Estado cívil" : "";
                checkFull += absentValue(response.data.fld_profissao) ? ", Profissão" : "";
                checkFull += absentValue(response.data.fld_ocupacao) ? ", Ocupação" : "";
                checkFull += absentValue(response.data.fld_escolaridade) ? ", Escolaridade" : "";
                checkFull += absentValue(response.data.fld_filiacao) ? ", Filiação (nome da mãe ou pai)" : "";
                checkFull += absentValue(response.data.fld_enderecoLogradouro) ? ", Rua (logradouro)" : "";
                checkFull += absentValue(response.data.fld_enderecoNumero) ? ", Número residêncial" : "";
                checkFull += absentValue(response.data.fld_enderecoBairro) ? ", Bairro" : "";
                checkFull += absentValue(response.data.fld_enderecoCidade) ? ", Cidade" : "";
                checkFull += absentValue(response.data.fld_enderecoUF) ? ", UF" : "";
                checkFull += absentValue(response.data.fld_enderecoPais) ? ", Pais" : "";
                checkFull += absentValue(response.data.fld_enderecoCEP) ? ", CEP" : "";
                checkFull += absentValue(response.data.fld_enderecoComplemento) ? ", Complemento residencial" : "";
                checkFull += absentValue(response.data.fld_contatoCelular) ? ", Celular" : "";
                checkFull += absentValue(response.data.fld_contatoTelefone) ? ", Telefone fixo" : "";
                if (checkFull !== "") {
                  checkFull = "Seu perfil encontra-se incompleto, por favor preencha os campos ausentes: (" + checkFull.substring(2) + ")";
                  ctrl.alertList.unshift({description: checkFull});
                }
              }
            );
        }
      };

      ctrl.fns.init();
    }
  });
