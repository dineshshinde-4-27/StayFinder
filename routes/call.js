const express = require("express");
const Listing = require("../models/listing");
const router = express.Router();

// Route to open a specific video call room
router.get("/:room", async (req, res) => {
  try {
    const roomName = req.params.room;
    console.log("Requested Room ID:", roomName);

    // Extracting actual MongoDB ID from roomName
    const actualId = roomName.replace("StayFinderRoom", "");

    // Find the hotel and populate the owner details
    const hotel = await Listing.findById(actualId).populate("owner");

    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    res.render("call", { roomName, hotel });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
