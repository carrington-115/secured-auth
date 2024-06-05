require("dotenv").config({ path: ".env" });
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_DB_API);
const dbName = "Accounts";

client
  .connect()
  .then(() => console.log("The db client is connect"))
  .catch((err) => {
    throw new Error(err);
  });

app.set("view engine", "ejs");

app.use([
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ client: client, dbName: dbName }),
    cookie: { secure: false },
  }),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  passport.initialize(),
  passport.session(),
]);

app.use("/auth", authRouter);

app.listen(process.env.PORT, (error) => {
  if (error) {
    throw new Error(error);
  }
  console.log("The app is running on", process.env.PORT);
});
