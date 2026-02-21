import express from "express";
import { db } from "./database.js";

const router = express.Router();

// Team related stuff
// Fetch all teams
router.get("/", (req, res) => {
  const query = "SELECT * FROM team";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving teams" });
    res.json(result); // Send venues as JSON
  });
});

// Create a new team
router.post("/", (req, res) => {
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

// Fetch team details by user ID
router.get("/:teamId", (req, res) => {
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

// Update team information
router.put("/:teamId", (req, res) => {
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

// Add a new member to a team
router.post("/:teamId/members", (req, res) => {
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
router.get("/:teamId/members", (req, res) => {
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
router.post("/:teamId/leave", (req, res) => {
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

// Team captain deletes a team
router.delete("/:teamId/delete", (req, res) => {
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

export default router;
