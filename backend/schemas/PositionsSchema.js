const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
  product: { type: String, default: "MIS" },
  name: { type: String, required: true, uppercase: true, trim: true },
  qty: { type: Number, required: true, min: 0 },
  avg: { type: Number, required: true, min: 0 },
  price: Number,
  net: String,
  day: String,
  isLoss: Boolean,
});

module.exports = { PositionsSchema };
