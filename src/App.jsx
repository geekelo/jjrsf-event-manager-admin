import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AdminLoginPage from "./pages/AdminLogin"
import EventsPage from "./pages/Events"
import ManageEvent from "./pages/ManageEvent"
import AttendeeList from "./pages/AttendeeList"
import QuickRegistrationsList from "./pages/QuickRegistrationsList"
import PasscodeManagement from "./pages/PasscodeManagement"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"
import ProtectedRoute from "./components/auth/protectedRoute"
import ManageStream from "./pages/manageStream"
import EventFeedback from "./pages/EventFeedback"
import HomePage from "./pages/HomePage"
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
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
        style={{ top: "60px" }} // Add this to position it below headers
        className="toastify-container" // Add a custom class for targeting in CSS
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
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
          path="/events/:unique_id"
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
          path="/events/:eventId/quick-registrations"
          element={
            <ProtectedRoute>
              <QuickRegistrationsList />
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

        <Route
          path="/events/:eventId/feedback"
          element={
            <ProtectedRoute>
              <EventFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId/manage_stream"
          element={
            <ProtectedRoute>
              <ManageStream />
            </ProtectedRoute>
          }
        />

        {/* Redirect wildcard to home */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
