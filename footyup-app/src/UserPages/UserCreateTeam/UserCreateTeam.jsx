import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import './UserCreateTeam.css';

function UserCreateTeam() {
  const [teamImage, setTeamImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const navigate = useNavigate(); 

  const DEFAULT_IMAGE = '../../default-team-logo.png'; // Path to the generic logo

  // Handle changes in text input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image URL input change
  const handleImageURLChange = (e) => {
    setTeamImage(e.target.value); // Update the team image URL state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:8081/user/${userId}/team`);
    const data = await response.json();
  
    if (data.team) {
      alert('You are already in a team.');
      navigate(`/userteamprofile/${data.team.team_id}`);
      return;
    }
  
    try {
      const createResponse = await fetch('http://localhost:8081/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          teamImage: teamImage,
          captainId: userId,
          captainName: localStorage.getItem('user_firstname'),
        }),
      });
  
      const result = await createResponse.json();
      if (createResponse.ok) {
        navigate(`/userteamprofile/${result.teamId}`);
      } else {
        alert('Failed to create team.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating team');
    }
  };
  
  return (
    <div className="user-create-team-page">
      <UserHeader />
      <h1 className="user-create-team-title">Create Team</h1>

      <main className="user-create-team-main"> 
        <form className="user-create-team-form" onSubmit={handleSubmit}>
          <div className="image-upload-section">
            <div className="image-upload-container">
              {/* Show preview image or fallback to default */}
              <img 
                src={teamImage || DEFAULT_IMAGE} 
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
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="user-team-create-button">
              Create Team
            </button>
            <button type="button" className="user-team-cancel-button" onClick={() => navigate('/userteam')}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default UserCreateTeam;
