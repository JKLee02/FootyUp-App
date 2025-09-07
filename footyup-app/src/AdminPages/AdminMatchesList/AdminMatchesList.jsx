import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../Components/AdminHeaderComponent/AdminHeader';
import AdminReusableTable from '../../Components/AdminReusableTable/AdminReusableTable';
import './AdminMatchesList.css';

function AdminMatchesList() {
  const [matches, setMatches] = useState([]); // State to store the match data

  // Define columns for the table
  const columns = [
    { Header: 'Match ID', accessor: 'match_id' },
    { Header: 'Team Matchup', accessor: 'team_matchup' },
    { Header: 'Score', accessor: 'match_score' },
    { Header: 'Round', accessor: 'match_round' },
    { Header: 'Status', accessor: 'match_status' },
  ];

  // Fetch matches data from the backend
  useEffect(() => {
    axios.get('http://localhost:8081/matches') // Replace with your actual backend URL
      .then((response) => {
        setMatches(response.data); // Set the fetched data to the state
      })
      .catch((error) => {
        console.error('Error fetching matches data:', error);
      });
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Process the matches data
  const data = matches.map(match => ({
    match_id: match.match_id,
    team_matchup: `${match.team_1} vs ${match.team_2}`, // Assuming the match object has team_1 and team_2 properties
    match_score: `${match.score_team_1} - ${match.score_team_2}`,
    match_round: match.match_round,
    match_status: match.match_status,
  }));

  return (
    <div>
      <AdminHeader />
      <main className="admin-matches-page">
        <h1 className="admin-matches-title">Tournaments/Matches List</h1>
        <AdminReusableTable columns={columns} data={data} />
      </main>
    </div>
  );
}

export default AdminMatchesList;
