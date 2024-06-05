require("dotenv").config({ path: ".env" });
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");

app.set("view engine", "ejs");

app.use([
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_API }),
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
