import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLogin';
import EventsPage from './pages/Events';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login routes */}
        <Route path="/login" element={<AdminLoginPage />} />
        
        {/* Event routes */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<div>Event Management Page (Coming Soon)</div>} />
        <Route path="/events/create" element={<div>Create Event Page (Coming Soon)</div>} />
        
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* Catch all undefined routes */}
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
