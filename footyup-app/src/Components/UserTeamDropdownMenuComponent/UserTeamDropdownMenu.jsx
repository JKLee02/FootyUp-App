import { useNavigate } from "react-router-dom";
import "./UserTeamDropdownMenu.css";

function UserTeamDropdownMenu({ teamId, isTeamCaptain, isTeamProfilePage, onAction }) {
  const navigate = useNavigate();

  const handleDropdownChange = (e) => {
    const action = e.target.value;
    if (!action) return;

    switch (action) {
      case "delete-team":
      case "leave-team":
        if (typeof onAction === 'function') {
          onAction(action);
        }
        break;
      case "update-team":
        navigate(`/userupdateteam/${teamId}`);
        break;
      case "team-schedule":
        navigate(`/userteamschedule/${teamId}`);
        break;
      case "view-members":
        navigate(`/userviewmembers/${teamId}`);
        break;
      case "team-profile":
        navigate(`/userteamprofile/${teamId}`);
        break;
      default:
        console.log("No action selected");
    }
  };

  return (
    <div className="dropdown-menu-container">
      <select
        className="dropdown-menu"
        onChange={handleDropdownChange}
        defaultValue=""
      >
        {isTeamCaptain ? (
          <>
            <option value="">Captain Actions</option>
            <option value="team-profile">Team Profile</option>
            <option value="update-team">Update Team Info</option>
            <option value="view-members">View Members List</option>
            <option value="team-schedule">Team Schedule</option>
            {isTeamProfilePage && <option value="delete-team">Delete Team</option>}
          </>
        ) : (
          <>
            <option value="">Member Actions</option>
            <option value="team-profile">Team Profile</option>
            <option value="view-members">View Members List</option>
            <option value="team-schedule">Team Schedule</option>
            {isTeamProfilePage && <option value="leave-team">Leave Team</option>}
          </>
        )}
      </select>
    </div>
  );
}

export default UserTeamDropdownMenu;