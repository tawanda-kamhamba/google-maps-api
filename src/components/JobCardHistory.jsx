import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Chip, Box, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Schedule, CheckCircle, Assignment } from "@mui/icons-material";
import api from "../utils/api";

const statusColor = {
  pending: "warning",
  assigned: "info",
  closed: "success",
  completed: "success",
};

const statusIcon = {
  pending: <Schedule color="warning" />,
  assigned: <Assignment color="info" />,
  closed: <CheckCircle color="success" />,
  completed: <CheckCircle color="success" />,
};

const JobCardHistory = () => {
  const [jobCards, setJobCards] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/api/requests").then(res => setJobCards(res.data || []));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Job Card History
      </Typography>
      <Grid container spacing={3}>
        {jobCards.map(card => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <Card
              sx={{ cursor: "pointer", transition: "0.2s", "&:hover": { boxShadow: 6 } }}
              onClick={() => setSelected(card)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {statusIcon[card.status] || <Assignment color="action" />}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {card.relatedToProject || "Untitled"}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Department: {card.department}
                    </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted: {card.dateSubmitted ? new Date(card.dateSubmitted).toLocaleDateString() : "N/A"}
                    </Typography>
                    <Chip
                  label={card.status || "Unknown"}
                  color={statusColor[card.status] || "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Details Modal */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Job Card Details</DialogTitle>
        <DialogContent>
          {selected && (
            <Box>
              <Typography variant="h6">{selected.relatedToProject}</Typography>
              <Typography>Department: {selected.department}</Typography>
              <Typography>Status: {selected.status}</Typography>
              <Typography>Requested By: {selected.requestedBy}</Typography>
              <Typography>Date Submitted: {selected.dateSubmitted}</Typography>
              <Typography>Notes: {selected.notes}</Typography>
              {/* Add more fields as needed */}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default JobCardHistory; 