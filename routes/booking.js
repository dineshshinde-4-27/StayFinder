const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");

// 📌 Create a booking
router.post("/:listingId/book", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut, guests, totalPrice } = req.body;

    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    await booking.save();
    req.flash("success", "Booking confirmed!");
    res.redirect("/bookings");
  } catch (err) {
    req.flash("error", "Booking failed!");
    res.redirect("back");
  }
});

// 📌 View all bookings for the logged-in user
router.get("/", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "listing"
  );
  res.render("bookings/index", { bookings });
});

// 📌 View a single booking
router.get("/:bookingId", isLoggedIn, async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate(
    "listing"
  );
  res.render("bookings/show", { booking });
});

// 📌 Cancel a booking
router.post("/:bookingId/cancel", isLoggedIn, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.bookingId, {
    status: "cancelled",
  });
  req.flash("success", "Booking cancelled!");
  res.redirect("/bookings");
});

module.exports = router;
