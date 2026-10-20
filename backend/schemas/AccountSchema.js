const { Schema } = require("mongoose");

// One demo trading account holds the cash balance used by the order flow.
const AccountSchema = new Schema({
  key: { type: String, default: "primary", unique: true },
  openingBalance: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  payin: { type: Number, default: 0 },
  payout: { type: Number, default: 0 },
});

module.exports = { AccountSchema };
