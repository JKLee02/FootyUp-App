import express from "express";
import { db } from "./database.js";

const router = express.Router();

// Fetch all tournaments details
router.get("/", (req, res) => {
  const query = "SELECT * FROM tournament";
  db.query(query, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error retrieving tournaments" });
    res.json(result); // Send venues as JSON
  });
});

// Create a new tournament
router.post("/", (req, res) => {
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
          console.log("Tournament INSERT result:", {
            err,
            insertId: result?.insertId,
          }); // DEBUG
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

// Fetch only pending approval tournaments (for admin)
router.get("/pendingapproval", (req, res) => {
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

// Fetch only all approved tournaments + filtering
router.get("/approved", (req, res) => {
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
router.get("/created/:userId", (req, res) => {
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
router.get("/:tournamentId", (req, res) => {
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
router.delete("/:tournamentId", (req, res) => {
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
router.put("/:tournamentId", (req, res) => {
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
router.post("/:tournamentId/join", (req, res) => {
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
router.get("/:tournamentId/teams/count", (req, res) => {
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
router.get("/:tournamentId/team/:teamId", (req, res) => {
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
router.post("/:tournamentId/leave", (req, res) => {
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
router.get("/:tournamentId/matches", (req, res) => {
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
router.get("/:tournamentId/matches/count", (req, res) => {
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

// Approve a tournament
router.put("/:tournamentId/approve", (req, res) => {
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
router.put("/:tournamentId/deny", (req, res) => {
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

export default router;
