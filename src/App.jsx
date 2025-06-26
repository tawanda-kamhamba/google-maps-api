import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
import Login from "../src/components/Login";
import Dashboard from "../src/components/Dashboard";
import RequestForm from "../src/components/RequestForm";
import DepartmentApprovals from "../src/components/DepartmentalApprovals";
import AccountsPanel from "../src/components/AccountsPanel";
import Navigation from "../src/components/Navigation";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import JobCardHistory from "./components/JobCardHistory";
import DepartmentHistory from "./components/DepartmentHistory";

const theme = createTheme({
  palette: {
    primary: {
      main: "#614438",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/request"
                element={
                  <ProtectedRoute roles={["user"]}>
                    <RequestForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approvals"
                element={
                  <ProtectedRoute roles={["department_head"]}>
                    <DepartmentApprovals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute roles={["accounts"]}>
                    <AccountsPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <JobCardHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/department-history"
                element={
                  <ProtectedRoute roles={["department_head"]}>
                    <DepartmentHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Protected route component
function ProtectedRoute({ children, roles = [] }) {
  const { user, isAuthenticated } = React.useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default App;
