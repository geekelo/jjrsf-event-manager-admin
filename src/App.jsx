import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLogin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Set the login page as the default route */}
        <Route path="/login" element={<AdminLoginPage />} />
        
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* Add other routes here in the future */}
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
