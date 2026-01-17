// DON'T USE THIS FILE. CERTIFICATE AUTH CURRENTLY BEING USED.

import { MongoClient, ServerApiVersion } from 'mongodb';

const pass = process.env.MONGO_DB_PASS;
const uri = "mongodb+srv://newuser2:" + pass + "@clussy.ua97stz.mongodb.net/?appName=Clussy";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("testDB");
    const collection = database.collection("testCol");
    const docCount = await collection.countDocuments({});
    return docCount
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export { run }