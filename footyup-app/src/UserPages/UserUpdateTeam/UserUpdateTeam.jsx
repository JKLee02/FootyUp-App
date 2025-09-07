import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import './UserUpdateTeam.css';

function UserUpdateTeam() {
  const [teamImage, setTeamImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isCaptain, setIsCaptain] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const { teamId } = useParams();
  const navigate = useNavigate();

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

        setFormData({
          name: teamDetails.name,
          description: teamDetails.description
        });
        setTeamImage(teamDetails.image);
      } catch (error) {
        console.error('Error:', error);
        navigate('/userteam');
      }
    };

    if (teamId) fetchTeamData();
  }, [teamId, navigate]);

  const handleImageURLChange = (e) => {
    setTeamImage(e.target.value); // Update the team image URL state
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:8081/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          teamImage: teamImage,
          userId: userId
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Team updated successfully');
        navigate(`/userteamprofile/${teamId}`);
      } else {
        alert('Failed to update team.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating team');
    }
  };

  if (!teamData) return <div>Loading...</div>;

  return (
    <div className="user-update-team-page">
      <UserHeader />
      <h1 className="user-update-team-title">Update Team</h1>

      <main className="user-update-team-main">
        <form className="user-update-team-form" onSubmit={handleSubmit}>
          <div className="image-upload-section">
            <div className="image-upload-container">
              {/* Show preview image or fallback to default */}
              <img 
                src={teamImage || '../../default-team-logo.png'} 
                alt="Team logo preview" 
                className="team-image-preview"
              />
            </div>

            <input
              type="url"
              id="team-image-url"
              value={teamImage}
              onChange={handleImageURLChange}
              placeholder="Enter image URL (Optional)"
              className="image-url-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="team-name">Team Name:</label>
            <input
              type="text"
              id="team-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={!isCaptain}
            />
          </div>

          <div className="form-group">
            <label htmlFor="team-description">Description (Optional): </label>
            <textarea
              id="team-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              disabled={!isCaptain}
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="user-team-update-button" disabled={!isCaptain}>
              Update Team
            </button>
            <button type="button" className="user-team-cancel-button" onClick={() => navigate(`/userteamprofile/${teamId}`)}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default UserUpdateTeam;