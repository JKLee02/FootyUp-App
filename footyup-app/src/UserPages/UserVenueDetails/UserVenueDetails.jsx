import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import './UserVenueDetails.css';

function UserVenueDetails() {
  const [venueData, setVenueData] = useState(null);
  const [error, setError] = useState(null);
  const { venueId } = useParams(); // Get venue ID from URL params
  const navigate = useNavigate();

  // Fetch venue details based on venueId
  useEffect(() => {
    fetch(`http://localhost:8081/uservenue/${venueId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Venue not found');
        return response.json();
      })
      .then((data) => setVenueData(data))
      .catch((err) => {
        setError(err.message);
        navigate('/uservenue'); // Redirect if error occurs
      });
  }, [venueId, navigate]);

  if (error) return <div>Error: {error}</div>;
  if (!venueData) return <div>Loading...</div>;

  return (
    <div className="user-venue-details-page">
      <UserHeader />
      <h1 className="user-venue-name">{venueData.venue_name}</h1>
      <div className="user-venue-details-container">
        <div className="user-venue-image-placeholder">
          <img
            src={venueData.venue_image}
            alt={venueData.venue_name}
            className="user-venue-image"
          />
        </div>
        <div className="user-venue-info">
          <p className="user-venue-address">
            <strong>Address: </strong> {venueData.venue_address}
          </p>
          <p className="user-venue-description">
            <strong>Description: </strong> {venueData.venue_description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserVenueDetails;
