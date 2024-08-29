// @ts-nocheck
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;
async function getMongoClient() {
  if (!global.mongoClientPromise) {
    const client = new MongoClient(uri);
    // client.connect() returns an instance of MongoClient when resolved
    global.mongoClientPromise = client.connect().then((client) => client);
  }
  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db("restake_coredao") as Db;
}