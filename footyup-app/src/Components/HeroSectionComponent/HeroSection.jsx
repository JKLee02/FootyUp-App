import "./HeroSection.css";
import football_fans from "../../assets/football_fans.svg";
import hosting_matches from "../../assets/hosting_matches.svg";
import playing_football from "../../assets/playing_football.svg";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <>
      <div className="hero-container">
        <section className="hero">
          <div className="hero-content">
            <h1>FootyUp</h1>
            <p>Finding football tournaments has never been much easier!</p>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature-image">
              <img src={playing_football} alt="Play anytime, anywhere" />
            </div>
            <div className="feature-content">
              <h2>Play anytime, anywhere!</h2>
              <p>
                Whether you&apos;re looking for a quick tournament or match
                after work, a weekend match with friends, or just some practice
                time, FootyUp gives you access to tournaments at any time, in
                any location. Our platform helps you connect with local
                tournaments, whether you&apos;re home or on the go. Simply
                browse upcoming tournaments, and with just a few taps, you’ll be
                on the pitch, ready to play.
              </p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-image">
              <img src={hosting_matches} alt="Host your own tournaments" />
            </div>
            <div className="feature-content">
              <h2>Host your own tournaments!</h2>
              <p>
                With FootyUp, you can easily organize your own football
                tournaments. Invite friends, or open your tournament to the
                wider community. Whether it&apos;s a friendly kickabout, a
                competitive game, or a training session, FootyUp lets you set
                the time, location, and rules. You’ll have full control, and
                players can join your tournaments with just a click.
              </p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-image">
              <img
                src={football_fans}
                alt="Be part of the inclusive community"
              />
            </div>
            <div className="feature-content">
              <h2>Be part of the inclusive community!</h2>
              <p>
                At FootyUp, we believe football should be for everyone,
                regardless of age, skill level, or background. Our platform
                fosters a welcoming and inclusive community where everyone can
                find a place to play. Whether you&apos;re a seasoned player or just
                starting out, you’ll find like-minded football lovers to share
                the pitch with. We’re about creating connections through the
                love of the game, with players of all skill levels coming
                together to enjoy football in its purest form.
              </p>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-content">
            <h2>Join the community today by starting here!</h2>
            <button className="cta-button">
              <Link to="/signup">Sign Up Here!</Link>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default HeroSection;
