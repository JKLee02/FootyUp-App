import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import UserBoxContainers from '../../Components/UserBoxContainers/UserBoxContainers';
import './UserTournaments.css';

function UserTournaments() {
  const [activeTab, setActiveTab] = useState('all');
  const [allTournaments, setAllTournaments] = useState([]);
  const [createdTournaments, setCreatedTournaments] = useState([]);
  const [gender, setGender] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [selectedGender, setSelectedGender] = useState(null);
  const [venues, setVenues] = useState([]); // For storing venue names

  const userId = localStorage.getItem('userId'); // Get the logged-in user's ID from localStorage

  // Format date as DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB').format(date); // Formats to DD-MM-YYYY
  };

  // Fetch all tournaments with filters applied
  const applyFilters = async () => {
    try {
      let url = 'http://localhost:8081/tournaments/approved?';
      if (selectedDate) url += `date=${selectedDate}&`;
      if (selectedVenue !== 'all') url += `venue=${selectedVenue}&`;
      if (selectedGender) url += `gender=${selectedGender}&`;

      const response = await fetch(url); // Fetch filtered tournaments
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      const data = await response.json();
      setAllTournaments(data);
    } catch (error) {
      console.error('Error fetching filtered tournaments:', error);
    }
  };

  const fetchCreatedTournaments = async () => {
    try {
      const response = await fetch(`http://localhost:8081/tournaments/created/${userId}`); // Fetch user's tournaments
      if (!response.ok) {
        throw new Error('Failed to fetch created tournaments');
      }
      const data = await response.json();
      setCreatedTournaments(data);
    } catch (error) {
      console.error('Error fetching created tournaments:', error);
    }
  };

  const fetchVenue = async () => {
    try {
      const response = await fetch('http://localhost:8081/uservenue'); // Correct endpoint for all venues
      if (!response.ok) {
        throw new Error('Failed to fetch venue');
      }
      const data = await response.json();
      setVenues(data); // Set all venues in state
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };
  

  // Fetch tournaments and user's created tournaments on component mount
  useEffect(() => {
    applyFilters();
    fetchCreatedTournaments();
    fetchVenue(); // Fetch venue names
  }, [selectedDate, selectedVenue, selectedGender, userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Switch active tab
  };

  const handleClearFilters = () => {
    setSelectedDate('');
    setSelectedVenue('all');
    setSelectedGender(null);
  };

  const filteredTournaments =
    activeTab === 'all' ? allTournaments : createdTournaments; // Choose data based on active tab

  return (
    <div className="user-matches-page">
      <UserHeader />
      <header className="matches-header">
        <div className="matches-header-content">
          <h1 className="matches-title">Tournaments and Matches</h1>
          <button className="create-matches-button">
            <Link to="/userselectvenue">Host a tournament</Link>
          </button>
        </div>
      </header>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          All Tournaments
        </button>
        <button
          className={`tab-button ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => handleTabChange('created')}
        >
          Your Created Tournaments
        </button>
      </div>

      <div className="matches-layout">
        <aside className="filter-sidebar">
          <h2>Filter Tournaments</h2>
          <div className="filter-section">
            <label htmlFor="match-date">Date</label>
            <input
              type="date"
              id="match-date"
              name="match-date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
            />
          </div>
          <div className="filter-section">
            <label htmlFor="location">Venue</label>
            <select
              id="location"
              name="location"
              onChange={(e) => setSelectedVenue(e.target.value)}
              value={selectedVenue}
            >
              <option value="all">All Venues</option>
              {venues.map((venue, index) => (
                <option key={index} value={venue.venue_name}>{venue.venue_name}</option> 
              ))}
            </select>
          </div>
          <div className="filter-section">
            <p>Gender</p>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="mixed"
                checked={selectedGender === 'mixed'}
                onChange={() => setSelectedGender('mixed')}
              />
              Mixed
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={selectedGender === 'female'}
                onChange={() => setSelectedGender('female')}
              />
              Female
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="men"
                checked={selectedGender === 'men'}
                onChange={() => setSelectedGender('men')}
              />
              Men
            </label>
          </div>
          <button className="clear-filter-btn" onClick={handleClearFilters}>Clear Filters</button>
        </aside>

        <main className="matches-main">
          <div className="matches-grid">
            <UserBoxContainers
              containers={filteredTournaments.map((tournament) => ({
                id: tournament.tournament_id,
                name: tournament.tournament_title,
                image: tournament.tournament_venue_img || 'https://placehold.co/400x400',
                venue: tournament.tournament_venue_name, // Pass venue name here
                date: formatDate(tournament.tournament_date),
                time: tournament.tournament_time,
              }))} 
              searchable={true}
              linkPrefix={
                activeTab === 'created'
                  ? 'useredittournament'
                  : 'usertournamentdetails'
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserTournaments;
