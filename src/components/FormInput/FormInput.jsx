import React from 'react';
import '../../styles/form-input.css'
export const FormInput = ({ 
    id, 
    name,
    type, 
    label, 
    placeholder, 
    value = '',
    onChange, 
    onBlur, 
    onFocus,
    error,
    touched
  }) => {
    return (
      <div className="form-group">
        <label htmlFor={id} className="form-label">{label}</label>
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`form-input ${touched && error ? "input-error" : ""}`}
        />
        {touched && error && <div className="input-error-message">{error}</div>}
      </div>
    );
  };
  