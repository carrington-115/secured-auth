const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getUserById, getUserByUsername } = require("../models/user");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "User does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "The password is incorrect" });
      }
      console.log("passport user", user);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id._id);
    done(null, user);
  } catch (error) {
    return done(null, error);
  }
});

module.exports = passport;
