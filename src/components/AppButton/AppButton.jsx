import React from 'react';
import '../../styles/button.css'
export const Button = ({ type, isLoading, text, onClick, disabled }) => {
    return (
        <button 
          type={type} 
          className="action-button" 
          disabled={isLoading || disabled}
          onClick={onClick}
        >
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : text}
        </button>
      );
};

