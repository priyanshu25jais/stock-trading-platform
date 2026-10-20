const { model } = require("mongoose");

const { AccountSchema } = require("../schemas/AccountSchema");

const AccountModel = model("account", AccountSchema);

module.exports = { AccountModel };
