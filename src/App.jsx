import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLoginPage from "./pages/AdminLogin";
import EventsPage from './pages/Events';
import "./App.css";
import ProtectedRoute from "./components/auth/protectedRoute";
import Events from "./pages/Events";

function App() {
  return (
    <Router>
      <Routes>
        {/* Unprotected Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        {/* Redirect root and wildcard to login */}
        <Route path="/" element={<Navigate replace to="/admin/login" />} />
        <Route path="*" element={<Navigate replace to="/admin/login" />} />
        {/* Login routes */}
       
        {/* Event routes */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<div>Event Management Page (Coming Soon)</div>} />
        <Route path="/events/create" element={<div>Create Event Page (Coming Soon)</div>} />
        
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate replace to="/admin/login" />} />
        
        {/* Catch all undefined routes */}
        <Route path="*" element={<Navigate replace to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
