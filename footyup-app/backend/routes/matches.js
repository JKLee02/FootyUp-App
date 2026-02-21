import express from "express";
import { db } from "./database.js";

const router = express.Router();

// Fetch all matches details
router.get("/", (req, res) => {
  const query = "SELECT * FROM matches";
  db.query(query, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error retrieving matches" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch all completed matches details
router.get("/completed", (req, res) => {
  const query = 'SELECT * FROM matches WHERE match_status = "Completed"';
  db.query(query, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error retrieving completed matches" });
    res.json(result); // Send venues as JSON
  });
});

// Fetch upcoming matches for a team with tournament date and time
router.get("/upcoming/:teamId", (req, res) => {
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
router.get("/completed/:teamId", (req, res) => {
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

// Update match scores and determine winners
router.put("/:matchId/scores", (req, res) => {
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

export default router;
