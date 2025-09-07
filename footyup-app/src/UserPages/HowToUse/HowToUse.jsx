import Header from '../../Components/HeaderComponent/Header.jsx'
import Footer from '../../Components/FooterComponent/Footer.jsx'
import searching_games from '../../assets/searching_games.svg'
import booking_games from '../../assets/booking_games.svg'
import enjoy_playing from '../../assets/enjoy_playing.svg'
import game_host from '../../assets/game_host.svg'
import finding_right_players from '../../assets/finding_right_players.svg'
import './HowToUse.css';

function HowToUse() {
  return (
    <>
      <Header />
      <div className="how-to-use-container">
        <section className="how-to-use">
          <div className="how-to-use-content">
            <h1>How To Use</h1>
          </div>
        </section>

        <section className="steps-section">
          <div className="steps-container">
            <div className="step-box">
              <img src={searching_games} alt="Step 1" />
              <h3>1. Find any tournaments that you want to join</h3>
            </div>
            <div className="step-box">
              <img src={booking_games} alt="Step 2" />
              <h3>2. Book your tournaments</h3>
            </div>
            <div className="step-box">
              <img src={enjoy_playing} alt="Step 3" />
              <h3>3. Enjoy your tournament!</h3>
            </div>
          </div>
        </section>

        {/* Two additional sections similar to the hero section */}
        <section className="additional-section-1">
          <div className="additional-content">
            <div className="image-box">
              <img src={finding_right_players} alt="Finding the right players" />
            </div>
            <div className="text-box">
              <h2>Finding the right players</h2>
              <p>
              With FootyUp, finding players for your tournaments has never been easier. 
              Our platform connects you with nearby players who match your skill level and availability. 
              Whether you're looking to form a competitive team or just want a casual game, we help you fill your roster quickly. 
              Just create or join a tournament, and we'll do the rest—making it easy to get your game on.
            </p>
            </div>
          </div>
        </section>

        <section className="additional-section-2">
          <div className="additional-content">
            <div className="image-box">
              <img src={game_host} alt="Become a Host" />
            </div>
            <div className="text-box">
              <h2>Become a host</h2>
              <p>
              Want to take control of organizing the perfect tournament? Become a host on FootyUp! 
              Create and manage your own matches, set the rules, invite players, and secure a venue. Hosting gives you full control over your game schedule, 
              ensuring a smooth and hassle-free experience for everyone involved. Whether it's for fun or competitive play, you can lead the charge.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default HowToUse;
