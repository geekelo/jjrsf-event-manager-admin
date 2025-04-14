

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };
  
  // Password validation
  export const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };
  
  // Login form validation
  export const validateLoginForm = (values) => {
    const errors = {};
    
    const emailError = validateEmail(values.email);
    if (emailError) {
      errors.email = emailError;
    }
    
    const passwordError = validatePassword(values.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    return errors;
  };
  
  // Registration form validation
  export const validateRegisterForm = (values) => {
    const errors = {};
    
    const emailError = validateEmail(values.email);
    if (emailError) {
      errors.email = emailError;
    }
    
    const passwordError = validatePassword(values.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };