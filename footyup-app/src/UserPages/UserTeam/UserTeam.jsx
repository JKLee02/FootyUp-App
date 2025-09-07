import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import UserBoxContainers from '../../Components/UserBoxContainers/UserBoxContainers';
import './UserTeam.css';

function UserTeam() {
  const [teams, setTeams] = useState([]); // Store all teams
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

// Update useEffect to handle errors better
useEffect(() => {
  const checkUserTeam = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/user/${userId}/team`);
      if (!response.ok) throw new Error('Failed to fetch user team');
      
      const data = await response.json();
      
      if (data.team) {
        navigate(`/userteamprofile/${data.team.team_id}`);
        return;
      }

      const teamsResponse = await fetch('http://localhost:8081/teams');
      if (!teamsResponse.ok) throw new Error('Failed to fetch teams');
      
      const teamsData = await teamsResponse.json();
      setTeams(teamsData.filter(team => team.team_id)); // Filter out null/undefined teams
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  checkUserTeam();
}, [navigate]);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-team-page">
      <UserHeader />
      <main className="user-team-main">
        <div className="team-header">
          <h1 className="team-title">Teams</h1>
          <button className="create-team-button">
            <Link to="/usercreateteam">Create a Team</Link>
          </button>
        </div>
        <UserBoxContainers
          containers={teams.map((team) => ({
            id: team.team_id,
            name: team.team_name,
            image: team.team_image,
          }))}
          searchable={true}
          linkPrefix="userteamprofile"
        />
      </main>
    </div>
  );
}

export default UserTeam;
