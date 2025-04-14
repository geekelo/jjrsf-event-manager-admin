
import React, { useState } from 'react';
import useFormValidation from '../hooks/useFormValidation';
import { validateRegisterForm } from '../utils/validationRules';

import '../styles/register.css'

import { PasswordInput } from '../components/PasswordInput/PasswordInput';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';
import { Button } from '../components/AppButton/AppButton';
import { PasswordStrengthRequirements } from '../components/PasswordRequirementStrength/PasswordRequirementStrength';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/FormInput/FormInput';
const RegisterForm = () => {

  const [generalError, setGeneralError] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleFocus,
    handleSubmit
  } = useFormValidation(
    { email: '', password: '', confirmPassword: '' },
    validateRegisterForm
  );

  const onSubmit = async () => {
    setGeneralError('');
    
    try {
   
      const result = console.log('api');
      
      
      if (!result.success) {
        setGeneralError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit);
  };

  // Handle password input focus to show requirements
  const handlePasswordFocus = (e) => {
    handleFocus(e);
    setShowRequirements(true);
  };

  // Handle password input blur to hide requirements
  const handlePasswordBlur = (e) => {
    handleBlur(e);
    setShowRequirements(false);
  };

  // Check if form is valid
  const isValid = 
    Object.keys(errors).length === 0 && 
    values.email !== '' && 
    values.password !== '' &&
    values.confirmPassword !== '';

  return (
    <>
    <h2 className="form-title">Create an account</h2>
      <form onSubmit={handleFormSubmit} noValidate>
        <FormInput
          id="register-email"
          name="email"
          type="email"
          label="Email"
          placeholder="jonas@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          error={errors.email}
          touched={touched.email}
        />
        
        <PasswordInput
          id="register-password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handlePasswordBlur}
          onFocus={handlePasswordFocus}
          error={errors.password}
          touched={touched.password}
          showForgot={false}
        />
        
        {showRequirements && (
          <PasswordStrengthRequirements password={values.password} />
        )}
        
        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          showForgot={false}
        />
        
        {generalError && <ErrorMessage message={generalError} />}
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          text="Create account"
          disabled={!isValid}
        />
        
        <div className="form-footer">
          <p>Already have an account? <Link to="/sign-in" className="switch-form" >Sign In</Link></p>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;