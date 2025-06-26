import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { TrendingUp, People, Assignment, CalendarToday } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DepartmentHistory() {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const [jobCards, setJobCards] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Fetch job cards for this department
    // Replace with real API call
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => setJobCards(data.filter(card => card.department === user.department)));
  }, [user.department]);

  // Placeholder stats
  const totalJobs = jobCards.length;
  const completedJobs = jobCards.filter(card => card.status === "approved" || card.status === "completed" || card.status === "closed").length;
  const pendingJobs = jobCards.filter(card => card.status === "pending").length;
  const thisWeek = jobCards.filter(card => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const submitted = new Date(card.dateSubmitted || card.date);
    return submitted >= startOfWeek && submitted <= now;
  }).length;
  const thisMonth = jobCards.filter(card => {
    const now = new Date();
    const submitted = new Date(card.dateSubmitted || card.date);
    return submitted.getMonth() === now.getMonth() && submitted.getFullYear() === now.getFullYear();
  }).length;
  const thisYear = jobCards.filter(card => {
    const now = new Date();
    const submitted = new Date(card.dateSubmitted || card.date);
    return submitted.getFullYear() === now.getFullYear();
  }).length;

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Filters and Actions */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={dateRange[0]}
            onChange={date => setDateRange([date, dateRange[1]])}
            renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 140 }} />}
          />
          <DatePicker
            label="End Date"
            value={dateRange[1]}
            onChange={date => setDateRange([dateRange[0], date])}
            renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 140 }} />}
          />
        </LocalizationProvider>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={e => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined">Export</Button>
      </Paper>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Department Jobcard History
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white" }}>
            <CardContent>
              <Typography variant="subtitle2">Total Jobcards</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{totalJobs}</Typography>
              <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />
              <Typography variant="body2">All time</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Completed</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{completedJobs}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">All time</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Pending</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{pendingJobs}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">All time</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">This Week</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{thisWeek}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">New jobcards</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Weekly" />
        <Tab label="Monthly" />
        <Tab label="Yearly" />
      </Tabs>
      {/* Placeholder for chart/analytics - you can add a chart library here */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {tab === 0 && "Weekly Review"}
          {tab === 1 && "Monthly Review"}
          {tab === 2 && "Yearly Review"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (Chart/analytics placeholder - integrate with chart library for real data)
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
          [Chart goes here]
        </Box>
      </Paper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Jobcard Orders List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Num</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Hrs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobCards.map((card, idx) => (
              <TableRow key={card.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{card.relatedToProject}</TableCell>
                <TableCell>{card.dateSubmitted ? new Date(card.dateSubmitted).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  <Chip label={card.status} color={card.status === "approved" || card.status === "completed" ? "success" : card.status === "pending" ? "warning" : "default"} size="small" />
                </TableCell>
                <TableCell>{card.requestedBy}</TableCell>
                <TableCell>{card.hrs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DepartmentHistory; 