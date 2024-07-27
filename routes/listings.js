const express = require("express");
const router = express.Router();
const handleAsyncErr = require("../utils/handleAsyncErr");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { schemaValidation } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({ storage });

// Schema validation function

router
  .route("/")
  // Route to display all listings
  .get(handleAsyncErr(listingsController.allListing))
  // Route to handle the creation of a new listing
  .post(
    isLoggedIn,
    upload.single("Listing[imgUrl]"),
    schemaValidation,
    handleAsyncErr(listingsController.newListingDataSaver)
  );

// Route to show form for creating a new listing
router.get("/new", isLoggedIn, listingsController.newListingForm);

// Route to display a specific listing by ID
router.get(
  "/:id/show",
  handleAsyncErr(listingsController.showIndividualListing)
);

// Route to show form for editing a specific listing by ID
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  handleAsyncErr(listingsController.individualListingUpdateForm)
);

// Route to handle the update of a specific listing by ID
router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("Listing[imgUrl]"),
    schemaValidation,
    handleAsyncErr(listingsController.individualUpdateSaver)
  )
  // Route to handle the deletion of a specific listing by ID
  .delete(
    isLoggedIn,
    isOwner,
    handleAsyncErr(listingsController.deleteIndividualListing)
  );
//  Request for search by country

module.exports = router;
