import Header from '../../Components/HeaderComponent/Header.jsx'
import Footer from '../../Components/FooterComponent/Footer.jsx'
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <>
      <Header></Header>
      <div className="privacy-policy-container">
        <section className="privacy-policy">
          <div className="privacy-policy-content">
            <h1>Privacy Policy</h1>
          </div>
        </section>

        <section className="privacy-details">
          <div className="privacy-details-content">
            <p>
              <strong>FootyUp</strong> (“we,” “us,” or “our”) values your privacy and is committed to protecting your personal information. 
              This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our app or website (collectively, the "Service"). 
              By using the service, you agree to the practices described in this Privacy Policy.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We may collect the following types of information:
            </p>
            <h3>1.1 Personal Information</h3>
            <p>
              When you register on <strong>FootyUp</strong>, we may collect personal information, including but not limited to:
            </p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Location (for finding nearby matches)</li>
            </ul>

            <h3>1.2 Usage Data</h3>
            <p>
              We may collect non-personally identifiable information about your interaction with our Service. This includes:
            </p>
            <ul>
              <li>Device information (type, operating system)</li>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Pages visited and time spent on the app/website</li>
              <li>Referring website</li>
            </ul>

            <h3>1.3 Location Data</h3>
            <p>
              With your consent, we may collect real-time location information to help you find matches near you. You can control location sharing via your device settings.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We may use your information in the following ways:
            </p>
            <ul>
              <li>To facilitate account creation and log-in</li>
              <li>To connect you with local football matches</li>
              <li>To manage and update your profile and preferences</li>
              <li>To send promotional emails and notifications (you can opt out anytime)</li>
              <li>To improve our Service, including troubleshooting, data analysis, and usability</li>
              <li>To ensure compliance with our terms and conditions</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
              We do not sell or rent your personal information to third parties. However, we may share your data in the following instances:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> We may share your data with third-party vendors or service providers who help us operate the Service.</li>
              <li><strong>Legal Compliance:</strong> We may disclose your information if required by law, court order, or government regulation.</li>
              <li><strong>Business Transfers:</strong> If FootyUp is involved in a merger, acquisition, or asset sale, your data may be transferred.</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
              We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. 
              You can request that we delete your account and data at any time.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal data, including:
            </p>
            <ul>
              <li><strong>Access:</strong> You can request access to your data.</li>
              <li><strong>Correction:</strong> You can request corrections to your personal information.</li>
              <li><strong>Deletion:</strong> You can request deletion of your data.</li>
              <li><strong>Opt-out:</strong> You can opt out of marketing communications or revoke consent for data collection.</li>
            </ul>

            <p>To exercise any of these rights, please contact us at 03-4567 9891.</p>

            <h2>6. Security of Your Information</h2>
            <p>
              We take reasonable measures to protect your data from unauthorized access, alteration, or disclosure. 
              However, please note that no method of transmission over the internet or method of electronic storage is completely secure.
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites or services. 
              We are not responsible for the privacy practices or content of these external sites.
            </p>

            <h2>8. Children’s Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children. 
              If you believe we have collected information from a child, please contact us immediately.
            </p>

            <h2>9. Updates to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. 
              Any changes will be posted on this page with an updated "Effective Date."
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li><strong>Email:</strong><a href="mailto:footyup@gmail.my"> footyup@gmail.my</a></li>
              <li><strong>Phone:</strong> 03-4567 9891</li>
            </ul>
          </div>
        </section>

      </div>
      <Footer></Footer>
    </>
  );
}

export default PrivacyPolicy;
