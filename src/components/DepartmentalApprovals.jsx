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
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { AuthContext } from "../context/AuthContext"

// Mock data for demonstration - job card requests
const mockJobCardRequests = [
  {
    id: 1,
    jobCardId: "2950",
    date: "2023-03-10",
    department: "IT",
    relatedToProject: "Website Redesign",
    toBeSignedOffBy: "John Manager",
    clientBrief: "Update company website with new branding and improved UX",
    fileLocation: "/projects/website-redesign/assets",
    estimatedHours: "40",
    startTime: "09:00",
    dueDate: "2023-03-20",
    title: "Website Development Task",
    notes:
      "Need to implement responsive design and optimize for mobile devices. Include SEO improvements and accessibility features.",
    endTime: "17:00",
    hrs: "8",
    contactNo: "+1234567890",
    requestedBy: "Jane Developer",
    dateRequested: "2023-03-10",
    status: "pending",
    urgency: "high",
  },
  {
    id: 2,
    jobCardId: "2951",
    date: "2023-03-11",
    department: "IT",
    relatedToProject: "Database Migration",
    toBeSignedOffBy: "Sarah Tech Lead",
    clientBrief: "Migrate legacy database to new cloud infrastructure",
    fileLocation: "/projects/db-migration/scripts",
    estimatedHours: "60",
    startTime: "08:00",
    dueDate: "2023-03-25",
    title: "Database Migration Project",
    notes: "Critical migration requiring careful planning and testing. Need to ensure zero downtime during transition.",
    endTime: "18:00",
    hrs: "10",
    contactNo: "+1234567891",
    requestedBy: "Mike Database Admin",
    dateRequested: "2023-03-11",
    status: "pending",
    urgency: "critical",
  },
  {
    id: 3,
    jobCardId: "2952",
    date: "2023-03-12",
    department: "IT",
    relatedToProject: "Security Audit",
    toBeSignedOffBy: "Alex Security Officer",
    clientBrief: "Comprehensive security audit of all systems",
    fileLocation: "/security/audit-2023",
    estimatedHours: "25",
    startTime: "10:00",
    dueDate: "2023-03-18",
    title: "Security Assessment",
    notes: "Review all security protocols, update firewall rules, and conduct penetration testing.",
    endTime: "16:00",
    hrs: "6",
    contactNo: "+1234567892",
    requestedBy: "Lisa Security Analyst",
    dateRequested: "2023-03-12",
    status: "pending",
    urgency: "normal",
  },
]

const DepartmentApprovals = () => {
  const { user } = useContext(AuthContext)
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

  useEffect(() => {
    // Filter requests by department
    const filteredRequests = mockJobCardRequests.filter(
      (request) => request.department === user.department && request.status === "pending",
    )
    setRequests(filteredRequests)
  }, [user.department])

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

  const handleSaveEdit = () => {
    // In a real app, you would send this to your API
    console.log("Saved edited request:", editedRequest)

    // Update local state
    const updatedRequests = requests.map((req) => (req.id === editedRequest.id ? editedRequest : req))
    setRequests(updatedRequests)
    setSelectedRequest(editedRequest)
    setIsEditing(false)

    setNotification({
      open: true,
      message: "Request updated successfully!",
      severity: "success",
    })
  }

  const handleApprove = () => {
    // In a real app, you would send this to your API
    console.log("Approved request:", selectedRequest.id)

    // Update local state
    const updatedRequests = requests.filter((req) => req.id !== selectedRequest.id)
    setRequests(updatedRequests)

    setNotification({
      open: true,
      message: "Job card approved successfully! Request has been processed.",
      severity: "success",
    })

    handleCloseDialog()
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Departmental Job Card Approvals
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>JobCard ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Date Requested</TableCell>
              <TableCell>Urgency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{`#${request.jobCardId}`}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.requestedBy}</TableCell>
                <TableCell>{request.dateRequested}</TableCell>
                <TableCell>
                  <Chip label={request.urgency} color={getUrgencyColor(request.urgency)} size="small" />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(request)}
                    startIcon={<ViewIcon />}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Job Card Details
          {!isEditing && (
            <Tooltip title="Edit Request">
              <IconButton onClick={handleEditToggle} sx={{ float: "right" }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2}>
              {/* Request Details */}
              <Grid item xs={12} md={6}>
                {renderEditableField("Title", "title")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderEditableField("JobCard ID", "jobCardId")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderEditableField("Department", "department")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderEditableField("Due Date", "dueDate", "date")}
              </Grid>
              <Grid item xs={12}>
                {renderEditableField("Client Brief", "clientBrief", "textarea")}
              </Grid>
              <Grid item xs={12}>
                {renderEditableField("Notes", "notes", "textarea")}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
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
              <Button onClick={handleCloseDialog}>Close</Button>
              {isRejecting ? (
                <>
                  <TextField
                    label="Rejection Reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1, mx: 1 }}
                  />
                  <Button onClick={() => setIsRejecting(false)}>Cancel</Button>
                  <Button onClick={handleReject} color="error" variant="contained" startIcon={<RejectIcon />}>
                    Confirm Reject
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleReject} color="error" startIcon={<RejectIcon />}>
                    Reject
                  </Button>
                  <Button onClick={handleApprove} color="primary" variant="contained" startIcon={<ApproveIcon />}>
                    Approve
                  </Button>
                </>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DepartmentApprovals
