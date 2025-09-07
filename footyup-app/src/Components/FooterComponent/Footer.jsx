import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import './Footer.css'
import { Link } from 'react-router-dom';

function Footer(){
    return(
      <>
    <footer className="footer">
      <div className="footer-section">
        <h4>About FootyUp</h4>
        <p>
        FootyUp aims to be a user-friendly platform designed to help football enthusiasts easily find, join, or host local tournaments.
        Play anytime, anywhere, and be part of a growing network of football lovers!
        </p>
      </div>
      <div className="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/aboutus">About Us</Link></li>
          <li><Link to="/howtouse">How to Use</Link></li>
          <li><Link to="/contactus">Contact Us</Link></li>
          <li><Link to="/privacypolicy">Privacy Policy</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>Contacts</h4>
        <p><FontAwesomeIcon icon={faEnvelope}/> <a href="mailto:footyup@gmail.my">Email: footyup@gmail.my</a></p>
        <p><FontAwesomeIcon icon={faPhone}/> Phone: 03-4567 9891</p>
      </div>
    </footer>
    <div className="footer-copyright">
    <hr className="footer-hr"/>
      <p>&copy; 2024 FootyUp. All rights reserved.</p>
    </div>
    </>

    );
}

export default Footer