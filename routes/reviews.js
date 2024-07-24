const express = require("express");
const handleAsyncErr = require("../utils/handleAsyncErr.js");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware.js");
const { reviewValidation } = require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Reviews Route
router.post(
  "/",
  reviewValidation,
  isLoggedIn,
  handleAsyncErr(reviewController.addReview)
);

// Delete Reviews Route
// "/" before the start is required
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  handleAsyncErr(reviewController.deleteReview)
);

module.exports = router;
