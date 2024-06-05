require("dotenv").config({ path: "../.env" });
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

// setting up the database params
const client = new MongoClient(process.env.MONGO_DB_API);
const clientSession = client.startSession();
let db;
const dbName = "Accounts";

const connectDB = async () => {
  try {
    if (!db) {
      await client.connect();
      db = client.db(dbName);
    }
    return db;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByUsername = async (username) => {
  clientSession.startTransaction();
  try {
    const db = await connectDB();
    const user = db.collection("users").aggregate([
      {
        $match: { name: username },
      },
    ]);
    await clientSession.commitTransaction();
    if (user) {
      return user;
    } else {
      return `The user: ${username} does not exist`;
    }
  } catch (error) {
    await clientSession.abortTransaction();
    throw new Error(error);
  } finally {
    await clientSession.endSession();
  }
};

const getUserById = async (id) => {
  clientSession.startTransaction();
  try {
    const db = await connectDB();
    const user = db
      .collection("Accounts")
      .aggregate([{ $match: { _id: new ObjectId(id) } }]);
    await clientSession.commitTransaction();
    return user;
  } catch (error) {
    await clientSession.abortTransaction();
    throw new Error(error);
  } finally {
    await clientSession.endSession();
  }
};

const createUser = async (username, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const addUsertoDB = await db.collection("Accounts").aggregate([
      {
        $set: { username, password: hashedPassword },
      },
    ]);
    return addUsertoDB.insertedId;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getUserById, getUserByUsername, createUser };
