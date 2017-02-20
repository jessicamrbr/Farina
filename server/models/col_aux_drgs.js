var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Col_aux_drgs = new Schema({
  fld_nome : {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Col_aux_drgs", Col_aux_drgs);
