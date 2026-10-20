// MongoDB store (used when MONGO_URL is set, e.g. on Render with MongoDB Atlas).

const mongoose = require("mongoose");

const { HoldingsModel } = require("../model/HoldingsModel");
const { PositionsModel } = require("../model/PositionsModel");
const { OrdersModel } = require("../model/OrdersModel");
const { AccountModel } = require("../model/AccountModel");

const MODELS = {
  holdings: HoldingsModel,
  positions: PositionsModel,
  orders: OrdersModel,
  account: AccountModel,
};

function toPlain(doc) {
  if (!doc) return null;
  const out = { ...doc, _id: String(doc._id) };
  // Orders saved before timestamps were added have no createdAt;
  // the ObjectId still records when the document was created.
  if (!out.createdAt && doc._id && typeof doc._id.getTimestamp === "function") {
    out.createdAt = doc._id.getTimestamp();
  }
  delete out.__v;
  return out;
}

async function createMongoStore(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  const model = (kind) => {
    const m = MODELS[kind];
    if (!m) throw new Error(`Unknown collection: ${kind}`);
    return m;
  };

  return {
    kind: "mongodb",

    async list(kind, { newestFirst = false, limit } = {}) {
      let q = model(kind).find({});
      q = q.sort({ _id: newestFirst ? -1 : 1 });
      if (limit) q = q.limit(limit);
      const rows = await q.lean();
      return rows.map(toPlain);
    },

    async findOne(kind, query) {
      return toPlain(await model(kind).findOne(query).lean());
    },

    async upsert(kind, query, fields) {
      const doc = await model(kind)
        .findOneAndUpdate(query, { $set: { ...query, ...fields } }, { upsert: true, new: true })
        .lean();
      return toPlain(doc);
    },

    async remove(kind, query) {
      await model(kind).deleteOne(query);
    },

    async insert(kind, doc) {
      const created = await model(kind).create(doc);
      return toPlain(created.toObject());
    },

    async insertMany(kind, docs) {
      await model(kind).insertMany(docs);
    },

    async count(kind) {
      return model(kind).countDocuments({});
    },

    async close() {
      await mongoose.disconnect();
    },
  };
}

module.exports = { createMongoStore };
