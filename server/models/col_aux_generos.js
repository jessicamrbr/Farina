var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Col_aux_generos = new Schema({
  fld_genero : {
    type: String,
    required: true
  },
  fld_marcadorDeGenero : {
    type: String,
    required: true
  },
  fld_pronome : {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Col_aux_generos", Col_aux_generos);
