const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bullNBearDetailSchema = new Schema({
  valuation_price: String,
  isin:  String,
  barrier: String,
  financing_spread: String,
  product_type:  String,
  issue_price:  String,
  reference_instrument:String,
  underlying:  String,
  ratio:  Number,
  redemption_currency:  String,
  redemption_delivery:  String,
  issuer:  String,
  guarantor:  String,
  currency:  String,
  investment_class:  String,
  ref_stock_exchange:  String,
  initial_fixing:  Date,
  issue_date:  Date,
});

module.exports = mongoose.model('bull_n_bear_details_example', bullNBearDetailSchema);

