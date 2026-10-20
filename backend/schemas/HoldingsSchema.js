const { Schema } = require("mongoose");

// price/net/day are kept for older documents; the API now works them out
// from the live (simulated) quote each time holdings are read.
const HoldingsSchema = new Schema({
  name: { type: String, required: true, uppercase: true, trim: true },
  qty: { type: Number, required: true, min: 0 },
  avg: { type: Number, required: true, min: 0 },
  price: Number,
  net: String,
  day: String,
});

module.exports = { HoldingsSchema };
