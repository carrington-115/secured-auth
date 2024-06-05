require("dotenv").config({ path: "../.env" });
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

// setting up the database params
const client = new MongoClient(process.env.MONGO_DB_API);
const clientSession = client.startSession();
const dbName = "Accounts";
const db = client.db(dbName);
const accountsCollections = db.collection("users");

const getUserByUsername = async (username) => {
  clientSession.startTransaction();
  try {
    const user = await db.collection("users").findOne({ username: username });
    await clientSession.commitTransaction();
    return user;
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
    const user = await accountsCollections.findOne({ _id: new ObjectId(id) });
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
    const addUsertoDB = await accountsCollections.insertOne({
      username,
      password: hashedPassword,
    });
    console.log("sent data", addUsertoDB);
    return addUsertoDB.insertedId;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { getUserById, getUserByUsername, createUser };
