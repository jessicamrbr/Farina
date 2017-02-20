var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Col_prescricaoItem = new Schema({
  fld_ordem: {
    type: String,
    required: true
  },
  fld_item: {
    type: String,
    required: true
  },
  fld_DescricaoItem: {
    type: String,
    required: true
  }
},{ _id : false });

var Col_prescricoes = new Schema({
  fld_data: {
    type: Date,
    default: Date.now,
    required: true
  },
  fld_profissionalId: {
    type: Schema.ObjectId,
    required: true
  },
  fld_profissionalName: {
    type: String,
    required: true
  },
  fld_descricao: [Col_prescricaoItem]
},{ _id : true });

var Col_anotacoes = new Schema({
  fld_data: {
    type: Date,
    default: Date.now,
    required: true
  },
  fld_profissionalId: {
    type: Schema.ObjectId,
    required: true
  },
  fld_descricao: {
    type: String,
    required: true
  }
},{ _id : true });

var Col_consultas = new Schema({
  fld_data: {
    type: Date,
    default: Date.now,
    required: true
  },
  fld_especialidade: {
    type: String,
    required: true
  },
  fld_profissionalId: {
    type: Schema.ObjectId,
    required: true
  },
  fld_profissionalName: {
    type: String,
    required: true
  },
  fld_queixa: {
    type: String
  },
  fld_anamnese: {
    type: String
  },
  fld_conduta: {
    type: String
  },
  fld_observacao: {
    type: String
  },
  fld_diagnostico: {
    type: []
  },
  fld_retornoRecomendacoes: {
    type: String
  },
  fld_interrogatoriosMedidas: {
    type: String
  },
  fld_avaliacaoExamesAnteriores: {
    type: String
  },
  fld_anotacoesPrivadas: [Col_anotacoes],
  fld_prescricoes: [Col_prescricoes]
},{ _id : true });

var Col_prontuarios = new Schema({
  fld_usuarioId: {
    type: Schema.ObjectId,
    required: true
  },
  fld_usuarioName: {
    type: String,
    required: true
  },
  fld_drgId: {
    type: Schema.ObjectId,
    required: true
  },
  fld_drgName: {
    type: String,
    required: true
  },
  fld_data: {
    type: Date,
    default: Date.now
  },
  arr_consultas: [Col_consultas]
});
module.exports = mongoose.model("Col_prontuarios", Col_prontuarios);
