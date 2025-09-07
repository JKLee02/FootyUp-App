import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminHeader from '../../Components/AdminHeaderComponent/AdminHeader';
import './AdminHome.css';

function AdminHome() {
  // States for statistics and data
  const [stats, setStats] = useState({
    players: 0,
    teams: 0,
    matches: 0,
  });
  const [players, setPlayers] = useState([]); // State for players list
  const [teams, setTeams] = useState([]); // State for teams list
  const [pendingTournaments, setPendingTournaments] = useState([]); // State for pending tournaments
  const [completedMatches, setCompletedMatches] = useState([]); // State for completed matches

  // Fetch Players, Teams, Matches and Tournaments data
  useEffect(() => {
    // Fetch players data
    axios.get('http://localhost:8081/users') // Replace with your endpoint for players
      .then((response) => {
        setPlayers(response.data);
        setStats(prev => ({ ...prev, players: response.data.length })); // Update players count
      })
      .catch((error) => {
        console.error('Error fetching players:', error);
      });

    // Fetch teams data
    axios.get('http://localhost:8081/teams') // Replace with your endpoint for teams
      .then((response) => {
        setTeams(response.data);
        setStats(prev => ({ ...prev, teams: response.data.length })); // Update teams count
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });

    // Fetch pending approval tournaments
    axios.get('http://localhost:8081/tournaments/pendingapproval') // Replace with your backend endpoint
      .then((response) => {
        setPendingTournaments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching pending tournaments:', error);
      });

    // Fetch completed matches
    axios.get('http://localhost:8081/matches/completed')
      .then((response) => {
        setCompletedMatches(response.data); // Store completed matches data
        setStats(prev => ({ ...prev, matches: response.data.length })); // Update matches count
      })
      .catch((error) => {
        console.error('Error fetching completed matches:', error);
      });

  }, []); // Empty dependency array means this effect runs once on component load

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="dashboard-content">
        {/* Stats Widgets */}
        <div className="stats-widgets">
          <div className="stat-card">
            <h2>Current Players Amount</h2>
            <span className="stat-number">{stats.players}</span>
          </div>
          <div className="stat-card">
            <h2>Current Team Amount</h2>
            <span className="stat-number">{stats.teams}</span>
          </div>
          <div className="stat-card">
            <h2>Total Matches Played</h2>
            <span className="stat-number">{stats.matches}</span>
          </div>
        </div>

        {/* Main Widgets Grid */}
        <div className="main-widgets">
          {/* Players List Widget */}
          <div className="widget">
            <Link to="/adminplayerslist">
              <h2>Players List</h2>
            </Link>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Player ID</th>
                    <th>Player First Name</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {players.slice(0, 3).map(player => (
                    <tr key={player.user_id}>
                      <td>{player.user_id}</td>
                      <td>{player.user_firstname}</td>
                      <td>{player.user_gender || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teams List Widget */}
          <div className="widget">
            <Link to="/adminteamslist">
              <h2>Teams List</h2>
            </Link>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Captain</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.slice(0, 3).map(team => (
                    <tr key={team.team_id}>
                      <td>{team.team_name}</td>
                      <td>{team.members_amount || 'N/A'}</td>
                      <td>{team.team_captain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matches List Widget */}
          <div className="widget">
            <Link to="/adminmatcheslist">
              <h2>Matches List</h2>
            </Link>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Match ID</th>
                    <th>Teams</th>
                    <th>Final Score</th>
                  </tr>
                </thead>
                <tbody>
                  {completedMatches.slice(0, 3).map(match => (
                    <tr key={match.match_id}>
                      <td>{match.match_id}</td>
                      <td>{`${match.team_1} vs ${match.team_2}`}</td>
                      <td>{`${match.score_team_1} - ${match.score_team_2}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Match Approvals Widget */}
          <div className="widget">
            <Link to="/adminapproval">
              <h2>Tournaments to be approved</h2>
            </Link>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tournament ID</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTournaments.length > 0 ? (
                    pendingTournaments.slice(0, 3).map(tournament => (
                      <tr key={tournament.tournament_id}>
                        <td>{tournament.tournament_id}</td>
                        <td>{tournament.tournament_title}</td>
                        <td>{tournament.tournament_status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No pending tournaments</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
