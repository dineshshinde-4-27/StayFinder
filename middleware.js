const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require("./Schema.js");
const { reviewSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // we will store the user redirect url, it is that end for where her/she redirected to the loging page so after loging want them to redirect on that page
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "Login first or create account if don't have");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "Only owner can update their listing");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};

module.exports.schemaValidation = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.reviewValidation = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const { id } = req.params;

  const listing = await Review.findById(reviewId);

  if (!listing.author._id.equals(req.user._id)) {
    req.flash("error", "You are not the auther of this Review");
    return res.redirect(`/listings/${id}/show`);
  }
  next();
};
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please log in first.");
    return res.redirect("/login");
  }
  next();
};
