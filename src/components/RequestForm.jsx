"use client"

import { useState, useContext } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  Chip,
} from "@mui/material"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const RequestForm = () => {
  const { user } = useContext(AuthContext)
  const [requestDetails, setRequestDetails] = useState({
    date: "",
    department: "",
    relatedToProject: "",
    toBeSignedOffBy: "",
    clientBrief: "",
    fileLocation: "",
    estimatedHours: "",
    startTime: "",
    dueDate: "",
    title: "",
    notes: "",
    endTime: "",
    hrs: "",
    contactNo: "",
    jobCardId: "",
  })
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleDetailsChange = (e) => {
    setRequestDetails({
      ...requestDetails,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNotification({ ...notification, open: false })

    try {
      // In a real app, you would send this data to your backend
      const response = await axios.post("/api/requests", {
        ...requestDetails,
        status: "pending",
        dateSubmitted: new Date().toISOString(),
        requestedBy: user.username,
      })

      // Show success message
      setNotification({
        open: true,
        message: "Job card submitted successfully!",
        severity: "success",
      })

      // Reset form
      setRequestDetails({
        date: "",
        department: "",
        relatedToProject: "",
        toBeSignedOffBy: "",
        clientBrief: "",
        fileLocation: "",
        estimatedHours: "",
        startTime: "",
        dueDate: "",
        title: "",
        notes: "",
        endTime: "",
        hrs: "",
        contactNo: "",
        jobCardId: "",
      })
    } catch (error) {
      setNotification({
        open: true,
        message:
          error.response?.data?.message || "Failed to submit job card.",
        severity: "error",
      })
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" gutterBottom>
            MUZUKURU Job Card
          </Typography>
          <Chip label={`Job Card ID: ${requestDetails.jobCardId || "2950"}`} />
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={requestDetails.date}
                onChange={handleDetailsChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={requestDetails.department}
                  onChange={handleDetailsChange}
                  label="Department"
                >
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Related to Project"
                name="relatedToProject"
                value={requestDetails.relatedToProject}
                onChange={handleDetailsChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="To be signed off by"
                name="toBeSignedOffBy"
                value={requestDetails.toBeSignedOffBy}
                onChange={handleDetailsChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Client/Brief"
                name="clientBrief"
                value={requestDetails.clientBrief}
                onChange={handleDetailsChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="File Location"
                name="fileLocation"
                value={requestDetails.fileLocation}
                onChange={handleDetailsChange}
                fullWidth
                helperText="This is accessed later by users who will need your files"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Estimated Hours"
                name="estimatedHours"
                type="number"
                value={requestDetails.estimatedHours}
                onChange={handleDetailsChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Time"
                name="startTime"
                type="time"
                value={requestDetails.startTime}
                onChange={handleDetailsChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={requestDetails.dueDate}
                onChange={handleDetailsChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title & Date Completed"
                name="title"
                value={requestDetails.title}
                onChange={handleDetailsChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes/Job Details"
                name="notes"
                value={requestDetails.notes}
                onChange={handleDetailsChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Time"
                name="endTime"
                type="time"
                value={requestDetails.endTime}
                onChange={handleDetailsChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Hrs"
                name="hrs"
                type="number"
                value={requestDetails.hrs}
                onChange={handleDetailsChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, step: 0.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact No"
                name="contactNo"
                value={requestDetails.contactNo}
                onChange={handleDetailsChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Card/Ticket ID"
                name="jobCardId"
                value={requestDetails.jobCardId || "2950"}
                onChange={handleDetailsChange}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Approval
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField label="New Start" fullWidth disabled />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Open New Card" fullWidth disabled />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Close Job Card" fullWidth disabled />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Sub Total: {requestDetails.hrs || 0} hrs</Typography>
                <Button type="submit" variant="contained" color="primary" size="large">
                  Submit Job Card
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RequestForm
