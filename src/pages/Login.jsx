
import React from 'react';
import {Link} from 'react-router-dom'

import '../styles/login.css'

import useFormValidation from '../hooks/useFormValidation';
import { validateLoginForm } from '../utils/validationRules';
import { FormInput } from '../components/FormInput/FormInput';
import { PasswordInput } from '../components/PasswordInput/PasswordInput';
import { ErrorMessage } from '../components/ErrorMessage/ErrorMessage';
import { Button } from '../components/AppButton/AppButton';
const LoginForm = () => {

  const [generalError, setGeneralError] = React.useState('');

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
    { email: '', password: '' },
    validateLoginForm
  );

  const onSubmit = async () => {
    setGeneralError('');
    
    try {
   
      const result = console.log('api');
      
      
      if (!result.success) {
        setGeneralError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit);
  };

  // Check if form is valid
  const isValid = 
    Object.keys(errors).length === 0 && 
    values.email !== '' && 
    values.password !== '';

  return (
    <>
      <h2 className="form-title">Sign In to your account</h2>
      <form onSubmit={handleFormSubmit} noValidate>
        <FormInput
          id="login-email"
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
          id="login-password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          error={errors.password}
          touched={touched.password}
          showForgot={true}
        />
        
        {generalError && <ErrorMessage message={generalError} />}
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          text="Login now"
          disabled={!isValid}
        />
        
        <div className="form-footer">
          <p>Don't have an account? <Link to="/sign-up" className="switch-form" >Sign up</Link></p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;