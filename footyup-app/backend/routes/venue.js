import express from "express";
import { db } from "./database.js";

const router = express.Router();

// Fetch all user rendered venues
router.get("/", (req, res) => {
  const query = "SELECT * FROM venue";
  db.query(query, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error retrieving venues" });
    res.json(result); // Send venues as JSON
  });
});

// Add New Venue
router.post("/", (req, res) => {
  const { venue_name, venue_address, venue_description, venue_image } =
    req.body;
  const query =
    "INSERT INTO venue (venue_name, venue_address, venue_description, venue_image) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [venue_name, venue_address, venue_description, venue_image],
    (err, result) => {
      if (err) {
        console.error("Error adding venue:", err);
        return res.status(500).json({ message: "Error adding venue" });
      }
      res.status(201).json({ message: "Venue added successfully" });
    },
  );
});

// Fetch venue by ID
router.get("/:id", (req, res) => {
  const venueId = req.params.id;
  const query = "SELECT * FROM venue WHERE venue_id = ?";
  db.query(query, [venueId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error retrieving venue details" });
    if (result.length === 0)
      return res.status(404).json({ message: "Venue not found" });
    res.json(result[0]);
  });
});

// Update Venue
router.put("/:id", (req, res) => {
  const venueId = req.params.id;
  const { venue_name, venue_address, venue_description, venue_image } =
    req.body;

  const query =
    "UPDATE venue SET venue_name = ?, venue_address = ?, venue_description = ?, venue_image = ? WHERE venue_id = ?";
  db.query(
    query,
    [venue_name, venue_address, venue_description, venue_image, venueId],
    (err, result) => {
      if (err) {
        console.error("Error updating venue:", err);
        return res.status(500).json({ message: "Error updating venue" });
      }
      res.json({ message: "Venue updated successfully" });
    },
  );
});

// Delete Venue
router.delete("/:id", (req, res) => {
  const venueId = req.params.id;
  const query = "DELETE FROM venue WHERE venue_id = ?";
  db.query(query, [venueId], (err, result) => {
    if (err) {
      console.error("Error deleting venue:", err);
      return res.status(500).json({ message: "Error deleting venue" });
    }
    res.json({ message: "Venue deleted successfully" });
  });
});

export default router;
