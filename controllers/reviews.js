const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.addReview = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New review added...!");
  res.redirect(`/listings/${id}/show`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let userId = await Listing.findById(id);
  console.log(userId);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("delete", "Review removed...!");
  res.redirect(`/listings/${id}/show`);
};
