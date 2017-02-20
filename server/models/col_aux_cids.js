var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Col_aux_cids = new Schema({
  fld_codigo : {
    type: String,
    required: true
  },
  fld_descricao : {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Col_aux_cids", Col_aux_cids);
