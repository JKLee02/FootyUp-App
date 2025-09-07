import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserHeader from "../../Components/UserHeaderComponent/UserHeader";
import TournamentBracket from "../../Components/TournamentBracketComponent/TournamentBracket";
import "./UserEditTournament.css";

function UserEditTournament() {
  const { tournamentId } = useParams();
  const [tournamentData, setTournamentData] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tournamentStatus, setTournamentStatus] = useState("Approved"); // default value
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Format date to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const tournamentResponse = await fetch(
          `http://localhost:8081/tournaments/${tournamentId}`
        );
        if (!tournamentResponse.ok) {
          throw new Error("Failed to fetch tournament data");
        }
        const tournament = await tournamentResponse.json();
        setTournamentData(tournament);
        setTournamentStatus(tournament.tournament_status); // Initialize status from the fetched data

        const venueResponse = await fetch(
          `http://localhost:8081/uservenue/${tournament.tournament_venue_id}`
        );
        if (!venueResponse.ok) {
          throw new Error("Failed to fetch venue data");
        }
        const venue = await venueResponse.json();
        setVenueData(venue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTournamentData();
  }, [tournamentId]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        const response = await fetch(
          `http://localhost:8081/tournaments/${tournamentId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Tournament deleted successfully.");
          navigate("/usertournaments");
        } else {
          alert("Failed to delete the tournament.");
        }
      } catch (error) {
        console.error("Error deleting tournament:", error);
        alert("Error deleting tournament.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/tournaments/${tournamentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tournament_title: tournamentData.tournament_title,
            tournament_description: tournamentData.tournament_description,
            tournament_date: formatDateForInput(tournamentData.tournament_date),
            tournament_time: tournamentData.tournament_time,
            players_gender: tournamentData.players_gender,
            tournament_status: tournamentStatus, // Send the selected status
          }),
        }
      );
      if (response.ok) {
        alert("Tournament updated successfully.");
        setIsEditing(false);
        if (tournamentStatus === "Completed") {
          navigate("/usertournaments");
        }
      } else {
        alert("Failed to update the tournament.");
      }
    } catch (error) {
      console.error("Error updating tournament:", error);
      alert("Error updating tournament.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!tournamentData || !venueData) return <div>Loading...</div>;

  const isCreator = userId === String(tournamentData.user_created_id);

  return (
    <div className="user-edit-tournament-page">
      <UserHeader />
      <main className="user-edit-tournament-content">
        <div className="user-edit-tournament-header">
          {isEditing ? (
            <input
              type="text" required
              value={tournamentData.tournament_title}
              onChange={(e) =>
                setTournamentData({
                  ...tournamentData,
                  tournament_title: e.target.value,
                })
              }
              className="user-edit-tournament-title-input"
            />
          ) : (
            <h1 className="user-edit-tournament-title">{tournamentData.tournament_title}</h1>
          )}
          {isEditing && (
            <button className="user-edit-delete-button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
        <div className="user-edit-tournament-details-layout">
          <div className="user-edit-tournament-info">
            {!isEditing && (
              <button className="user-edit-edit-button" onClick={handleEdit}>
                Edit
              </button>
            )}
            <div className="user-edit-tournament-field">
              <label>
                <strong>Description:</strong>
                {isEditing ? (
                  <textarea
                    value={tournamentData.tournament_description}
                    onChange={(e) =>
                      setTournamentData({
                        ...tournamentData,
                        tournament_description: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{tournamentData.tournament_description}</p>
                )}
              </label>
            </div>
            <div className="user-edit-tournament-field">
              <label>
                <strong>Starting Date:</strong>
                {isEditing ? (
                  <input
                    type="date" required
                    value={formatDateForInput(tournamentData.tournament_date)}
                    onChange={(e) =>
                      setTournamentData({
                        ...tournamentData,
                        tournament_date: e.target.value,
                      })
                    }
                    />
                ) : (
                <p>{formatDateForInput(tournamentData.tournament_date)}</p>
                )}
              </label>
            </div>
            <div className="user-edit-tournament-field">
              <label>
                <strong>Starting Time:</strong>
                {isEditing ? (
                  <input
                    type="time" required
                    value={tournamentData.tournament_time}
                    onChange={(e) =>
                      setTournamentData({
                        ...tournamentData,
                        tournament_time: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{tournamentData.tournament_time}</p>
                )}
              </label>
            </div>
            <div className="user-edit-tournament-field">
              <label>
                <strong>Gender:</strong>
                {isEditing ? (
                  <select
                    value={tournamentData.players_gender}
                    onChange={(e) =>
                      setTournamentData({
                        ...tournamentData,
                        players_gender: e.target.value,
                      })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                ) : (
                  <p>{tournamentData.players_gender}</p>
                )}
              </label>
            </div>
            <div className="user-edit-tournament-field">
              <label>
                <strong>Status:</strong>
                {isEditing ? (
                  <select
                    value={tournamentStatus}
                    onChange={(e) => setTournamentStatus(e.target.value)}
                  >
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <p>{tournamentData.tournament_status}</p>
                )}
              </label>
            </div>
          </div>

          <div className="user-edit-tournament-venue">
            <div className="user-edit-tournament-venue-image">
              <img
                src={venueData.venue_image || "https://placehold.co/350x300"}
                alt={venueData.venue_name}
                className="user-edit-tournament-venue-img"
              />
            </div>
            <h2 className="user-edit-tournament-venue-name">{venueData.venue_name}</h2>
            <p className="user-edit-tournament-venue-address">{venueData.venue_address}</p>
          </div>
        </div>

        {isEditing && (
          <div className="user-edit-tournament-actions">
            <button className="user-edit-update-button" onClick={handleUpdate}>
              Save
            </button>
            <button className="user-edit-cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}

        <div className="user-edit-tournament-bracket">
          <h2>Tournament Bracket</h2>
          <TournamentBracket tournamentId={tournamentId} isCreator={isCreator} />
        </div>
      </main>
    </div>
  );
}

export default UserEditTournament;
