import React, { useState, useEffect } from 'react';
import './TournamentBracket.css';

const TournamentBracket = ({ tournamentId, isCreator }) => {
  const [matches, setMatches] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);
  const [semiFinalsCompleted, setSemiFinalsCompleted] = useState(false);
  const [finalMatchExists, setFinalMatchExists] = useState(false); // New state for checking if the final exists

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`http://localhost:8081/tournaments/${tournamentId}/matches`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data = await response.json();

      const formattedMatches = data.map(match => ({
        id: match.id,
        team1: match.team_1 || 'TBD',
        team2: match.team_2 || 'TBD',
        score1: match.score1 !== null ? match.score1 : 0,
        score2: match.score2 !== null ? match.score2 : 0,
        winner: match.winner_team_name || 'TBD',
        round: match.round > 2 ? 2 : match.round,
        status: match.match_status,
      }));

      setMatches(formattedMatches);

      // Check if both semi-final matches are completed
      const semiFinals = formattedMatches.filter(match => match.round === 1);
      const semiFinalsCompleted = semiFinals.every(match => match.status === 'Completed');
      setSemiFinalsCompleted(semiFinalsCompleted);

      // Check if final match exists
      const finalMatch = formattedMatches.find(match => match.round === 2);
      setFinalMatchExists(!!finalMatch); // Set to true if final match exists, false otherwise
    } catch (error) {
      console.error('Error fetching matches:', error);
    }

    
  };

  const handleScoreChange = (matchId, team, score) => {
    // Ensure the score is not below 0
    const newScore = Math.max(0, parseInt(score, 10) || 0);
  
    setMatches(matches.map(match =>
      match.id === matchId ? { ...match, [`score${team}`]: newScore } : match
    ));
  };
  

  const handleSaveScores = async (matchId) => {
    const match = matches.find(m => m.id === matchId);
    try {
      const response = await fetch(`http://localhost:8081/matches/${matchId}/scores`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_team_1: match.score1,
          score_team_2: match.score2,
          userId: localStorage.getItem('userId')
        }),
      });

      if (!response.ok) throw new Error('Failed to save scores');
      alert('Scores saved successfully');
      setEditingMatch(null);

      // Refresh matches
      fetchMatches(); // <-- Refresh immediately after saving scores
    } catch (error) {
      console.error('Error saving scores:', error);
      alert('Failed to save scores. Please try again.');
    }
  };

  //Disabling edit button
  const isEditable = (match) => {
    // Disable edit if the match is a semi-final (round 1) and it's completed
    if (match.round === 1 && match.status === 'Completed') {
      return false;
    }
    
    // If the final match is scheduled, prevent editing any match after the semi-finals are completed
    if (finalMatchExists && match.round === 1 && semiFinalsCompleted) {
      return false;  // Disable all semi-finals after both are completed
    }
  
    // Allow editing if it's not a completed semi-final match
    return true;
  };
  

  const renderMatch = (match, label) => (
    <div
      key={match.id}
      className={`match round-${match.round} ${match.status === 'Completed' ? 'completed' : ''}`}
    >
      {label && <div className="match-label">{label}</div>}
      <div className="team">
        <span>{match.team1}</span>
        {isCreator && editingMatch === match.id ? (
          <input
            type="number"
            value={match.score1}
            onChange={(e) => handleScoreChange(match.id, 1, e.target.value)}
            disabled={!isEditable(match)}  // Disable based on editability logic
          />
        ) : (
          <span className="score">{match.score1}</span>
        )}
      </div>
      <div className="team">
        <span>{match.team2}</span>
        {isCreator && editingMatch === match.id ? (
          <input
            type="number"
            value={match.score2}
            onChange={(e) => handleScoreChange(match.id, 2, e.target.value)}
            disabled={!isEditable(match)}  // Disable based on editability logic
          />
        ) : (
          <span className="score">{match.score2}</span>
        )}
      </div>
  
      {match.status === 'Completed' && (
        <div className="winner">
          Winner: <strong>{match.winner}</strong>
        </div>
      )}
  
      {isCreator && match.team1 !== 'TBD' && match.team2 !== 'TBD' && (
        editingMatch === match.id ? (
          <button
            className="save-scores-btn"
            onClick={() => handleSaveScores(match.id)}
            disabled={!isEditable(match)}  // Disable based on editability logic
          >
            Save
          </button>
        ) : (
          <button
            className="edit-scores-btn"
            onClick={() => setEditingMatch(match.id)}
            disabled={!isEditable(match)}  // Disable based on editability logic
          >
            Edit Scores
          </button>
        )
      )}
    </div>
  );

  const renderRounds = () => {
    const rounds = [...new Set(matches.map(m => m.round))]; // Unique rounds

    return rounds.map(round => {
      const label = round === 1 ? 'Semi-Finals' : round === 2 ? 'Final' : `Round ${round}`; // Flexible round naming
      const filteredMatches = matches.filter(m => m.round === round);

      // Validate only 2 semi-finals and 1 final
      if ((round === 1 && filteredMatches.length > 2) || (round === 2 && filteredMatches.length > 1)) {
        return null; // Skip rendering if invalid
      }

      return (
        <div key={round} className={`round round-${round}`}>
          <h3 className="round-title">{label}</h3>
          {filteredMatches.map(match => renderMatch(match))}
        </div>
      );
    });
  };

  return (
    <div className="tournament-bracket">
      {renderRounds()}
    </div>
  );
};

export default TournamentBracket;
