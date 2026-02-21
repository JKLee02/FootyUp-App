import { useEffect, useState } from 'react';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import UserBoxContainers from '../../Components/UserBoxContainers/UserBoxContainers';
import './UserVenue.css';
import { useNavigate } from 'react-router-dom';

function UserVenue() {
  const [venues, setVenues] = useState([]); // State to store fetched venue data
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  
  // Fetch all venues on component mount
  useEffect(() => {
    fetch('http://localhost:8081/venue') // Adjust the URL to match your backend
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch venues');
        return response.json();
      })
      .then((data) => setVenues(data))
      .catch((err) => setError(err.message));

      const token = localStorage.getItem('token'); // Retrieve the stored token
      if (!token) {
        // Redirect to login if no token is found
        navigate('/login');
      }

  }, [navigate]);

  if (error) return <div>Error: {error}</div>;
  if (venues.length === 0) return <div>Loading...</div>;

  return (
    <div className="user-venue-page">
      <UserHeader />
      <main className="user-venue-main">
        <h1 className="venue-title">Venues</h1>
        <UserBoxContainers
          containers={venues.map((venue) => ({
            id: venue.venue_id,
            name: venue.venue_name,
            image: venue.venue_image,
          }))}
          searchable={true}
          linkPrefix="uservenuedetails" 
        />
      </main>
    </div>
  );
}

export default UserVenue;
