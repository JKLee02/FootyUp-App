import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserHeader from "../../Components/UserHeaderComponent/UserHeader";
import "./UserHome.css";

function UserHome() {
  const [userFirstName, setUserFirstName] = useState(""); // State for username
  const navigate = useNavigate();

  useEffect(() => {
    // Get the user's first name from localStorage when the component mounts
    const storedFirstName = localStorage.getItem("user_firstname");

    if (storedFirstName) {
      setUserFirstName(storedFirstName); // Update the state with the user's name
    } else {
      // Redirect to the front page if no user data is found
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="user-home-page">
      <UserHeader />
      <main className="user-home-main">
        <h1 className="user-welcome-text">
          Welcome back{userFirstName ? `, ${userFirstName}` : ""}!
        </h1>
        <p className="user-subtext">What do you want to do today?</p>

        <div className="user-home-container">
          <div className="user-options-container">
            <div className="option-box">
              <h3>Looking for tournaments?</h3>
              <p>
                Still yet to decide on which tournament to play? Click here to
                browse all of the available tournaments!
              </p>
              <Link to="/usertournaments" className="option-btn">
                Let&apos;s go
              </Link>
            </div>

            <div className="option-box">
              <h3>Host a tournament</h3>
              <p>
                Wanna be the host for a tournament? You can start by clicking
                this button here!
              </p>
              <Link to="/usertournaments" className="option-btn">
                Let&apos;s go
              </Link>
            </div>

            <div className="option-box">
              <h3>Join a team</h3>
              <p>
                Still thinking on which team to join or just wanna take a look
                at the community? Here it can decide all of that for you!
              </p>
              <Link to="/userteam" className="option-btn">
                Let&apos;s go
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserHome;
