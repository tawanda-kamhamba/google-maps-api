"use client"

import { useState, useContext, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material"
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle,
  Cancel as RejectIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Schedule,
  Assignment,
  CheckCircle as ApproveIcon,
} from "@mui/icons-material"
import { AuthContext } from "../context/AuthContext"
import api from "../utils/api"
import { useNavigate } from "react-router-dom"

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

const statusOptions = ["all", "pending", "assigned", "closed", "completed"];
const departmentOptions = ["all", "IT", "HR", "Finance", "Marketing", "Operations"];

const DepartmentApprovals = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedRequest, setEditedRequest] = useState(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [departmentFilter, setDepartmentFilter] = useState(user.department || "all")
  const [statusFilter, setStatusFilter] = useState("pending")

  useEffect(() => {
    api.get("/api/requests").then(res => {
      // Optionally filter by department if needed:
      // const filtered = res.data.filter(r => r.department === user.department)
      setRequests(res.data || [])
    })
  }, [])

  const handleViewDetails = (request) => {
    setSelectedRequest(request)
    setEditedRequest({ ...request })
    setOpenDialog(true)
    setIsRejecting(false)
    setIsEditing(false)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setRejectReason("")
    setIsEditing(false)
    setEditedRequest(null)
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedRequest({ ...selectedRequest })
    }
  }

  const handleEditChange = (field, value) => {
    setEditedRequest({
      ...editedRequest,
      [field]: value,
    })
  }

  const handleSaveEdit = async () => {
    try {
      // Send update to backend
      const response = await api.put(`/api/requests/${editedRequest.id}`, editedRequest);
      // Update local state
      const updatedRequests = requests.map((req) =>
        req.id === editedRequest.id ? { ...req, ...response.data } : req
      );
      setRequests(updatedRequests);
      setSelectedRequest(response.data);
      setIsEditing(false);
      setNotification({
        open: true,
        message: 'Request updated successfully!',
        severity: 'success',
      });
      handleCloseDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to update request. Please try again.',
        severity: 'error',
      });
    }
  }

  const handleApprove = async () => {
    try {
      // Send update to backend
      const response = await api.put(`/api/requests/${selectedRequest.id}`, {
        status: 'approved',
        dateApproved: new Date().toISOString(),
        approvedBy: user.username,
      });
      // Update local state
      const updatedRequests = requests.map((req) =>
        req.id === selectedRequest.id ? { ...req, ...response.data } : req
      );
      setRequests(updatedRequests);
      setNotification({
        open: true,
        message: 'Job card approved successfully! Request has been processed.',
        severity: 'success',
      });
      handleCloseDialog();
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to approve request. Please try again.',
        severity: 'error',
      });
    }
  }

  const handleReject = () => {
    if (isRejecting) {
      if (!rejectReason.trim()) {
        return
      }

      console.log("Rejected request:", selectedRequest.id, "Reason:", rejectReason)

      const updatedRequests = requests.filter((req) => req.id !== selectedRequest.id)
      setRequests(updatedRequests)

      setNotification({
        open: true,
        message: "Job card rejected. The requester has been notified.",
        severity: "info",
      })

      handleCloseDialog()
    } else {
      setIsRejecting(true)
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "low":
        return "info"
      case "normal":
        return "success"
      case "high":
        return "warning"
      case "critical":
        return "error"
      default:
        return "default"
    }
  }

  const renderEditableField = (label, field, type = "text", options = null) => {
    if (isEditing) {
      if (options) {
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
              value={editedRequest[field] || ""}
              onChange={(e) => handleEditChange(field, e.target.value)}
              label={label}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      }
      return (
        <TextField
          label={label}
          value={editedRequest[field] || ""}
          onChange={(e) => handleEditChange(field, e.target.value)}
          fullWidth
          multiline={type === "textarea"}
          rows={type === "textarea" ? 4 : 1}
          size="small"
        />
      )
    }
    return <Typography variant="body1">{selectedRequest[field]}</Typography>
  }

  // Filtering logic
  const filteredRequests = requests.filter(card => {
    const departmentMatch = departmentFilter === "all" || card.department === departmentFilter
    const statusMatch = statusFilter === "all" || card.status === statusFilter
    return departmentMatch && statusMatch
  })

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Department Approvals
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/department-history")}
        >
          Department History
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={departmentFilter}
            label="Department"
            onChange={e => setDepartmentFilter(e.target.value)}
          >
            {departmentOptions.map(dep => (
              <MenuItem key={dep} value={dep}>{dep}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {filteredRequests.map(card => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <Card
              sx={{ cursor: "pointer", transition: "0.2s", "&:hover": { boxShadow: 6 } }}
              onClick={() => handleViewDetails(card)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {statusIcon[card.status] || <Assignment color="action" />}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {card.title || "Untitled"}
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

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Job Card Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box component="form" sx={{ mt: 1 }}>
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      name="date"
                      type="date"
                      value={editedRequest.date || ""}
                      onChange={e => handleEditChange("date", e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        name="department"
                        value={editedRequest.department || ""}
                        onChange={e => handleEditChange("department", e.target.value)}
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
                      value={editedRequest.relatedToProject || ""}
                      onChange={e => handleEditChange("relatedToProject", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="To be signed off by"
                      name="toBeSignedOffBy"
                      value={editedRequest.toBeSignedOffBy || ""}
                      onChange={e => handleEditChange("toBeSignedOffBy", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Client/Brief"
                      name="clientBrief"
                      value={editedRequest.clientBrief || ""}
                      onChange={e => handleEditChange("clientBrief", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="File Location"
                      name="fileLocation"
                      value={editedRequest.fileLocation || ""}
                      onChange={e => handleEditChange("fileLocation", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Estimated Hours"
                      name="estimatedHours"
                      type="number"
                      value={editedRequest.estimatedHours || ""}
                      onChange={e => handleEditChange("estimatedHours", e.target.value)}
                      fullWidth
                      InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Start Time"
                      name="startTime"
                      type="time"
                      value={editedRequest.startTime || ""}
                      onChange={e => handleEditChange("startTime", e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Due Date"
                      name="dueDate"
                      type="date"
                      value={editedRequest.dueDate || ""}
                      onChange={e => handleEditChange("dueDate", e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Title & Date Completed"
                      name="title"
                      value={editedRequest.title || ""}
                      onChange={e => handleEditChange("title", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notes/Job Details"
                      name="notes"
                      value={editedRequest.notes || ""}
                      onChange={e => handleEditChange("notes", e.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="End Time"
                      name="endTime"
                      type="time"
                      value={editedRequest.endTime || ""}
                      onChange={e => handleEditChange("endTime", e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Hrs"
                      name="hrs"
                      type="number"
                      value={editedRequest.hrs || ""}
                      onChange={e => handleEditChange("hrs", e.target.value)}
                      fullWidth
                      InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Contact No"
                      name="contactNo"
                      value={editedRequest.contactNo || ""}
                      onChange={e => handleEditChange("contactNo", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Typography variant="h6">{selectedRequest.title}</Typography>
                  <Typography>Department: {selectedRequest.department}</Typography>
                  <Typography>Status: {selectedRequest.status}</Typography>
                  <Typography>Requested By: {selectedRequest.requestedBy}</Typography>
                  <Typography>Date Submitted: {selectedRequest.dateSubmitted}</Typography>
                  <Typography>Notes: {selectedRequest.notes}</Typography>
                  <Typography>Notes: {selectedRequest.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {isEditing ? (
            <>
              <Button onClick={handleEditToggle} startIcon={<CloseIcon />}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} variant="contained" startIcon={<SaveIcon />}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleEditToggle} color="info" startIcon={<EditIcon />}>
                Edit
              </Button>
              <Button onClick={handleReject} color="error" startIcon={<RejectIcon />}>
                Reject
              </Button>
              <Button onClick={handleApprove} color="primary" variant="contained" startIcon={<ApproveIcon />}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DepartmentApprovals
