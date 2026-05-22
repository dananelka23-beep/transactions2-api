const { MongoClient } = require("mongodb");

let client;
let db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  client = new MongoClient(uri);

  await client.connect();

  db = client.db();

  console.log("Connected to MongoDB");

  return db;
}

function getDatabase() {
  if (!db) {
    throw new Error("Database has not been initialized.");
  }

  return db;
}

async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectToDatabase,
  getDatabase,
  closeDatabaseConnection
};