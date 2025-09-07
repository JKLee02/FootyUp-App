import Header from '../../Components/HeaderComponent/Header.jsx'
import Footer from '../../Components/FooterComponent/Footer.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import './ContactUs.css'

function ContactUs(){
    return(
        <>
        <Header></Header>
        <div className="contact-us-container">
            <section className="contact-us">
                <div className="contact-us-content">
                    <h1>Contact Us</h1>
                </div>
            </section>

            <section className="contact-details-section">
                <h2 className="get-in-touch-text">Get in Touch With Us</h2>
                <div className="contact-details">
                    <div className="contact-info">
                        <h2>Contact Details</h2>
                        <p><FontAwesomeIcon icon={faEnvelope}/> <strong>Email:</strong> <a href="mailto:footyup@gmail.my">footyup@gmail.my</a></p>
                        <p><FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong> 03-4567 9891</p>
                    </div>
                </div>
            </section>
        </div>
        <Footer></Footer>
        </>
    );
}

export default ContactUs;
