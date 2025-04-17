import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLoginPage from "./pages/AdminLogin";
import EventsPage from './pages/Events';
import ManageEvent from './pages/ManageEvent';
import AttendeeList from './pages/AttendeeList';
import PasscodeManagement from './pages/PasscodeManagement';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import ProtectedRoute from "./components/auth/protectedRoute";

function App() {
  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ top: '60px' }} // Add this to position it below headers
        className="toastify-container" // Add a custom class for targeting in CSS
      />
      <Routes>
        {/* Unprotected Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <ManageEvent />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/events/:eventId/attendees/:type"
          element={
            <ProtectedRoute>
              <AttendeeList />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/events/:eventId/passcodes"
          element={
            <ProtectedRoute>
              <PasscodeManagement />
            </ProtectedRoute>
          }
        />

        {/* Redirect root and wildcard to login */}
        <Route path="/" element={<Navigate replace to="/events" />} />
        <Route path="*" element={<Navigate replace to="/events" />} />
      </Routes>
    </Router>
  );
}

export default App;
