import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("Please add MONGO_URI to your .env.local");
}
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
