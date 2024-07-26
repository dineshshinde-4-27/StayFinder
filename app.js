if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const handleAsyncErr = require("./utils/handleAsyncErr.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const expressSession = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");
const app = express();
const port = 3000;

// Connect to MongoDB
const dbUrl = process.env.ATLASDB_URL;

async function main(dbUrl) {
  await mongoose.connect(dbUrl);
}

main(dbUrl)
  .then(() => {
    console.log("Connection established with Database");
  })
  .catch((err) => {
    console.log(err);
  });
// mongo store for session storage
const store = mongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("Error at Monog Session Strore", err);
});
const sessoinOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(expressSession(sessoinOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Express app configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to handle HTTP verbs such as PUT and DELETE
app.use(methodOverride("_method"));

// Set EJS as the template engine with ejsMate for layout support
app.engine("ejs", ejsMate);

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  res.locals.message = req.flash("success");
  res.locals.delItem = req.flash("delete");
  res.locals.updateItem = req.flash("update");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Home page route
// expres Sexsion

// Error handler for page not found
app.all("*", (req, res, next) => {
  // next(new ExpressError(404, "Page Not Found"));

  req.flash("error", "Page Not found");
  res.redirect("/listings");
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  if (!(err instanceof ExpressError)) {
    err = new ExpressError(
      err.status || 500,
      err.message || "Internal Server Error"
    );
  }
  res.status(err.status).render("listings/error.ejs", { err });
});

app.listen(port, () => {
  console.log("Connected to Server");
});
