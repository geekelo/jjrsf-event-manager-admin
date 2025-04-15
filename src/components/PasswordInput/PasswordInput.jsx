import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/password-input.css';
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
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
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
        <button
          type="button"
          className="toggle-password"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? 
            <Eye size={18} strokeWidth={2} color="#666" /> : 
            <EyeOff size={18} strokeWidth={2} color="#666" />
          }
        </button>
      </div>
      
      {touched && error && <div className="input-error-message">{error}
        
        </div>
        
        }
         {showForgot && <Link to="/auth/forgot-password" className="forgot-link">Forgot Password?</Link>}
    </div>
  );
};