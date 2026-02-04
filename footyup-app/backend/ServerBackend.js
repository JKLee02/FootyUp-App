import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

//JWT secret key
const jwtSecret = "your_jwt_secret_key";

// Refresh token endpoint
app.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Verify the refresh token (assuming it's stored in your backend somewhere)
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    // If valid, generate a new access token
    const newAccessToken = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ accessToken: newAccessToken });
  });
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Error during user lookup:", err);
      return res.status(500).json({ message: "Error checking user existence" });
    }
    if (result.length > 0) {
      console.warn("User already exists with this email:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Insert user into the database (plain text password)
    db.query(
      "INSERT INTO user (`user_firstname`, `user_lastname`, `email`, `password`) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, password],
      (err, result) => {
        if (err) {
          console.error("Error inserting new user:", err);
          return res.status(500).json({ message: "Error creating user" });
        }
        res.status(201).json({ message: "User registered successfully" });
      },
    );
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];

      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const accessToken = jwt.sign({ id: user.user_id }, jwtSecret, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ id: user.user_id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user_firstname: user.user_firstname,
        user_id: user.user_id,
      });
    },
  );
});

// Fetch all venues
app.get("/uservenue", (req, res) => {
  const query = "SELECT * FROM venue";
  db.query(query, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error retrieving venues" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch all teams
app.get("/teams", (req, res) => {
  const query = "SELECT * FROM team";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving teams" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch all user details
app.get("/users", (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving users" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch all tournaments details
app.get("/tournaments", (req, res) => {
  const query = "SELECT * FROM tournament";
  db.query(query, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error retrieving tournaments" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch only pending approval tournaments (for admin)
app.get("/tournaments/pendingapproval", (req, res) => {
  const query =
    'SELECT * FROM tournament WHERE tournament_status = "Pending Approval"';
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching approved tournaments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// Fetch all completed matches details
app.get("/matches", (req, res) => {
  const query = "SELECT * FROM matches";
  db.query(query, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error retrieving matches" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch all completed matches details
app.get("/matches/completed", (req, res) => {
  const query = 'SELECT * FROM matches WHERE match_status = "Completed"';
  db.query(query, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error retrieving completed matches" });
    res.json(result); // Send venues as JSON
  });
});

//Venue Route
// Fetch venue by ID
app.get("/uservenue/:id", (req, res) => {
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

// Add New Venue
app.post("/venue", (req, res) => {
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

// Update Venue
app.put("/venue/:id", (req, res) => {
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
app.delete("/venue/:id", (req, res) => {
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

// Fetch User Profile Details Route
app.get("/userprofile", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    db.query(
      "SELECT user_firstname, user_lastname, email, password, user_gender FROM user WHERE user_id = ?",
      [decoded.id],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];
        res.json({
          firstName: user.user_firstname,
          lastName: user.user_lastname,
          email: user.email,
          password: user.password,
          gender: user.user_gender,
        });
      },
    );
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Update user details
app.put("/userprofile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, jwtSecret);
  const { firstName, lastName, email, password, gender } = req.body;

  const updates = [];
  const values = [];

  if (firstName) {
    updates.push("user_firstname = ?");
    values.push(firstName);
  }
  if (lastName) {
    updates.push("user_lastname = ?");
    values.push(lastName);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }
  if (password) {
    updates.push("password = ?");
    values.push(password);
  }
  if (gender) {
    updates.push("user_gender = ?");
    values.push(gender);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(decoded.id);

  const query = `UPDATE user SET ${updates.join(", ")} WHERE user_id = ?`;
  db.query(query, values, (err) => {
    if (err)
      return res.status(500).json({ message: "Error updating user details" });
    res.json({ message: "User details updated successfully" });
  });
});

// Team related stuff
// Fetch team details by user ID
app.get("/teams/:teamId", (req, res) => {
  const query = `
    SELECT 
      t.*,
      (SELECT COUNT(*) FROM user WHERE user_team = t.team_id) as members_count,
      GROUP_CONCAT(DISTINCT u.user_firstname) as member_names,
      tc.user_firstname as captain_name
    FROM team t
    LEFT JOIN user u ON t.team_id = u.user_team
    LEFT JOIN user tc ON t.team_captain_id = tc.user_id
    WHERE t.team_id = ?
    GROUP BY t.team_id`;

  db.query(query, [req.params.teamId], (err, result) => {
    if (err) {
      console.error("Error fetching team:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    const team = result[0];
    res.json({
      id: team.team_id,
      name: team.team_name,
      description: team.team_desc || "",
      image: team.team_image || "",
      captain: team.captain_name,
      members: team.members_count || 1,
      memberNames: team.member_names ? team.member_names.split(",") : [],
    });
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

// Fetch upcoming matches for a team with tournament date and time
app.get("/matches/upcoming/:teamId", (req, res) => {
  const { teamId } = req.params;

  const query = `
    SELECT matches.*, tournament.tournament_date, tournament.tournament_time
    FROM matches
    JOIN tournament ON matches.match_tournament_id = tournament.tournament_id
    WHERE (team_1_id = ? OR team_2_id = ?)
      AND match_status = 'Scheduled'
  `;

  db.query(query, [teamId, teamId], (err, result) => {
    if (err) {
      console.error("Error fetching upcoming matches:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// Fetch completed matches for a team with tournament date and time
app.get("/matches/completed/:teamId", (req, res) => {
  const { teamId } = req.params;

  const query = `
    SELECT matches.*, tournament.tournament_date, tournament.tournament_time
    FROM matches
    JOIN tournament ON matches.match_tournament_id = tournament.tournament_id
    WHERE (team_1_id = ? OR team_2_id = ?)
      AND match_status = 'Completed'
  `;

  db.query(query, [teamId, teamId], (err, result) => {
    if (err) {
      console.error("Error fetching completed matches:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// Create a new team
app.post("/teams", (req, res) => {
  const {
    name,
    description,
    membersAmount,
    teamImage,
    captainId,
    captainName,
  } = req.body;

  const teamDescription = description || null; // Null if no description is provided

  const createTeamQuery = `
  INSERT INTO team (team_name, team_desc, members_amount, team_image, team_captain_id, team_captain) 
  VALUES (?, ?, 1, ?, ?, ?)
`;

  db.query(
    createTeamQuery,
    [name, teamDescription || null, teamImage || null, captainId, captainName],
    (err, result) => {
      if (err) {
        console.error("Error inserting team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const teamId = result.insertId;

      // Update the user's team
      const updateUserQuery = `
    UPDATE user SET user_team = ? WHERE user_id = ?
  `;

      db.query(updateUserQuery, [teamId, captainId], (err) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({ message: "Team created successfully", teamId });
      });
    },
  );
});

// Update team information
app.put("/teams/:teamId", (req, res) => {
  const { teamId } = req.params;
  const { name, description, teamImage, userId } = req.body;

  // Check if the user is the team captain
  const checkCaptainQuery =
    "SELECT * FROM team WHERE team_id = ? AND team_captain_id = ?";
  db.query(checkCaptainQuery, [teamId, userId], (err, teamResult) => {
    if (err) {
      console.error("Error checking team captain:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (teamResult.length === 0) {
      return res.status(403).json({ error: "User is not the team captain" });
    }

    // Update the team information
    const updateTeamQuery = `
      UPDATE team 
      SET team_name = ?, team_desc = ?, team_image = ?
      WHERE team_id = ?`;
    db.query(
      updateTeamQuery,
      [name, description || null, teamImage || null, teamId],
      (err) => {
        if (err) {
          console.error("Error updating team:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Team updated successfully" });
      },
    );
  });
});

// Fetch all teams
app.get("/teams", (req, res) => {
  const query = "SELECT * FROM team";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving teams" });
    res.json(result); // Send venues as JSON
  });
});

// Add a new member to a team
app.post("/teams/:teamId/members", (req, res) => {
  const { teamId } = req.params;
  const { userId, userName } = req.body;

  // Check if team exists
  const checkTeamQuery = "SELECT * FROM team WHERE team_id = ?";
  db.query(checkTeamQuery, [teamId], (err, teamResult) => {
    if (err) {
      console.error("Error checking team:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (teamResult.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if user is already in a team
    const checkUserTeamQuery = "SELECT * FROM user WHERE user_id = ?";
    db.query(checkUserTeamQuery, [userId], (err, userResult) => {
      if (err) {
        console.error("Error checking user team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (userResult.length > 0 && userResult[0].user_team) {
        return res
          .status(400)
          .json({ error: "User already belongs to a team" });
      }

      // Add user to the team by updating user_team column
      const updateUserTeamQuery =
        "UPDATE user SET user_team = ? WHERE user_id = ?";
      db.query(updateUserTeamQuery, [teamId, userId], (err) => {
        if (err) {
          console.error("Error updating user team:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Increment members_amount for the team
        const updateTeamQuery = `
            UPDATE team 
            SET members_amount = members_amount + 1 
            WHERE team_id = ?
          `;
        db.query(updateTeamQuery, [teamId], (err) => {
          if (err) {
            console.error("Error updating team members:", err);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(200).json({ message: "User added to team successfully" });
        });
      });
    });
  });
});

// Fetch all members of a specific team
app.get("/teams/:teamId/members", (req, res) => {
  const { teamId } = req.params;

  const query = `
    SELECT 
      user_id AS id,
      user_firstname AS firstName,
      user_lastname AS lastName
    FROM user
    WHERE user_team = ?`;

  db.query(query, [teamId], (err, results) => {
    if (err) {
      console.error("Error fetching team members:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No members found in this team" });
    }

    const members = results.map((member) => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
    }));

    res.json(members);
  });
});

// User leaves a team
app.post("/teams/:teamId/leave", (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  // Check if team exists
  const checkTeamQuery = "SELECT * FROM team WHERE team_id = ?";
  db.query(checkTeamQuery, [teamId], (err, teamResult) => {
    if (err) {
      console.error("Error checking team:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (teamResult.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if user is in the team
    const checkUserTeamQuery =
      "SELECT * FROM user WHERE user_id = ? AND user_team = ?";
    db.query(checkUserTeamQuery, [userId, teamId], (err, userResult) => {
      if (err) {
        console.error("Error checking user team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (userResult.length === 0) {
        return res.status(400).json({ error: "User is not in this team" });
      }

      // Remove user from the team by updating user_team column
      const updateUserTeamQuery =
        "UPDATE user SET user_team = NULL WHERE user_id = ?";
      db.query(updateUserTeamQuery, [userId], (err) => {
        if (err) {
          console.error("Error updating user team:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Decrement members_amount for the team
        const updateTeamQuery = `
          UPDATE team 
          SET members_amount = members_amount - 1 
          WHERE team_id = ?`;
        db.query(updateTeamQuery, [teamId], (err) => {
          if (err) {
            console.error("Error updating team members:", err);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(200).json({ message: "User left the team successfully" });
        });
      });
    });
  });
});

//Team captain deletes a team
app.delete("/teams/:teamId/delete", (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  // Check if team exists and if user is the captain
  const checkCaptainQuery =
    "SELECT * FROM team WHERE team_id = ? AND team_captain_id = ?";
  db.query(checkCaptainQuery, [teamId, userId], (err, teamResult) => {
    if (err) {
      console.error("Error checking team:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (teamResult.length === 0) {
      return res
        .status(404)
        .json({ error: "Team not found or user is not the captain" });
    }

    // Remove all users from the team
    const removeUsersQuery =
      "UPDATE user SET user_team = NULL WHERE user_team = ?";
    db.query(removeUsersQuery, [teamId], (err) => {
      if (err) {
        console.error("Error removing users from team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Delete the team
      const deleteTeamQuery = "DELETE FROM team WHERE team_id = ?";
      db.query(deleteTeamQuery, [teamId], (err) => {
        if (err) {
          console.error("Error deleting team:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(200).json({ message: "Team deleted successfully" });
      });
    });
  });
});

// Create a new tournament
app.post("/tournaments", (req, res) => {
  const { title, description, startDate, startTime, gender, venueId, userId } =
    req.body;

  // Check if the user is in a team
  const checkUserTeamQuery =
    "SELECT * FROM user WHERE user_id = ? AND user_team IS NOT NULL";
  db.query(checkUserTeamQuery, [userId], (err, userResult) => {
    if (err) {
      console.error("Error checking user team:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (userResult.length === 0) {
      return res.status(403).json({
        error: "User is not in a team, please join a team to create one",
      });
    }

    const user = userResult[0];

    // Check if the venue exists
    const checkVenueQuery = "SELECT * FROM venue WHERE venue_id = ?";
    db.query(checkVenueQuery, [venueId], (err, venueResult) => {
      if (err) {
        console.error("Error checking venue:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (venueResult.length === 0) {
        return res.status(404).json({ error: "Venue not found" });
      }

      const venue = venueResult[0];

      // Insert the tournament into the database
      const createTournamentQuery = `
        INSERT INTO tournament (
          tournament_title, tournament_description, tournament_date, tournament_time, players_gender, 
          tournament_status, tournament_venue_id, tournament_venue_name, tournament_venue_desc, 
          tournament_venue_img, user_created_id, user_created_name
        ) VALUES (?, ?, ?, ?, ?, 'Pending Approval', ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        createTournamentQuery,
        [
          title,
          description,
          startDate,
          startTime,
          gender,
          venue.venue_id,
          venue.venue_name,
          venue.venue_description,
          venue.venue_image,
          user.user_id,
          user.user_firstname,
        ],
        (err, result) => {
          if (err) {
            console.error("Error creating tournament:", err);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(201).json({
            message: "Tournament created successfully",
            tournamentId: result.insertId,
          });
        },
      );
    });
  });
});

// Fetch only all approved tournaments + filtering
app.get("/tournaments/approved", (req, res) => {
  const { date, venue, gender } = req.query;
  let query = 'SELECT * FROM tournament WHERE tournament_status = "Approved"';
  const params = [];

  if (date) {
    query += " AND tournament_date = ?";
    params.push(date);
  }
  if (venue && venue !== "all") {
    query += " AND tournament_venue_name = ?";
    params.push(venue);
  }
  if (gender) {
    query += " AND players_gender = ?"; // assuming you store gender in the database
    params.push(gender);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error fetching filtered tournaments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// Fetch approved tournaments created by the user (according to their ids)
app.get("/tournaments/created/:userId", (req, res) => {
  const { userId } = req.params;
  const query =
    'SELECT * FROM tournament WHERE user_created_id = ? AND tournament_status = "Approved"';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching created tournaments:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

//Fetch tournaments by ID
app.get("/tournaments/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;
  const query = "SELECT * FROM tournament WHERE tournament_id = ?";
  db.query(query, [tournamentId], (err, result) => {
    if (err) {
      console.error("Error fetching tournament:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(result[0]); // Return the first result since tournament_id is unique
  });
});

// Delete tournament by ID
app.delete("/tournaments/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;

  // First, delete all matches related to the tournament
  const deleteMatchesQuery =
    "DELETE FROM matches WHERE match_tournament_id = ?";
  db.query(deleteMatchesQuery, [tournamentId], (err) => {
    if (err) {
      console.error("Error deleting tournament matches:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete tournament matches" });
    }

    // Then, delete the tournament itself
    const deleteTournamentQuery =
      "DELETE FROM tournament WHERE tournament_id = ?";
    db.query(deleteTournamentQuery, [tournamentId], (err, result) => {
      if (err) {
        console.error("Error deleting tournament:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      res.json({
        message: "Tournament and its associated matches deleted successfully",
      });
    });
  });
});

// Update tournament details
app.put("/tournaments/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;
  const {
    tournament_title,
    tournament_description,
    tournament_date,
    tournament_time,
    players_gender,
    tournament_status,
  } = req.body;

  const query = `
    UPDATE tournament 
    SET tournament_title = ?, tournament_description = ?, tournament_date = ?, tournament_time = ?, players_gender = ?, tournament_status = ?
    WHERE tournament_id = ?`;

  db.query(
    query,
    [
      tournament_title,
      tournament_description,
      tournament_date,
      tournament_time,
      players_gender,
      tournament_status,
      tournamentId,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating tournament:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      res.json({ message: "Tournament updated successfully" });
    },
  );
});

// Join a tournament
app.post("/tournaments/:tournamentId/join", (req, res) => {
  const { tournamentId } = req.params;
  const { userId } = req.body;

  // Query to calculate the number of teams in the tournament (based on matches)
  const checkTeamCountQuery = `
    SELECT COUNT(DISTINCT team_1_id) + COUNT(DISTINCT team_2_id) AS total_teams
    FROM matches
    WHERE match_tournament_id = ? AND (team_1_id IS NOT NULL OR team_2_id IS NOT NULL)
  `;

  db.query(checkTeamCountQuery, [tournamentId], (err, results) => {
    if (err) {
      console.error("Error checking team count:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const teamLimit = 4; // This could be a static value or fetched from another table

    if (results[0].total_teams >= teamLimit) {
      return res.status(400).json({
        error: `Cannot join this tournament. Maximum number of teams (${teamLimit}) reached.`,
      });
    }

    // Check if the user is in a team
    const checkUserTeamQuery =
      "SELECT * FROM user WHERE user_id = ? AND user_team IS NOT NULL";
    db.query(checkUserTeamQuery, [userId], (err, userResult) => {
      if (err) {
        console.error("Error checking user team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (userResult.length === 0) {
        return res.status(403).json({ error: "User is not in a team" });
      }

      const user = userResult[0];
      const teamId = user.user_team;

      // Fetch joining team names
      const fetchTeamNameQuery = "SELECT team_name FROM team WHERE team_id = ?";
      db.query(fetchTeamNameQuery, [teamId], (err, teamResult) => {
        if (err) {
          console.error("Error fetching team name:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (teamResult.length === 0) {
          return res.status(404).json({ error: "Team not found" });
        }

        const teamName = teamResult[0].team_name;

        // Check if the team is already in the tournament
        const checkTeamInTournamentQuery =
          "SELECT * FROM matches WHERE match_tournament_id = ? AND (team_1_id = ? OR team_2_id = ?)";
        db.query(
          checkTeamInTournamentQuery,
          [tournamentId, teamId, teamId],
          (err, matchResult) => {
            if (err) {
              console.error("Error checking team in tournament:", err);
              return res.status(500).json({ error: "Database error" });
            }

            if (matchResult.length > 0) {
              return res
                .status(403)
                .json({ error: "Team is already in the tournament" });
            }

            // Find an existing match with an empty slot
            const findEmptySlotQuery = `
            SELECT * FROM matches
            WHERE match_tournament_id = ? AND ((team_1_id IS NULL) OR (team_2_id IS NULL AND team_1_id IS NOT NULL)) AND match_round = 1
            LIMIT 1
          `;

            db.query(
              findEmptySlotQuery,
              [tournamentId],
              (err, emptySlotResult) => {
                if (err) {
                  console.error("Error finding empty slot:", err);
                  return res.status(500).json({ error: "Database error" });
                }

                if (emptySlotResult.length > 0) {
                  const match = emptySlotResult[0];

                  // Update team_1
                  const updateTeam1Query = `
                UPDATE matches
                SET 
                  team_1_id = IF(team_1_id IS NULL, ?, team_1_id),
                  team_1 = IF(team_1 IS NULL, ?, team_1)
                WHERE match_id = ?
              `;

                  db.query(
                    updateTeam1Query,
                    [teamId, teamName, match.match_id],
                    (err) => {
                      if (err) {
                        console.error("Error updating team 1:", err);
                        return res
                          .status(500)
                          .json({ error: "Database error" });
                      }

                      // Update team_2
                      const updateTeam2Query = `
                  UPDATE matches
                  SET 
                    team_2_id = IF(team_1_id IS NOT NULL AND team_2_id IS NULL, ?, team_2_id),
                    team_2 = IF(team_1 IS NOT NULL AND team_2 IS NULL, ?, team_2)
                  WHERE match_id = ?
                `;

                      db.query(
                        updateTeam2Query,
                        [teamId, teamName, match.match_id],
                        (err) => {
                          if (err) {
                            console.error("Error updating team 2:", err);
                            return res
                              .status(500)
                              .json({ error: "Database error" });
                          }

                          // Check if the match is now full
                          const checkMatchFullQuery = `
                    SELECT * FROM matches
                    WHERE match_id = ? AND team_1_id IS NOT NULL AND team_2_id IS NOT NULL
                  `;
                          db.query(
                            checkMatchFullQuery,
                            [match.match_id],
                            (err, fullMatchResult) => {
                              if (err) {
                                console.error(
                                  "Error checking match status:",
                                  err,
                                );
                                return res
                                  .status(500)
                                  .json({ error: "Database error" });
                              }

                              if (fullMatchResult.length > 0) {
                                console.log(
                                  "Match is now full and ready to play.",
                                );
                              }

                              res.status(201).json({
                                message: "Joined tournament successfully",
                              });
                            },
                          );
                        },
                      );
                    },
                  );
                } else {
                  // No empty slot found, create a new match
                  const insertMatchQuery = `
                INSERT INTO matches (team_1_id, team_1, match_tournament_id, match_round, match_status)
                VALUES (?, ?, ?, 1, 'Scheduled')
              `;
                  db.query(
                    insertMatchQuery,
                    [teamId, teamName, tournamentId],
                    (err, result) => {
                      if (err) {
                        console.error("Error inserting match:", err);
                        return res
                          .status(500)
                          .json({ error: "Database error" });
                      }

                      res
                        .status(201)
                        .json({ message: "Joined tournament successfully" });
                    },
                  );
                }
              },
            );
          },
        );
      });
    });
  });
});

// Fetch the count of teams in the tournament
app.get("/tournaments/:tournamentId/teams/count", (req, res) => {
  const { tournamentId } = req.params;

  // Query to calculate the number of teams in the tournament (based on matches)
  const countTeamsQuery = `
    SELECT COUNT(DISTINCT team_1_id) + COUNT(DISTINCT team_2_id) AS total_teams
    FROM matches
    WHERE match_tournament_id = ? AND (team_1_id IS NOT NULL OR team_2_id IS NOT NULL)
  `;

  db.query(countTeamsQuery, [tournamentId], (err, results) => {
    if (err) {
      console.error("Error counting teams:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Send the total team count
    res.json({ count: results[0].total_teams });
  });
});

// Check if a team has joined a tournament (only for the state button)
app.get("/tournaments/:tournamentId/team/:teamId", (req, res) => {
  const { tournamentId, teamId } = req.params;

  const query =
    "SELECT * FROM matches WHERE match_tournament_id = ? AND (team_1_id = ? OR team_2_id = ?)";
  db.query(query, [tournamentId, teamId, teamId], (err, result) => {
    if (err) {
      console.error("Error checking team in tournament:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ hasJoined: result.length > 0 });
  });
});

//Leave a tournament
app.post("/tournaments/:tournamentId/leave", (req, res) => {
  const { tournamentId } = req.params;
  const { userId } = req.body;

  // Check if the user is in a team
  const checkUserTeamQuery = `
    SELECT user_team AS teamId
    FROM user
    WHERE user_id = ? AND user_team IS NOT NULL
  `;
  db.query(checkUserTeamQuery, [userId], (err, userResult) => {
    if (err) {
      console.error("Error checking user team:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (userResult.length === 0) {
      return res.status(403).json({ error: "User is not in a team" });
    }

    const teamId = userResult[0].teamId;

    // Check if the team has participated in any completed matches
    const checkCompletedMatchesQuery = `
      SELECT match_round, match_status
      FROM matches
      WHERE match_tournament_id = ? 
      AND (team_1_id = ? OR team_2_id = ?)
      ORDER BY match_round DESC
    `;

    db.query(
      checkCompletedMatchesQuery,
      [tournamentId, teamId, teamId],
      (err, matchResult) => {
        if (err) {
          console.error("Error checking completed matches:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Check if any completed match exists
        const hasCompletedMatch = matchResult.some(
          (match) => match.match_status === "Completed",
        );

        // Check if the team is in the finals
        const isInFinals = matchResult.some(
          (match) => match.match_round === "Final",
        );

        if (hasCompletedMatch || isInFinals) {
          return res.status(403).json({
            error:
              "Cannot leave. Team has completed matches or is in the finals.",
          });
        }

        // Proceed to remove the team if no completed matches found
        const removeTeamQuery1 = `
        UPDATE matches
        SET team_1_id = NULL, team_1 = NULL
        WHERE match_tournament_id = ? AND team_1_id = ?
      `;
        const removeTeamQuery2 = `
        UPDATE matches
        SET team_2_id = NULL, team_2 = NULL
        WHERE match_tournament_id = ? AND team_2_id = ?
      `;

        db.query(removeTeamQuery1, [tournamentId, teamId], (err) => {
          if (err) {
            console.error("Error removing team_1:", err);
            return res.status(500).json({ error: "Database error" });
          }

          db.query(removeTeamQuery2, [tournamentId, teamId], (err) => {
            if (err) {
              console.error("Error removing team_2:", err);
              return res.status(500).json({ error: "Database error" });
            }

            const deleteEmptyMatchQuery = `
            DELETE FROM matches
            WHERE match_tournament_id = ? AND team_1_id IS NULL AND team_2_id IS NULL
          `;
            db.query(deleteEmptyMatchQuery, [tournamentId], (err) => {
              if (err) {
                console.error("Error deleting empty matches:", err);
                return res.status(500).json({ error: "Database error" });
              }

              res.status(200).json({ message: "Left tournament successfully" });
            });
          });
        });
      },
    );
  });
});

// Fetch matches for a specific tournament
app.get("/tournaments/:tournamentId/matches", (req, res) => {
  const { tournamentId } = req.params;

  const query = `
    SELECT 
      match_id AS id, 
      team_1_id, 
      team_1, 
      team_2_id, 
      team_2, 
      score_team_1 AS score1, 
      score_team_2 AS score2,
      winner_team_id,
      winner_team_name,  
      match_round AS round,    
      match_status
    FROM matches
    WHERE match_tournament_id = ?
    ORDER BY match_round ASC, match_id ASC
  `;

  db.query(query, [tournamentId], (err, results) => {
    if (err) {
      console.error("Error fetching matches:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

// Fetch the match count of a tournament
app.get("/tournaments/:tournamentId/matches/count", (req, res) => {
  const { tournamentId } = req.params;
  const query = `
    SELECT COUNT(*) AS count
    FROM matches
    WHERE match_tournament_id = ?
  `;
  db.query(query, [tournamentId], (err, results) => {
    if (err) {
      console.error("Error checking match count:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results[0]);
  });
});

// Update match scores and determine winners
app.put("/matches/:matchId/scores", (req, res) => {
  const { matchId } = req.params;
  const { score_team_1, score_team_2, userId } = req.body;

  // Check if the user is the tournament creator
  const checkTournamentCreatorQuery = `
    SELECT t.user_created_id, t.tournament_id, m.match_round
    FROM matches m
    JOIN tournament t ON m.match_tournament_id = t.tournament_id
    WHERE m.match_id = ? AND t.user_created_id = ?
  `;
  db.query(checkTournamentCreatorQuery, [matchId, userId], (err, result) => {
    if (err) {
      console.error("Error checking tournament creator:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res
        .status(403)
        .json({ error: "User is not the tournament creator" });
    }

    const tournamentId = result[0].tournament_id;
    const matchRound = result[0].match_round;

    // Check if both semi-finals are already completed
    const checkSemiFinalsQuery = `
      SELECT COUNT(*) AS completedCount
      FROM matches
      WHERE match_tournament_id = ? AND match_round = 1 AND match_status = 'Completed'
    `;
    db.query(checkSemiFinalsQuery, [tournamentId], (err, semiFinalResult) => {
      if (err) {
        console.error("Error checking semi-finals:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const completedSemiFinals = semiFinalResult[0].completedCount;

      // Disallow editing semi-finals if both are completed
      if (matchRound === 1 && completedSemiFinals === 2) {
        return res
          .status(400)
          .json({ error: "Cannot edit semi-final matches after completion." });
      }

      // Update the match scores
      const updateScoresQuery = `
        UPDATE matches
        SET 
          score_team_1 = ?, 
          score_team_2 = ?, 
          match_status = 'Completed',
          winner_team_id = IF(score_team_1 > score_team_2, team_1_id, team_2_id),
          winner_team_name = IF(score_team_1 > score_team_2, team_1, team_2)
        WHERE match_id = ?
      `;
      db.query(
        updateScoresQuery,
        [score_team_1, score_team_2, matchId],
        (err) => {
          if (err) {
            console.error("Error updating match scores:", err);
            return res.status(500).json({ error: "Database error" });
          }

          // Proceed to check if the final match should be created
          const checkFinalExistsQuery = `
          SELECT COUNT(*) AS finalCount
          FROM matches
          WHERE match_tournament_id = ? AND match_round = 2
        `;
          db.query(
            checkFinalExistsQuery,
            [tournamentId],
            (err, finalCountResult) => {
              if (err) {
                console.error("Error checking final match existence:", err);
                return res.status(500).json({ error: "Database error" });
              }

              if (finalCountResult[0].finalCount > 0) {
                return res.json({ message: "Match scores updated" }); // Skip creating a second final match
              }

              // If both semi-finals are completed, create the final match
              const checkSemiFinalsQuery = `
            SELECT match_id, winner_team_id, winner_team_name
            FROM matches
            WHERE match_tournament_id = ? AND match_round = 1 AND match_status = 'Completed'
            ORDER BY match_id ASC
          `;
              db.query(
                checkSemiFinalsQuery,
                [tournamentId],
                (err, semiFinalsResult) => {
                  if (err) {
                    console.error("Error fetching semi-finals:", err);
                    return res.status(500).json({ error: "Database error" });
                  }

                  if (semiFinalsResult.length === 2) {
                    const insertFinalMatchQuery = `
                INSERT INTO matches (team_1_id, team_1, team_2_id, team_2, match_tournament_id, match_round, match_status)
                VALUES (?, ?, ?, ?, ?, 2, 'Scheduled')
              `;
                    db.query(
                      insertFinalMatchQuery,
                      [
                        semiFinalsResult[0].winner_team_id,
                        semiFinalsResult[0].winner_team_name,
                        semiFinalsResult[1].winner_team_id,
                        semiFinalsResult[1].winner_team_name,
                        tournamentId,
                      ],
                      (err) => {
                        if (err) {
                          console.error("Error inserting final match:", err);
                          return res
                            .status(500)
                            .json({ error: "Database error" });
                        }

                        //Check the tournament status and update it
                        checkAndUpdateTournamentStatus(tournamentId);
                      },
                    );
                  } else {
                    return res.json({ message: "Match scores updated" });
                  }
                },
              );
            },
          );
        },
      );
    });
  });
});

// Check the tournament status and update it
const checkAndUpdateTournamentStatus = (tournamentId) => {
  const checkMatchesQuery = `
    SELECT COUNT(*) AS incomplete_matches
    FROM matches
    WHERE match_tournament_id = ? AND match_status != 'Completed'
  `;

  db.query(checkMatchesQuery, [tournamentId], (err, results) => {
    if (err) {
      console.error("Error checking match statuses:", err);
      return;
    }

    if (results[0].incomplete_matches === 0) {
      const updateTournamentStatusQuery = `
        UPDATE tournament
        SET tournament_status = 'Completed'
        WHERE tournament_id = ?
      `;

      db.query(updateTournamentStatusQuery, [tournamentId], (err) => {
        if (err) {
          console.error("Error updating tournament status:", err);
        } else {
          console.log(
            `Tournament ${tournamentId} status updated to 'Completed'`,
          );
        }
      });
    }
  });
};

//Admin
// Admin Login Route
app.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE admin_email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0)
        return res.status(401).json({ message: "Admin not found" });

      const admin = result[0];

      if (password !== admin.admin_password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const accessToken = jwt.sign({ id: admin.admin_id }, jwtSecret, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ id: admin.admin_id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.json({
        message: "Admin login successful",
        accessToken,
        refreshToken,
        admin_name: admin.admin_name,
      });
    },
  );
});

// Approve a tournament
app.put("/tournaments/:tournamentId/approve", (req, res) => {
  const { tournamentId } = req.params;

  const query =
    'UPDATE tournament SET tournament_status = "Approved" WHERE tournament_id = ?';
  db.query(query, [tournamentId], (err, result) => {
    if (err) {
      console.error("Error approving tournament:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.json({ message: "Tournament approved successfully" });
  });
});

// Deny a tournament approval
app.put("/tournaments/:tournamentId/deny", (req, res) => {
  const { tournamentId } = req.params;

  const query =
    'UPDATE tournament SET tournament_status = "Denied" WHERE tournament_id = ?';
  db.query(query, [tournamentId], (err, result) => {
    if (err) {
      console.error("Error denying tournament:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tournament not found" });
    }

    res.json({ message: "Tournament denied successfully" });
  });
});

//Starting Express server on port 8081
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}...`);
});
