import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserHeader from "../../Components/UserHeaderComponent/UserHeader";
import UserTeamDropdownMenu from '../../Components/UserTeamDropdownMenuComponent/UserTeamDropdownMenu';
import './UserTeamSchedule.css';

function UserTeamSchedule() {
  const [teamData, setTeamData] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [isCaptain, setIsCaptain] = useState(null);
  const { teamId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const itemsPerPage = 4;

  useEffect(() => {    
    const fetchTeamData = async () => {
      try {
        const teamResponse = await fetch(`http://localhost:8081/teams/${teamId}`);
        if (!teamResponse.ok) {
          throw new Error('Failed to fetch team details');
        }
        const teamDetails = await teamResponse.json();
        setTeamData(teamDetails);

        const userResponse = await fetch(`http://localhost:8081/user/${userId}/team`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user team status');
        }
        const userData = await userResponse.json();
        setIsCaptain(userData.isCaptain);
      } catch (error) {
        console.error('Error fetching team data:', error);
        navigate('/userteam');
      }
    };

    if (teamId) {
      fetchTeamData();
      fetchMatches();
    }    
  }, [teamId, userId, navigate]);

  const fetchMatches = async () => {
    try {
      const upcomingResponse = await fetch(`http://localhost:8081/matches/upcoming/${teamId}`);
      if (!upcomingResponse.ok) throw new Error('Failed to fetch upcoming matches');
      const upcomingData = await upcomingResponse.json();
      setUpcomingMatches(upcomingData);
  
      const completedResponse = await fetch(`http://localhost:8081/matches/completed/${teamId}`);
      if (!completedResponse.ok) throw new Error('Failed to fetch completed matches');
      const completedData = await completedResponse.json();
      setCompletedMatches(completedData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };
  
  const handleDropdownAction = (action) => {
    switch (action) {
      case 'update-team':
        navigate(`/userupdateteam/${teamId}`);
        break;
      case 'team-schedule':
        navigate(`/userteamschedule/${teamId}`);
        break;
      case 'view-members':
        navigate(`/userviewmembers/${teamId}`);
        break;
      case 'team-profile':
        navigate(`/userteamprofile/${teamId}`);
        break;
      default:
        console.log('No action selected');
    }
  };

  const getPaginatedMatches = (matches, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return matches.slice(startIndex, endIndex);
  };

  const handlePageChange = (direction, tab) => {
    if (tab === 'upcoming') {
      if (direction === 'next') {
        setUpcomingPage(prev => prev + 1);
      } else if (direction === 'prev') {
        setUpcomingPage(prev => Math.max(prev - 1, 1));
      }
    } else if (tab === 'completed') {
      if (direction === 'next') {
        setCompletedPage(prev => prev + 1);
      } else if (direction === 'prev') {
        setCompletedPage(prev => Math.max(prev - 1, 1));
      }
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (!teamData || isCaptain === null) return <div>Loading...</div>;

  return (
    <div className="user-team-schedule-page">
      <UserHeader />
      <h1 className="user-team-schedule-title">Team Schedule</h1>
      <main className="user-team-schedule-content">
        <div className="user-team-schedule-header">
          <div className="user-team-schedule-dropdown-container">
            <UserTeamDropdownMenu
              teamId={teamId}
              isTeamCaptain={isCaptain}
              isTeamProfilePage={false}
              onAction={handleDropdownAction}
            />
          </div>
        </div>

        <div className="schedule-tabs">
          <button
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming matches
          </button>
          <button
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed matches
          </button>
        </div>

        <div className="matches-container">
          {activeTab === 'upcoming' ? (
            upcomingMatches.length > 0 ? (
              getPaginatedMatches(upcomingMatches, upcomingPage).map(match => (
                <div key={match.id} className="match-card">
                  <div className="match-date">{formatDate(match.tournament_date)}</div>
                  <div className="match-team">{match.team_1}</div>
                  <div className="match-details">vs</div>
                  <div className="match-team">{match.team_2}</div>
                </div>
              ))
            ) : (
              <div className="no-team-matches-message">No upcoming matches found</div>
            )
          ) : (
            completedMatches.length > 0 ? (
              getPaginatedMatches(completedMatches, completedPage).map(match => (
                <div key={match.id} className="match-card completed">
                  <div className="match-date">{formatDate(match.tournament_date)}</div>
                  <div className="match-team">{match.team_1}</div>
                  <div className="match-details">
                    <div className="match-score">
                      <span className={match.score_team_1 > match.score_team_2 ? 'winner' : ''}>{match.score_team_1}</span>
                      {' - '}
                      <span className={match.score_team_2 > match.score_team_1 ? 'winner' : ''}>{match.score_team_2}</span>
                    </div>
                  </div>
                  <div className="match-team">{match.team_2}</div>
                </div>
              ))
            ) : (
              <div className="no-team-matches-message">No completed matches found</div>
            )
          )}
        </div>
        <div className="team-pagination-container">
          <button
            className="team-pagination-button"
            onClick={() => handlePageChange('prev', activeTab)}
            disabled={activeTab === 'upcoming' ? upcomingPage === 1 : completedPage === 1}
          >
            Previous
          </button>
          <button
            className="team-pagination-button"
            onClick={() => handlePageChange('next', activeTab)}
            disabled={activeTab === 'upcoming'
              ? upcomingPage * itemsPerPage >= upcomingMatches.length
              : completedPage * itemsPerPage >= completedMatches.length
            }            
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default UserTeamSchedule;