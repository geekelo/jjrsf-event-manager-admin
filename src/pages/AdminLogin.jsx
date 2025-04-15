import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import '../stylesheets/adminLogin.css';

function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Show success message
      toast.success('Login successful! (Demo mode)');
      setLoading(false);
      
      // In the future, this will connect to an actual API
      console.log('Login credentials:', formData);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login-container">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="admin-login-wrapper">
        {/* Left Column */}
        <div className="admin-login-left">
          <img src="/src/assets/jjrsf-logo.png" alt="Event Manager Admin Logo" className="admin-login-logo" />
          <h2 className="admin-login-welcome">Event Manager Admin</h2>
          <p className="admin-login-message">
            Access the admin dashboard to manage events, users, and system settings.
          </p>
        </div>

        {/* Right Column */}
        <div className="admin-login-right">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Enter your credentials to access the admin portal</p>
          
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="email" className="admin-form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="admin-form-input"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && (
                <div className="admin-form-error">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                Password
              </label>
              <div className="admin-password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="admin-form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="admin-password-toggle-btn" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex="0"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <div className="admin-form-error">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="admin-form-options">
              <label className="admin-form-remember" htmlFor="remember">
                <input
                  type="checkbox"
                  className="admin-form-checkbox"
                  id="remember"
                />
                <span>Remember me</span>
              </label>

              <Link to="/admin/forgot-password" className="admin-form-forgot">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="admin-form-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;