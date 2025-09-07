import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "../../Components/UserHeaderComponent/UserHeader";
import TournamentBracket from "../../Components/TournamentBracketComponent/TournamentBracket";
import "./UserTournamentDetails.css";

function UserTournamentDetails() {
  const { tournamentId } = useParams();
  const [tournamentData, setTournamentData] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isInTeam, setIsInTeam] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isMatchCompleted, setIsMatchCompleted] = useState(false);
  const userId = localStorage.getItem('userId');

  // Date format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


  useEffect(() => {
    const fetchTournamentAndMatchData = async () => {
      try {
        // Fetch Tournament Data
        const tournamentResponse = await fetch(
          `http://localhost:8081/tournaments/${tournamentId}`
        );
        if (!tournamentResponse.ok) {
          throw new Error("Failed to fetch tournament data");
        }
        const tournament = await tournamentResponse.json();
        setTournamentData(tournament);
  
        // Fetch Venue Data
        const venueResponse = await fetch(
          `http://localhost:8081/uservenue/${tournament.tournament_venue_id}`
        );
        if (!venueResponse.ok) {
          throw new Error("Failed to fetch venue data");
        }
        const venue = await venueResponse.json();
        setVenueData(venue);
  
        // Check if user is in a team
        const userResponse = await fetch(`http://localhost:8081/user/${userId}/team`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user team status");
        }
        const userData = await userResponse.json();
        setIsInTeam(userData.team !== null);
  
        // Check if team has joined the tournament
        if (userData.team) {
          const checkTeamJoinedResponse = await fetch(
            `http://localhost:8081/tournaments/${tournamentId}/team/${userData.team.team_id}`
          );
          if (!checkTeamJoinedResponse.ok) {
            throw new Error("Failed to check if team has joined");
          }
          const teamJoinedData = await checkTeamJoinedResponse.json();
          setHasJoined(teamJoinedData.hasJoined);
        }
  
        // Fetch Matches Data and Check Match Completion & Finals Status
        const matchResponse = await fetch(
          `http://localhost:8081/tournaments/${tournamentId}/matches`
        );
        if (!matchResponse.ok) {
          throw new Error("Failed to fetch matches data");
        }
        const matches = await matchResponse.json();
  
        // Check if any match is completed
        const isCompleted = matches.some(
          (match) =>
            match.match_status === "Completed" &&
            (match.team_1_id === userId || match.team_2_id === userId)
        );
  
        // Check if team is in the finals
        const isFinals = matches.some(
          (match) =>
            match.match_round === "Final" &&
            (match.team_1_id === userId || match.team_2_id === userId)
        );
  
        setIsMatchCompleted(isCompleted || isFinals); // Update state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchTournamentAndMatchData();
  }, [tournamentId, userId]);
  
  
  const handleJoinTournament = async () => {
    try {
      // Fetch the current count of teams
      const teamCountResponse = await fetch(`http://localhost:8081/tournaments/${tournamentId}/teams/count`);
      const teamCountData = await teamCountResponse.json();
  
      const teamLimit = 4; // Or dynamically adjust this if needed
  
      if (teamCountData.count >= teamLimit) {
        alert(`Cannot join this tournament. Maximum number of teams (${teamLimit}) reached.`);
        return;
      }
  
      // Proceed with joining the tournament
      const response = await fetch(`http://localhost:8081/tournaments/${tournamentId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
  
      if (response.ok) {
        alert('Joined tournament successfully');
        setShowJoinDialog(false);
        setHasJoined(true);
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to join tournament');
      }
    } catch (error) {
      console.error('Error joining tournament:', error);
      alert('Error joining tournament');
    }
  };
  

  const handleLeaveTournament = async () => {
    try {
      const response = await fetch(`http://localhost:8081/tournaments/${tournamentId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('Left tournament successfully');
        setShowLeaveDialog(false);
        setHasJoined(false);
        // Refresh tournament data
        const updatedTournament = await fetch(`http://localhost:8081/tournaments/${tournamentId}`).then(res => res.json());
        setTournamentData(updatedTournament);
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to leave tournament');
      }
    } catch (error) {
      console.error('Error leaving tournament:', error);
      alert('Error leaving tournament');
    }
  };

  if (!tournamentData || !venueData) return <div>Loading...</div>;

  const isCreator = userId === String(tournamentData.user_created_id);

  return (
    <div className="user-tournament-details-page">
      <UserHeader />
      <main className="user-tournament-details-content">
        <h1 className="user-tournament-title">{tournamentData.tournament_title}</h1>
        <div className="user-tournament-details-layout">
          <div className="user-tournament-info">
          <p><strong>Description:</strong> {tournamentData.tournament_description}</p>
          <p><strong>Starting Date:</strong> {formatDate(tournamentData.tournament_date)}</p>
          <p><strong>Starting Time:</strong> {tournamentData.tournament_time}</p>
          <p><strong>Gender:</strong> {tournamentData.players_gender}</p>
          <p><strong>Created by:</strong> {tournamentData.user_created_name}</p>
            <div className="user-tournament-note">
              Note: Tournaments are currently in single elimination format
              with only 4 teams and only 5-a-side teams are allowed to join. Only players in teams can join.
            </div>
            <div className="tournament-actions">
              {isInTeam && !hasJoined && (
                <button
                  className="join-tournament-button"
                  onClick={() => setShowJoinDialog(true)}>
                  Join Tournament
                </button>
              )}
              {isInTeam && hasJoined && !isMatchCompleted && (
                <button
                  className="leave-tournament-button"
                  onClick={() => setShowLeaveDialog(true)}>
                  Leave Tournament
                </button>
              )}
              {isInTeam && hasJoined && isMatchCompleted && (
                <button className="leave-tournament-button" disabled>
                  Cannot Leave (Match Completed or Finals)
                </button>
              )}
            </div>
          </div>

          <div className="user-tournament-venue">
            <div className="user-tournament-venue-image">
              <img
                src={venueData.venue_image || 'https://placehold.co/350x300'}
                alt={venueData.venue_name}
                className="user-tournament-venue-img"
              />
            </div>
            <h2 className="user-tournament-venue-name">{venueData.venue_name}</h2>
            <p className="user-tournament-venue-address">{venueData.venue_address}</p>
          </div>
        </div>

        <div className="user-tournament-bracket">
          <h2>Tournament Bracket</h2>
          <TournamentBracket tournamentId={tournamentId} isCreator={isCreator} />
        </div>

        {showJoinDialog && (
          <div className="tournament-dialog-overlay">
            <div className="tournament-dialog">
              <h3>Join Tournament</h3>
              <p>Are you sure you want to join this tournament?</p>
              <div className="tournament-dialog-buttons">
                <button onClick={handleJoinTournament}>Yes</button>
                <button onClick={() => setShowJoinDialog(false)}>No</button>
              </div>
            </div>
          </div>
        )}

        {showLeaveDialog && (
          <div className="tournament-dialog-overlay">
            <div className="tournament-dialog">
              <h3>Leave Tournament</h3>
              <p>Are you sure you want to leave this tournament?</p>
              <div className="tournament-dialog-buttons">
                <button onClick={handleLeaveTournament}>Yes</button>
                <button onClick={() => setShowLeaveDialog(false)}>No</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserTournamentDetails;