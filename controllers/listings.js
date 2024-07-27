const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const { cloudinary } = require("../CloudConfig.js");
const { toCapitalize } = require("../utils/util.js");
const { config } = require("dotenv");

module.exports.allListing = async (req, res) => {
  let allListing = await Listing.find({});
  let country = req.query.country;
  if (country) {
    country = toCapitalize(country);
    const dataByCountry = await Listing.find({ country: country });
    console.log(dataByCountry.length);

    allListing = dataByCountry;
  }
  res.render("listings/index.ejs", { allListing, country });
};

module.exports.newListingForm = (req, res, next) => {
  res.render("listings/new.ejs");
};
module.exports.showIndividualListing = async (req, res) => {
  const { id } = req.params;

  const chat = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!chat) {
    // throw new ExpressError(404, "Listing not found");
    req.flash("error", "Page doesn't exist...!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { chat });
};

module.exports.newListingDataSaver = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.Listing.location}, ${req.body.Listing.country}`,
      limit: 2,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  let listing = new Listing(req.body.Listing);

  listing.owner = req.user._id;
  listing.imgUrl = { url, filename };
  listing.geometry = response.body.features[0].geometry;
  listing.country = toCapitalize(listing.country);
  await listing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.individualListingUpdateForm = async (req, res) => {
  const { id } = req.params;
  const chat = await Listing.findById(id);
  let originalUrl = chat.imgUrl.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_300");

  if (!chat) {
    req.flash(
      "error",
      "Page you are trying to update might be deleted or not exist"
    );
    return res.redirect("/listings");

    // throw new ExpressError(404, "Listing not found");
  }
  res.render("listings/edit.ejs", { chat, originalUrl });
};

module.exports.individualUpdateSaver = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: `${req.body.Listing.location}, ${req.body.Listing.country}`,
      limit: 2,
    })
    .send();
  const { id } = req.params;
  const updated = req.body.Listing;
  updated.country = toCapitalize(updated.country);

  const listing = await Listing.findByIdAndUpdate(id, updated, {
    runValidators: true,
    new: true,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.imgUrl = { url, filename };
  }
  listing.geometry = response.body.features[0].geometry;
  let data = await listing.save();

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("update", "Listing Updated...!");
  res.redirect(`/listings/${id}/show`);
};

module.exports.deleteIndividualListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (listing.imgUrl.filename) {
    const delFromCloudinary = await cloudinary.uploader.destroy(
      listing.imgUrl.filename
    );
    console.log(delFromCloudinary);
  }

  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "Only owner can delete their listing");
    return res.redirect(`/listings/${id}/show`);
  }
  const chat = await Listing.findByIdAndDelete(id);
  if (!chat) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success", "Listing Deleted...!");
  res.redirect("/listings");
};
