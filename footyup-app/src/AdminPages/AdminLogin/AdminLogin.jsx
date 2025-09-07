import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './AdminLogin.css';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        setFormError('');

        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:8081/adminlogin', { email, password })
            .then(res => {
                const { accessToken, refreshToken, admin_name } = res.data;
                localStorage.setItem('adminToken', accessToken);
                localStorage.setItem('adminRefreshToken', refreshToken);
                localStorage.setItem('admin_name', admin_name);
                navigate('/adminhome');
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    setFormError("Invalid email or password. Please try again.");
                } else {
                    setFormError("An error occurred. Please try again later.");
                }
            });
        }
    };

    return (
        <div className="admin-login-page-container">
            <main className="login-main-content">
                <div className="login-container">
                    <div className="login-box">
                        <h2>Admin Login</h2>
                        <hr className="line-decoration" />

                        <form className="login-form" onSubmit={handleSubmit}>
                            {formError && <p className="login-error-message">{formError}</p>}

                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="login-error-message">{errors.email}</p>}

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
                            {errors.password && <p className="login-error-message">{errors.password}</p>}

                            <button type="submit" className="login-button">Login</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminLogin;
