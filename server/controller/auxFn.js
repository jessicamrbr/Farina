module.exports = {
  fnErrorClean: function (err) {
    console.log("");
    console.log("=======================================================");
    console.log(err);
    console.log("=======================================================");
    console.log("");
    switch (err.name) {
      case "MongoError":
        err.messageArray = err.message.split(" ");
        switch (err.messageArray[0]) {
          case "E11000":
            err.name = "Erro de validação - Índice duplicado";
            switch (err.messageArray[7]) {
              case "fld_cadastroPessoaFisica_1":
                err.message = "Dois usuários não podem possuir o mesmo número de CPF."
                break;
              case "fld_cartaoSUS_1":
                err.message = "Dois usuários não podem possuir o mesmo número de cartão SUS."
                break;
              case "fld_drgId_1_fld_usuarioId_1":
                err.message = "O usuário não pode ter dois DRGs iguais assimilados."
                break;
              default:
                err.message = "Índice duplicado não permitido. Verifique o valor dos campos informados."
                break;
              break;
            }
            break;
          default:
            err.name = "Erro de validação";
            err.message = "Verifique o valor dos campos informados."
            break;
        }
        break;
    }
    return {name: err.name, message: err.message};
  }
};
