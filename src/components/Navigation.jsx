"use client";

import { useContext } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Navigation = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fund Request System
          </Typography> */}

          {isAuthenticated ? (
            <>
              {/* <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>

              {user.role === "user" && (
                <Button color="inherit" component={RouterLink} to="/request">
                  Request Funds
                </Button>
              )}

              {user.role === "department_head" && (
                <Button color="inherit" component={RouterLink} to="/approvals">
                  Approvals
                </Button>
              )}

              {user.role === "accounts" && (
                <Button color="inherit" component={RouterLink} to="/accounts">
                  Accounts
                </Button>
              )} */}

              <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {user.username} ({user.role})
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
