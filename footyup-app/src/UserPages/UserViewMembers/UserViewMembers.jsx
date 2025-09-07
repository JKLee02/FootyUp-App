import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserHeader from "../../Components/UserHeaderComponent/UserHeader";
import UserBoxContainers from "../../Components/UserBoxContainers/UserBoxContainers";
import UserTeamDropdownMenu from "../../Components/UserTeamDropdownMenuComponent/UserTeamDropdownMenu";
import "./UserViewMembers.css";

function UserViewMembers() {
  const [dropdownAction, setDropdownAction] = useState(""); // Track dropdown selection
  const [teamData, setTeamData] = useState(null);
  const [members, setMembers] = useState([]);
  const [isCaptain, setIsCaptain] = useState(false); // State to store if user is captain
  const { teamId } = useParams(); // Get the team ID from the URL
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Get current user ID

  useEffect(() => {
    const fetchTeamData = async () => {
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
        // Fetch team details
        const teamResponse = await fetch(`http://localhost:8081/teams/${teamId}`);
        if (!teamResponse.ok) {
          throw new Error('Failed to fetch team details');
        }
        const teamDetails = await teamResponse.json();
        setTeamData(teamDetails);

        // Fetch the current user's team status to check if they are the captain
        const userResponse = await fetch(`http://localhost:8081/user/${userId}/team`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user team status');
        }
        const userData = await userResponse.json();
        setIsCaptain(userData.isCaptain);

        // Fetch team members
        const membersResponse = await fetch(`http://localhost:8081/teams/${teamId}/members`, {
          method: 'GET', // Explicitly using GET method
        });
        if (!membersResponse.ok) {
          throw new Error('Failed to fetch team members');
        }
        const membersList = await membersResponse.json();

        // Map members to container format
        const mappedMembers = membersList.map(member => ({
          id: member.id,
          name: member.name,
        }));
        setMembers(mappedMembers);
      } catch (error) {
        console.error('Error:', error);
        navigate('/userteam'); // Redirect if an error occurs
      }
    };

    if (teamId) fetchTeamData();
  }, [teamId, navigate]);

  const handleDropdownAction = (action) => {
    setDropdownAction(action);
    switch (action) {
      case "team-profile":
        navigate(`/userteamprofile/${teamId}`);
        break;
      case "update-team":
        navigate(`/userupdateteam/${teamId}`);
        break;
      case "view-members":
        navigate(`/userviewmembers/${teamId}`);
        break;
      case "team-schedule":
        navigate(`/userteamschedule/${teamId}`);
        break;
      default:
        console.log("No valid action selected");
    }
  };

  if (!teamData) return <div>Loading...</div>;

  const container = members.map(member => ({
    id: member.id,
    name: member.name,
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" || "https://placehold.co/400x400" 
  }));

  return (
    <div className="user-view-members-page">
      <UserHeader />
      <h1 className="user-view-members-title">Team Members</h1>
      <main className="user-view-members-content">
        <div className="user-view-members-header">
          <div className="user-view-members-dropdown-container">
            <UserTeamDropdownMenu
              teamId={teamId}
              isTeamCaptain={isCaptain}
              isTeamProfilePage={false}
              onAction={handleDropdownAction}
            />
          </div>
        </div>
        <div className="user-view-members-main">
          <UserBoxContainers containers={container} searchable={true} isClickable={false} />
        </div>
      </main>
    </div>
  );
}

export default UserViewMembers;