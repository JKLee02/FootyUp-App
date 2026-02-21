import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { db } from "./routes/database.js";
import authRoutes from "./routes/auth.js";
import userVenueRoutes from "./routes/venue.js";
import teamRoutes from "./routes/teams.js";
import tournamentRoutes from "./routes/tournaments.js";
import matchesRoutes from "./routes/matches.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(bodyParser.json());

db.on("query", (query) => {
  console.log("SQL:", query.sql);
});

// Import auth routes
app.use("/auth", authRoutes);

// Import venue routes
app.use("/venue", userVenueRoutes);

// Import teams routes
app.use("/teams", teamRoutes);

// Import tournaments routes
app.use("/tournaments", tournamentRoutes);

// Import matches routes
app.use("/matches", matchesRoutes);

// Fetch all user details (for admin)
app.get("/users", (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving users" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch/check user is in a team
app.get("/user/:userId/team", (req, res) => {
  const query = `
    SELECT 
      t.*,
      IF(t.team_captain_id = u.user_id, 1, 0) as isCaptain
    FROM user u
    LEFT JOIN team t ON u.user_team = t.team_id
    WHERE u.user_id = ?`;

  db.query(query, [req.params.userId], (err, results) => {
    if (err) {
      console.error("Error checking user team:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0 && results[0].team_id) {
      res.json({
        team: {
          team_id: results[0].team_id,
          team_name: results[0].team_name,
          team_desc: results[0].team_desc,
          team_image: results[0].team_image,
          team_captain_id: results[0].team_captain_id,
          team_captain: results[0].team_captain,
        },
        isCaptain: results[0].isCaptain === 1,
      });
    } else {
      res.json({ team: null, isCaptain: false });
    }
  });
});

//Starting Express server on port 8081
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
