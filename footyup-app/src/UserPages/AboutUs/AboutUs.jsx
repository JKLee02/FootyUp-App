import Header from '../../Components/HeaderComponent/Header.jsx'
import Footer from '../../Components/FooterComponent/Footer.jsx'
import './AboutUs.css'

function AboutUs(){
    return(
        <>
        <Header></Header>

        <div className="about-us-container">
            <section className="about-us-section">
                <div className="about-us-content">
                    <h1>About Us</h1>
                </div>
            </section>

        <section className="origin-story-section">
        <div className="origin-story">
            <h2>Our Origins</h2>
            <div className="origin-story-1st">
                <p>
                FootyUp was born out of a simple idea: to make playing football more accessible for everyone. 
                </p>
            </div>
            <p className="origin-story-2nd">The founders who are also passionate football lovers, realized that finding or organizing local matches was often a challenge. 
            Whether it was due to busy schedules, lack of connections, or location issues, many missed out on the joy of the game. With this in mind, FootyUp was created as a platform where players of all levels could effortlessly find, 
            join, or host football matches in their area. What started as a solution to bring friends together on the pitch has now grown into a thriving community of football enthusiasts who share the love of the game, anytime, anywhere.
            </p>

          </div>
        </section>
        </div>
        <Footer></Footer>
        </>
    );

}

export default AboutUs