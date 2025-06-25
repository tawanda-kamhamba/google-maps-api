import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  CircularProgress,
} from "@mui/material";
import { Assignment, CheckCircle, Cancel, Pending, History } from "@mui/icons-material";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

// The backend now provides the data.
// This mock data is no longer needed.

const statusColor = {
  approved: "success",
  rejected: "error",
  pending: "warning",
};

const statusIcon = {
  approved: <CheckCircle color="success" />,
  rejected: <Cancel color="error" />,
  pending: <Pending color="warning" />,
};

const JobCardHistory = () => {
  const { user } = useContext(AuthContext);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/api/history?username=${user.username}`);
        setJobCards(response.data);
      } catch (error) {
        console.error("Failed to fetch job card history:", error);
        // Optionally set an error state to show in the UI
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#10b981" }}>
        Job Card History
      </Typography>
      <List sx={{ p: 0 }}>
        {jobCards.map((job, idx) => (
          <Box key={job.id}>
            <Card
              sx={{
                mb: 2,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.12)" },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {job.title || "Job Request"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {job.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      Date
                    </Typography>
                    <Typography variant="body2">{job.date}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      Est. Hours
                    </Typography>
                    <Typography variant="body2">{job.estimatedHours}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Chip
                      icon={statusIcon[job.status]}
                      label={job.status}
                      color={statusColor[job.status]}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Button variant="outlined" size="small" startIcon={<History />}>
                      View
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {idx < jobCards.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default JobCardHistory; 