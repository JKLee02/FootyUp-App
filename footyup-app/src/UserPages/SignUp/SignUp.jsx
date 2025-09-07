import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Header from '../../Components/HeaderComponent/Header.jsx';
import Footer from '../../Components/FooterComponent/Footer.jsx';
import './SignUp.css';
import axios from 'axios';

function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName.trim()) errors.firstName = 'First name is required';
        if (!lastName.trim()) errors.lastName = 'Last name is required';
        if (!email) {
            errors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:8081/signup', { firstName, lastName, email, password })
                .then(() => {
                    alert("Registration successful!");
                    navigate('/login');
                })
                .catch(err => {
                    setErrors({ form: "Email already exists. Please try again." });
                });
        }
    };

    return (
        <div className="signup-page-container">
            <Header />
            <main className="signup-main-content">
                <div className="signup-container">
                    <div className="signup-box">
                        <h2>Sign Up</h2>
                        <hr className="line-decoration" />

                        <form className="signup-form" onSubmit={handleSubmit}>
                            {errors.form && <p className="signup-error-message">{errors.form}</p>}

                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {errors.firstName && <p className="signup-error-message">{errors.firstName}</p>}

                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {errors.lastName && <p className="signup-error-message">{errors.lastName}</p>}

                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="signup-error-message">{errors.email}</p>}

                            <label htmlFor="password">Password:</label>
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="toggle-password-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                            {errors.password && <p className="signup-error-message">{errors.password}</p>}

                            <button type="submit" className="signup-button">Sign Up</button>
                            <hr className="line-decoration" />

                            <div className="login-link">
                                <p>Already have an account? <a href="/login">Login Here</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default SignUp;
