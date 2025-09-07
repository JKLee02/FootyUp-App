import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import './UserHostTournament.css';

export default function UserHostTournament() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    gender: '',
  });

  const [venueData, setVenueData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    fetch(`http://localhost:8081/uservenue/${venueId}`)
      .then((response) => response.json())
      .then((data) => setVenueData(data))
      .catch((error) => {
        console.error('Error fetching venue data:', error);
        setError('Failed to fetch venue details');
      });
  }, [venueId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:8081/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          venueId: venueData.venue_id,
          userId: userId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Tournament created successfully');
        navigate(`/usertournaments`);
      } else {
        alert(result.error || 'Failed to create tournament');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Error creating tournament');
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!venueData) return <div>Loading...</div>;

  return (
    <div className="user-host-tournament-page">
      <UserHeader />
      <h1 className="user-host-page-title">Host a Tournament</h1>
      <main className="user-host-tournament-content">
        <div className="user-host-tournament-form-container">
          <form className="user-host-tournament-form" onSubmit={handleSubmit}>
            <div className="user-host-form-left">
              <div className="user-host-form-group">
                <label htmlFor="title">Tournament Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="user-host-form-input"
                />
              </div>

              <div className="user-host-form-group">
                <label htmlFor="description">Description (Optional):</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="user-host-form-textarea"
                />
              </div>

              <div className="user-host-datetime-inputs">
                <div className="user-host-form-group">
                  <label htmlFor="date">Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="user-host-form-input"
                  />
                </div>

                <div className="user-host-form-group">
                  <label htmlFor="time">Time:</label>
                  <input
                    type="time"
                    id="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="user-host-form-input"
                  />
                </div>
              </div>

              <div className="user-host-form-group">
                <label>Gender:</label>
                <div className="user-host-radio-group">
                  {['Mixed', 'Female', 'Male'].map((gender) => (
                    <label key={gender} className="user-host-radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleInputChange}
                        required
                      />
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="user-host-form-note">
                Note: Tournaments are currently in a single elimination format with only 4 teams and only 5-a-side teams are allowed to join.
                In addition, the tournament will only be displayed in the tournaments page after its approval from the admin.
              </div>

              <div className="user-host-form-buttons">
                <button type="submit" className="user-host-create-button">
                  Create Tournament
                </button>
                <button type="button" className="user-host-cancel-button" onClick={() => navigate('/usertournaments')}>
                  Cancel
                </button>
              </div>
            </div>

            <div className="user-host-form-right">
              <div className="user-host-venue-image">
                <img src={venueData.venue_image} alt="Venue" />
              </div>
              <h2 className="user-host-venue-name">{venueData.venue_name}</h2>
              <p className="user-host-venue-address">{venueData.venue_address}</p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}