var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Col_usuarios = new Schema({
  fld_email : {
    type: String,
    required: true
  },
  fld_senha : {
    type: String,
    required: true
  },
  fld_tipo : {
    type: String,
    enum: ["usuario", "recepcao", "profissional", "administrador"],
    default: "usuario",
    required: true
  },
  fld_cadastroPessoaFisica : {
    type: String,
    required: true
  },
  fld_cartaoSUS : {
    type: String,
    required: true
  },
  fld_nome : {
    type: String
  },
  fld_nomeLegal : {
    type: String
  },
  fld_genero : {
    type: String
  },
  fld_generoAtribuidoNascimento : {
    type: String,
    enum: ["Feminino", "Masculino"]
  },
  fld_generoLegal : {
    type: String,
    enum: ["Feminino", "Masculino"]
  },
  fld_dataNascimento : {
    type: Date
  },
  fld_filiacao : {
    type: String
  },
  fld_naturalidade : {
    type: String
  },
  fld_estadoCivil : {
    type: String,
    enum: ["Solteiro", "Casado", "Separado", "Divorciado", "Viúvo"]
  },
  fld_profissao : {
    type: String
  },
  fld_ocupacao : {
    type: String
  },
  fld_escolaridade : {
    type: String,
    enum: [
      "Fundamental - Incompleto",
      "Fundamental - Completo",
      "Médio - Incompleto",
      "Médio - Completo",
      "Superior - Incompleto",
      "Superior - Completo",
      "Pós-graduação - Incompleto",
      "Pós-graduação - Completo"
    ]
  },
  fld_enderecoLogradouro : {
    type: String
  },
  fld_enderecoNumero : {
    type: String
  },
  fld_enderecoComplemento : {
    type: String
  },
  fld_enderecoBairro : {
    type: String
  },
  fld_enderecoCidade : {
    type: String,
    default: "São Paulo"
  },
  fld_enderecoUF : {
    type: String,
    default: "SP"
  },
  fld_enderecoPais : {
    type: String,
    default: "Brasil"
  },
  fld_enderecoCEP : {
    type: String
  },
  fld_contatoCelular : {
    type: String
  },
  fld_contatoTelefone : {
    type: String
  }
});

module.exports = mongoose.model("Col_usuarios", Col_usuarios);
