const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@prakarsa-hijau.koqsddm.mongodb.net/?retryWrites=true&w=majority&appName=prakarsa-hijau`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

const connectToDatabase = async () => {
  try {
    await client.connect();
    database = client.db("prakarsa-hijau");
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const getDatabase = () => database;

module.exports = {
  connectToDatabase,
  getDatabase,
};
