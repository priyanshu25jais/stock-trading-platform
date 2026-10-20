// In-memory store with the same interface as the MongoDB store.
// Used automatically when MONGO_URL is not set (local development and tests).
// Data resets every time the server restarts.

const crypto = require("crypto");

const KINDS = ["holdings", "positions", "orders", "account"];

function matches(doc, query) {
  return Object.entries(query).every(([k, v]) => doc[k] === v);
}

function clone(doc) {
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
}

function createMemoryStore() {
  const data = Object.fromEntries(KINDS.map((k) => [k, []]));

  const table = (kind) => {
    if (!data[kind]) throw new Error(`Unknown collection: ${kind}`);
    return data[kind];
  };

  return {
    kind: "memory",

    async list(kind, { newestFirst = false, limit } = {}) {
      let rows = table(kind).map(clone);
      if (newestFirst) rows = rows.reverse();
      if (limit) rows = rows.slice(0, limit);
      return rows;
    },

    async findOne(kind, query) {
      return clone(table(kind).find((d) => matches(d, query)));
    },

    async upsert(kind, query, fields) {
      const rows = table(kind);
      const existing = rows.find((d) => matches(d, query));
      if (existing) {
        Object.assign(existing, fields);
        return clone(existing);
      }
      const doc = { _id: crypto.randomUUID(), ...query, ...fields };
      rows.push(doc);
      return clone(doc);
    },

    async remove(kind, query) {
      const rows = table(kind);
      const index = rows.findIndex((d) => matches(d, query));
      if (index >= 0) rows.splice(index, 1);
    },

    async insert(kind, doc) {
      const created = { _id: crypto.randomUUID(), ...doc };
      table(kind).push(created);
      return clone(created);
    },

    async insertMany(kind, docs) {
      for (const doc of docs) await this.insert(kind, doc);
    },

    async count(kind) {
      return table(kind).length;
    },

    async close() {},
  };
}

module.exports = { createMemoryStore };
