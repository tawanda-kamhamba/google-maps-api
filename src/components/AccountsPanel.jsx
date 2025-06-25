"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Search, FileDownload } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../utils/api";

// Mock data will be used as a fallback
import mockApprovedRequests from "../data/approvedRequests";
import mockRejectedRequests from "../data/rejectedRequests";
import mockDisbursedRequests from "../data";

const AccountsPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [disbursedRequests, setDisbursedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Report filters
  const [reportFilters, setReportFilters] = useState({
    startDate: null,
    endDate: null,
    departments: [],
    includeRejected: false,
    searchTerm: "",
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const [pendingRes, disbursedRes, rejectedRes] = await Promise.all([
          api.get("/api/accounts/pending"),
          api.get("/api/accounts/disbursed"),
          api.get("/api/accounts/rejected"),
        ]);
        setPendingRequests(pendingRes.data);
        setDisbursedRequests(disbursedRes.data);
        setRejectedRequests(rejectedRes.data);
      } catch (error) {
        console.error("Failed to fetch account data, using mock data as fallback:", error);
        setNotification({
          open: true,
          message: "Could not connect to the server. Displaying sample data.",
          severity: "warning",
        });
        // Fallback to mock data
        setPendingRequests(mockApprovedRequests);
        setDisbursedRequests(mockDisbursedRequests);
        setRejectedRequests(mockRejectedRequests);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
    setReceiptSubmitted(request.receiptSubmitted || false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleProcessFunds = async () => {
    if (!selectedRequest) return;

    try {
      const response = await api.post(`/api/accounts/process/${selectedRequest.id}`, {
        receiptSubmitted,
      });

      // Update local state from the response
      const updatedRequest = response.data;
      setPendingRequests(pendingRequests.filter((req) => req.id !== updatedRequest.id));
      setDisbursedRequests([updatedRequest, ...disbursedRequests]);

      setNotification({
        open: true,
        message: "Funds processed successfully!",
        severity: "success",
      });

      handleCloseDialog();
    } catch (error) {
      console.error("Failed to process funds:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to process funds.",
        severity: "error",
      });
    }
  };

  const handleOpenReportDialog = () => {
    setOpenReportDialog(true);
  };

  const handleCloseReportDialog = () => {
    setOpenReportDialog(false);
  };

  const handleGenerateReport = () => {
    // In a real app, you would generate and download a report based on filters
    console.log("Generating report with filters:", reportFilters);

    // Show notification
    setNotification({
      open: true,
      message: "Report generated successfully!",
      severity: "success",
    });

    handleCloseReportDialog();
  };

  const handleFilterChange = (field, value) => {
    setReportFilters({
      ...reportFilters,
      [field]: value,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4">Accounts Management</Typography>
          <Button
            variant="outlined"
            startIcon={<FileDownload />}
            onClick={handleOpenReportDialog}
          >
            Generate Report
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Pending Disbursements" />
          <Tab label="Disbursed Funds" />
          <Tab label="Rejected Requests" />
        </Tabs>

        {/* Pending Disbursements Tab */}
        {tabValue === 0 && (
          <>
            {pendingRequests.length === 0 ? (
              <Typography variant="body1">No pending disbursements.</Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Requested By</TableCell>
                      <TableCell>Date Approved</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>{request.dateApproved}</TableCell>
                        <TableCell>${request.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleViewDetails(request)}
                          >
                            Process
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Disbursed Funds Tab */}
        {tabValue === 1 && (
          <>
            {disbursedRequests.length === 0 ? (
              <Typography variant="body1">No disbursed funds.</Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Requested By</TableCell>
                      <TableCell>Date Disbursed</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Receipt</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {disbursedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>{request.dateDisbursed}</TableCell>
                        <TableCell>${request.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              request.receiptSubmitted ? "Submitted" : "Pending"
                            }
                            color={
                              request.receiptSubmitted ? "success" : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(request)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {/* Rejected Requests Tab */}
        {tabValue === 2 && (
          <>
            {rejectedRequests.length === 0 ? (
              <Typography variant="body1">No rejected requests.</Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Request ID</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Requested By</TableCell>
                      <TableCell>Date Rejected</TableCell>
                      <TableCell>Rejected By</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rejectedRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.title}</TableCell>
                        <TableCell>{request.department}</TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>{request.dateRejected}</TableCell>
                        <TableCell>{request.rejectedBy}</TableCell>
                        <TableCell>${request.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewDetails(request)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>

      {/* Request Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              {tabValue === 0 ? "Process Funds" : "Request Details"}:{" "}
              {selectedRequest.title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">Requested By:</Typography>
                    <Typography variant="body1">
                      {selectedRequest.requestedBy}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">Department:</Typography>
                    <Typography variant="body1">
                      {selectedRequest.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2">Date Requested:</Typography>
                    <Typography variant="body1">
                      {selectedRequest.dateRequested}
                    </Typography>
                  </Grid>

                  {selectedRequest.dateApproved && (
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2">
                        Date Approved:
                      </Typography>
                      <Typography variant="body1">
                        {selectedRequest.dateApproved}
                      </Typography>
                    </Grid>
                  )}

                  {selectedRequest.approvedBy && (
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2">Approved By:</Typography>
                      <Typography variant="body1">
                        {selectedRequest.approvedBy}
                      </Typography>
                    </Grid>
                  )}

                  {selectedRequest.dateDisbursed && (
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2">
                        Date Disbursed:
                      </Typography>
                      <Typography variant="body1">
                        {selectedRequest.dateDisbursed}
                      </Typography>
                    </Grid>
                  )}

                  {selectedRequest.rejectionReason && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">
                        Rejection Reason:
                      </Typography>
                      <Typography variant="body1">
                        {selectedRequest.rejectionReason}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Requested Items
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Cost</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRequest.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          ${item.estimatedCost.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${(item.quantity * item.estimatedCost).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        ${selectedRequest.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {tabValue === 0 && (
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={receiptSubmitted}
                        onChange={(e) => setReceiptSubmitted(e.target.checked)}
                      />
                    }
                    label="Receipt Submitted"
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {tabValue === 0 && (
                <Button
                  onClick={handleProcessFunds}
                  color="primary"
                  variant="contained"
                >
                  Process Funds
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog
        open={openReportDialog}
        onClose={handleCloseReportDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate Financial Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Report Filters
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Search by Title or Requester"
                  value={reportFilters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Start Date"
                    value={reportFilters.startDate}
                    onChange={(date) => handleFilterChange("startDate", date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="End Date"
                    value={reportFilters.endDate}
                    onChange={(date) => handleFilterChange("endDate", date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </Grid>
              </LocalizationProvider>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Departments:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[
                    "IT",
                    "HR",
                    "Finance",
                    "Marketing",
                    "Operations",
                    "Sales",
                    "Engineering",
                  ].map((dept) => (
                    <Chip
                      key={dept}
                      label={dept}
                      onClick={() => {
                        const departments = [...reportFilters.departments];
                        if (departments.includes(dept)) {
                          handleFilterChange(
                            "departments",
                            departments.filter((d) => d !== dept)
                          );
                        } else {
                          handleFilterChange("departments", [
                            ...departments,
                            dept,
                          ]);
                        }
                      }}
                      color={
                        reportFilters.departments.includes(dept)
                          ? "primary"
                          : "default"
                      }
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={reportFilters.includeRejected}
                      onChange={(e) =>
                        handleFilterChange("includeRejected", e.target.checked)
                      }
                    />
                  }
                  label="Include Rejected Requests"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog}>Cancel</Button>
          <Button
            onClick={handleGenerateReport}
            color="primary"
            variant="contained"
            startIcon={<FileDownload />}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountsPanel;
