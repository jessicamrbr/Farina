var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-html').loadType(mongoose);

var Col_aux_templates_inputs = new Schema({
  fld_profissionalId : {
    type: Schema.ObjectId,
    required: true
  },
  fld_nome : {
    type: String,
    required: true
  },
  fld_template : {
    type: mongoose.Types.Html,
    required: true,
    setting: {
      allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a'],
      allowedAttributes: {
        'a': ['href']
      }
    }
  }
});
module.exports = mongoose.model("Col_aux_templates_inputs", Col_aux_templates_inputs);
