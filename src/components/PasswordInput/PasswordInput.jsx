import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/password-input.css'
import { Link } from 'react-router-dom';
export const PasswordInput = ({ 
    id, 
    name,
    label, 
    placeholder, 
    value = '', 
    onChange, 
    onBlur,
    onFocus,
    error,
    touched,
    showForgot 
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
      score: 0,
      message: '',
      color: ''
    });
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    
    // Check password strength on change
    useEffect(() => {
      // Make sure value is a string
      const passwordValue = String(value || '');
      
      if (passwordValue) {
        let score = 0;
        
        // Length check
        if (passwordValue.length >= 8) score += 1;
        
        // Contains uppercase
        if (/[A-Z]/.test(passwordValue)) score += 1;
        
        // Contains lowercase
        if (/[a-z]/.test(passwordValue)) score += 1;
        
        // Contains number
        if (/[0-9]/.test(passwordValue)) score += 1;
        
        // Contains special character
        if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
        
        // Set strength message and color
        let message = '';
        let color = '';
        
        switch (score) {
          case 0:
          case 1:
            message = 'Weak';
            color = '#e74c3c';
            break;
          case 2:
          case 3:
            message = 'Medium';
            color = '#f39c12';
            break;
          case 4:
          case 5:
            message = 'Strong';
            color = '#27ae60';
            break;
          default:
            message = '';
            color = '';
        }
        
        setPasswordStrength({ score, message, color });
      } else {
        setPasswordStrength({ score: 0, message: '', color: '' });
      }
    }, [value]);
  
    return (
      <div className="form-group">
        <div className="password-label">
          <label htmlFor={id} className="form-label">{label}</label>
         
        </div>
        <div className={`password-input-container ${touched && error ? "input-error" : ""}`}>
          <input
            type={showPassword ? "text" : "password"}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className="password-input"
          />
           {showForgot && <Link to="#" className="forgot-link">Forgot Password?</Link>}
          <button 
            type="button" 
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <Eye className='form-label'/> : <EyeOff/>}
          
          
          </button>
        </div>
        
        {value && String(value).length > 0 && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className="strength-progress" 
                style={{ 
                  width: `${(passwordStrength.score / 5) * 100}%`,
                  backgroundColor: passwordStrength.color
                }}
              ></div>
            </div>
            <span className="strength-text" style={{ color: passwordStrength.color }}>
              {passwordStrength.message}
            </span>
          </div>
        )}
        
        {touched && error && <div className="input-error-message">{error}</div>}
      </div>
    );
  };
