const { Schema } = require("mongoose");

const OrdersSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    product: { type: String, default: "CNC" },
    brokerage: { type: Number, default: 0 },
    status: { type: String, default: "COMPLETE" },
  },
  { timestamps: true },
);

module.exports = { OrdersSchema };
