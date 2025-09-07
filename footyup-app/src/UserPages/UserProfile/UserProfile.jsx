import React, { useState, useEffect } from 'react';
import UserHeader from '../../Components/UserHeaderComponent/UserHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import UserProfilePic from '../../assets/UserProfilePic.png'
import './UserProfile.css';

function UserProfile() {
  const [gender, setGender] = useState('');

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
  });

  const [isEditable, setIsEditable] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backupUserData, setBackupUserData] = useState({});
  const [backupGender, setBackupGender] = useState('');
  const [formErrors, setFormErrors] = useState({}); // Added for validation errors
  const [message, setMessage] = useState(null); // Added state for success/failure messages


  // Fetch data from the backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8081/userprofile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          console.error('Unauthorized - redirecting to login');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          password: data.password || '',
        });
        setGender(data.gender || '');

      // Backup initial data
        setBackupUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          password: data.password || '',
        });
        setBackupGender(data.gender || '');

      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};
  
    // Validate First Name
    if (!userData.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
  
    // Validate Last Name
    if (!userData.lastName.trim()) {
      errors.lastName = 'Last Name is required';
    }
  
    // Validate Password
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
  
    return errors;
  };
  

  // Save user details after validation
  const handleSave = () => {
    const errors = validateForm();
    setFormErrors(errors); // Set validation errors
  
    if (Object.keys(errors).length > 0) {
      return; // Stop save if errors exist
    }
  
    const token = localStorage.getItem('token');
    fetch('http://localhost:8081/userprofile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        ...userData, 
        gender      
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Profile updated successfully');
        setIsEditable(false);  // Disable editing after saving
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      })
      .catch((error) => {
        console.error('Error saving profile:', error);
        setMessage({ text: 'Failed to update profile. Please try again later.', type: 'error' });
      });
  };
  
  
    // Edit button handler
    const handleEditClick = () => {
      setIsEditable(true);

      // Save the current state as backup
      setBackupUserData(userData);
      setBackupGender(gender);
    };

    // Cancel button handler
    const handleCancel = () => {
      setIsEditable(false);

      // Revert back to the backup state
      setUserData(backupUserData);
      setGender(backupGender);

      // Clear any form errors
      setFormErrors({});
    };

  return (
    <div className="user-profile-page">
      <UserHeader />
      <main className="user-profile-main">
        <h2 className="user-profile-text">User Profile</h2>
        <div className="user-profile-container">
          <div className="user-profile-left">
            <div className="user-profile-pic-container">
                <img src={UserProfilePic} alt="Profile" className="profile-pic" />
                {message && (
                <div className={`message ${message.type}`}>
                {message.text}
                </div>
         )}
            </div>
          </div>
          <div className="user-profile-right">
            <div className="user-profile-name-row">
            <div className="user-profile-field">
                <label htmlFor="firstName">First Name</label>
                <div className="user-input-container">
                  <input
                    type="text"
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                    placeholder="First Name"
                    disabled={!isEditable}
                  />
                </div>
                {formErrors.firstName && (
                  <p className="error-message">{formErrors.firstName}</p> // Display error
                )}
              </div>

              <div className="user-profile-field">
                <label htmlFor="lastName">Last Name</label>
                <div className="user-input-container">
                    <input
                      type="text"
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      placeholder="Last Name"
                      disabled={!isEditable}
                    />
                </div>
                {formErrors.lastName && (
                  <p className="error-message">{formErrors.lastName}</p> // Display error
                )}
              </div>
            </div>

            <div className="user-profile-field">
              <label htmlFor="email">Email</label>
              <div className="user-input-container">
                <input
                  type="email" required
                  id="email"
                  value={userData.email}
                  placeholder="Email"
                  disabled={true}
                />
              </div>
            </div>

            <div className="user-profile-field">
              <label htmlFor="password">Password</label>
              <div className="user-input-container password-container">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="Password"
                  disabled={!isEditable}
                />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye} 
                  className="edit-icon"
                  onClick={() => setPasswordVisible(!passwordVisible)} 
                />
              </div>
              {formErrors.password && (
                <p className="password-error-message">{formErrors.password}</p>
              )}
            </div>

            <div className="user-profile-field">
              <label htmlFor="gender">Gender</label>
              <div className="user-input-container">
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!isEditable}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div className="user-profile-button-container">
              {isEditable ? (
                <>
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-btn" onClick={handleEditClick}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
