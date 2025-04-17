import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLoginPage from "./pages/AdminLogin";
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
      </Routes>
    </Router>
  );
}

export default App;
