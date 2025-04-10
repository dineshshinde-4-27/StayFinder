const express = require("express");
const router = express.Router();

// Route to open a specific video call room
router.get("/:room", (req, res) => {
  const roomName = req.params.room;
  res.render("call", { roomName });
});

module.exports = router;
