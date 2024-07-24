const express = require("express");
const handleAsyncErr = require("../utils/handleAsyncErr.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersContrller = require("../controllers/users.js");

const router = express.Router();

router
  .route("/login")
  .get(usersContrller.loginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    handleAsyncErr(usersContrller.login)
  );
router
  .route("/signup")
  .get(usersContrller.signupPage)
  .post(handleAsyncErr(usersContrller.signup));
router.get("/logout", usersContrller.logout);

module.exports = router;
