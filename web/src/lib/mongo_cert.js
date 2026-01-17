import { MongoClient, ServerApiVersion } from 'mongodb';

const credentials = import.meta.env.VITE_MONGO_CERT_PATH;

const client = new MongoClient('mongodb+srv://clussy.ua97stz.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&appName=Clussy', {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});
async function run() {
  try {
    await client.connect();
    const database = client.db("testDB");
    const collection = database.collection("testCol");
    const docCount = await collection.countDocuments({});
    console.log(docCount);
    return docCount;
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export { run }