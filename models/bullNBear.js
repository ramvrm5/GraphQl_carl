const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bullNBearSchema = new Schema({
  symbol: String,
  isin:  String,
  reference_instrument: String,
  factor: Number,
  type:  String,
  currency:  String,
  bid:  Number,
  ask:  Number,
  ls_id:  String,
  asksize:  Number,
  bidsize:  Number,
});

module.exports = mongoose.model('bull_n_bear_example', bullNBearSchema);
