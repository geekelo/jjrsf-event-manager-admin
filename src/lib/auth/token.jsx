export const getToken = () => {
    return sessionStorage.getItem('admin_token');
  };
  
  export const setToken = (token) => {
    sessionStorage.setItem('admin_token', token);
  };
  
  export const setUser = (user) => {
    sessionStorage.setItem('admin_user', JSON.stringify(user));
  };
  
  export const removeToken = () => {
    sessionStorage.removeItem('admin_token');
  };
  
  export const isAuthenticated = () => {
    return !!getToken(); 
  };
  