var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var photoSchema = new Schema({
  fileName: { type: String }
  }, {
    timestamps: true
});
module.exports = mongoose.model('Photos', photoSchema);