require("dotenv").config();

const { createApp } = require("./app");
const { createMemoryStore } = require("./store/memoryStore");
const { createMongoStore } = require("./store/mongoStore");

const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

async function main() {
  let store;
  if (MONGO_URL) {
    store = await createMongoStore(MONGO_URL);
    console.log("Connected to MongoDB.");
  } else {
    store = createMemoryStore();
    console.warn("MONGO_URL is not set: using in-memory data (resets on restart).");
  }

  const app = createApp(store);
  await app.locals.trading.seedIfEmpty();

  app.listen(PORT, () => {
    console.log(`Vittora API listening on port ${PORT} (storage: ${store.kind}).`);
  });
}

main().catch((err) => {
  console.error("Vittora API failed to start:", err.message);
  process.exit(1);
});
