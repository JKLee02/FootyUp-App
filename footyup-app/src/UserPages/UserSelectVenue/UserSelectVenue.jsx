import React, { useEffect, useState } from 'react';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import UserBoxContainers from '../../Components/UserBoxContainers/UserBoxContainers';
import './UserSelectVenue.css';

function UserSelectVenue() {
  const [venues, setVenues] = useState([]); // State to store fetched venue data
  const [error, setError] = useState(null);

  // Fetch venues on component mount
  useEffect(() => {
    fetch('http://localhost:8081/uservenue')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch venues');
        return response.json();
      })
      .then((data) => setVenues(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (venues.length === 0) return <div>Loading...</div>;

  return (
    <div className="user-select-venue-page">
      <UserHeader />
      <main className="user-select-venue-main">
        <h1 className="select-venue-title">Select a Venue</h1>
        {/* Pass fetched venue data to UserBoxContainers */}
        <UserBoxContainers
          containers={venues.map((venue) => ({
            id: venue.venue_id,
            name: venue.venue_name,
            image: venue.venue_image,
          }))}
          searchable={true}
          linkPrefix="userhosttournament"
        />
      </main>
    </div>
  );
}

export default UserSelectVenue;
