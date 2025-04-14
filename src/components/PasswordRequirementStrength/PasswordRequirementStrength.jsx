import React from 'react';
import '../../styles/password-requirement.css'
export const PasswordStrengthRequirements = ({ password = '' }) => { 
    // Make sure password is a string
    const passwordValue = String(password || '');
    
    // Check for specific requirements
    const hasLength = passwordValue && passwordValue.length >= 8;
    const hasUppercase = passwordValue && /[A-Z]/.test(passwordValue);
    const hasLowercase = passwordValue && /[a-z]/.test(passwordValue);
    const hasNumber = passwordValue && /[0-9]/.test(passwordValue);
    const hasSpecial = passwordValue && /[^A-Za-z0-9]/.test(passwordValue);
    
    return (
      <div className="password-requirements">
        <p className="requirements-title">Password must contain:</p>
        <ul className="requirements-list">
          <li className={hasLength ? 'requirement-met' : ''}>
            At least 8 characters
          </li>
          <li className={hasUppercase ? 'requirement-met' : ''}>
            At least one uppercase letter
          </li>
          <li className={hasLowercase ? 'requirement-met' : ''}>
            At least one lowercase letter
          </li>
          <li className={hasNumber ? 'requirement-met' : ''}>
            At least one number
          </li>
          <li className={hasSpecial ? 'requirement-met' : ''}>
            At least one special character
          </li>
        </ul>
      </div>
    );
  };

