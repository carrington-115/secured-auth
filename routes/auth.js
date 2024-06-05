const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { createUser } = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    await createUser(username, password);
    res.redirect("/auth/login");
  } catch (error) {
    throw new Error(error);
  }
});

const redirectIfLoggedIn = (req, res, next) => {
  if (req.user) return res.redirect("/profile");
  return next();
};

router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  redirectIfLoggedIn,
  passport.authenticate("local", {
    successRedirect: "/auth/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/profile", (req, res) => {
  if (!req.isAuthenticated) {
    res.redirect("/auth/login");
  }
  const { username } = req.user;
  return res
    .status(200)
    .json({ success: true, message: `${username} is logged in` });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;
