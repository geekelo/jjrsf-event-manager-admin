export const getToken = () => {
    return sessionStorage.getItem('admin_token');
  };
  
  export const setToken = (token) => {
    sessionStorage.setItem('admin_token', token);
  };
  
  export const removeToken = () => {
    sessionStorage.removeItem('admin_token');
  };
  
  export const isAuthenticated = () => {
    return !!getToken(); 
  };
  