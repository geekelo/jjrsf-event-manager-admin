import React from 'react';
import '../../styles/error-message.css'
export const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">{message}</div>
  );
};
