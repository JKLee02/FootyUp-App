import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserHeader from "../../Components/UserHeaderComponent/UserHeader";
import UserTeamDropdownMenu from '../../Components/UserTeamDropdownMenuComponent/UserTeamDropdownMenu';
import './UserTeamProfile.css';

function UserTeamProfile() {
  const [userRole, setUserRole] = useState(null);
  const [hasJoinedTeam, setHasJoinedTeam] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [dropdownAction, setDropdownAction] = useState("");
  const { teamId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamAndUserRole = async () => {
      if (!teamId) {
        console.error('No team ID provided');
        return;
      }
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No user ID found');
          navigate('/login');
          return;
        }

        const userResponse = await fetch(`http://localhost:8081/user/${userId}/team`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user team status');
        }
        
        const userData = await userResponse.json();
        
        const teamResponse = await fetch(`http://localhost:8081/teams/${teamId}`);
        if (!teamResponse.ok) {
          if (teamResponse.status === 404) {
            navigate('/userteam');
            return;
          }
          throw new Error('Failed to fetch team details');
        }

        const teamDetails = await teamResponse.json();
        
        setTeamData({
          ...teamDetails,
          currentUserIsCaptain: userData.isCaptain
        });
        setUserRole(userData.isCaptain ? 'captain' : 'member');
        setHasJoinedTeam(userData.team?.team_id === parseInt(teamId));

      } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('404')) {
          navigate('/userteam');
        }
      }
    };

    if (teamId) fetchTeamAndUserRole();
  }, [teamId, navigate]);

  const handleTeamAction = async (action) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    switch(action) {
      case 'delete-team':
      case 'leave-team':
        setDialog(action);
        break;
      default:
        break;
    }
  };

  const handleJoinTeam = async () => {
    setDialog('join-team');
  };

  const confirmJoinTeam = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8081/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userName: localStorage.getItem('user_firstname')
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasJoinedTeam(true);
        setTeamData(prevData => ({
          ...prevData,
          members: prevData.members + 1
        }));
        alert('You have successfully joined the team!');
      } else {
        alert(data.error || 'An error occurred while joining the team');
      }
    } catch (error) {
      console.error('Error joining team:', error);
      alert('There was an error joining the team.');
    } finally {
      closeDialog();
    }
  };

  const confirmLeaveTeam = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8081/teams/${teamId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasJoinedTeam(false);
        setTeamData(prevData => ({
          ...prevData,
          members: prevData.members - 1
        }));
        alert('You have successfully left the team!');
        navigate('/userteam');
      } else {
        alert(data.error || 'An error occurred while leaving the team');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      alert('There was an error leaving the team.');
    } finally {
      closeDialog();
    }
  };

  const confirmDeleteTeam = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }
  
      const response = await fetch(`http://localhost:8081/teams/${teamId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Team has been deleted successfully!');
        navigate('/userteam');
      } else {
        alert(data.error || 'An error occurred while deleting the team.');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('There was an error deleting the team.');
    } finally {
      closeDialog();
    }
  };

  const closeDialog = () => {
    setDropdownAction("");
    setDialog(null);
  };

  // Inside the dialog "No" button click handler (which cancels the dialog action)
  const handleDialogCancel = () => {
    closeDialog();  
  };

  const confirmAction = () => {
    if (dialog === 'delete-team') {
        confirmDeleteTeam(); 
    } else if (dialog === 'leave-team') {
        confirmLeaveTeam();
    } else if (dialog === 'join-team') {
        confirmJoinTeam();
    }
    closeDialog();
};

  if (!teamData) return <div>Loading...</div>;

  return (
    <div className="user-team-profile-page">
      <UserHeader />
      <h1 className="user-team-profile-title">Team Profile</h1>
      <div className="user-team-profile-content">
        {hasJoinedTeam && (
          <div className="user-team-profile-dropdown-container">
            <UserTeamDropdownMenu 
              teamId={teamId}
              isTeamCaptain={userRole === 'captain'}
              isTeamProfilePage={true}
              onAction={handleTeamAction}
            />
          </div>
        )}

        <main className="user-team-profile-main">
          <div className="user-team-profile-info-container">
            <div className="user-team-profile-placeholder-image">
              <img
                src={teamData.image}
                alt="Team logo"
                className="user-team-profile-image"
              />
            </div>
            <h2 className="user-team-profile-name">{teamData.name}</h2>
            <p className="user-team-profile-description">
              <strong>Description: </strong> {teamData.description}
            </p>
            <p className="user-team-profile-captain">
              <strong>Captain: </strong> {teamData.captain}
            </p>
            <p className="user-team-profile-members">
              <strong>Current No. of Members: </strong> {teamData.members}
            </p>
            {localStorage.getItem('userId') !== teamData.captain && !hasJoinedTeam && (
              <button className="join-team-button" onClick={handleJoinTeam}>
                Join Team
              </button>
            )}
          </div>
        </main>
      </div>

          {dialog && (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <p>
                    {dialog === 'delete-team' && 'Are you sure you want to delete this team?'}
                    {dialog === 'leave-team' && 'Are you sure you want to leave this team?'}
                    {dialog === 'join-team' && 'Do you want to join this team?'}
                </p>
                <div className="dialog-buttons">
                    <button onClick={confirmAction} className="dialog-confirm-btn">
                        Yes
                    </button>
                    <button onClick={handleDialogCancel} className="dialog-cancel-btn">
                        No
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default UserTeamProfile;