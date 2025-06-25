"use client"

import React from "react"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  alpha,
} from "@mui/material"
import {
  RequestPage,
  Approval,
  AccountBalance,
  History,
  TrendingUp,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Assignment,
  Notifications,
  ArrowUpward,
  ArrowDownward,
  AccountBalanceWallet,
} from "@mui/icons-material"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

// Mock data for dashboard statistics - THIS WILL BE REPLACED
const mockStats = {
  user: {
    totalRequests: 12,
    pendingRequests: 3,
    approvedRequests: 7,
    rejectedRequests: 2,
    thisWeekRequests: 2,
    avgProcessingTime: "2.5 days",
  },
  department_head: {
    pendingApprovals: 8,
    approvedToday: 5,
    rejectedToday: 1,
    totalThisWeek: 24,
    avgApprovalTime: "1.2 days",
    departmentProgress: 75,
  },
  accounts: {
    pendingDisbursements: 15,
    processedToday: 12,
    totalAmount: 45000,
    thisWeekAmount: 18500,
    avgProcessingTime: "0.8 days",
    completionRate: 92,
  },
}

const recentActivities = [
  { id: 1, action: "Job Card #2950 approved", time: "2 hours ago", type: "approved" },
  { id: 2, action: "New request from Jane Doe", time: "4 hours ago", type: "pending" },
  { id: 3, action: "Job Card #2948 rejected", time: "1 day ago", type: "rejected" },
  { id: 4, action: "Disbursement completed", time: "1 day ago", type: "completed" },
  { id: 5, action: "Job Card #2947 approved", time: "2 days ago", type: "approved" },
]

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`/api/dashboard/stats?role=${user.role}&username=${user.username}`)
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Keep using mock stats as a fallback in case of error
        setStats(mockStats[user.role] || {})
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    return () => clearInterval(timer)
  }, [user.role])

  // const stats = mockStats[user.role] || {}

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "approved":
        return <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
      case "rejected":
        return <Cancel sx={{ color: "#ef4444", fontSize: 20 }} />
      case "pending":
        return <Pending sx={{ color: "#f59e0b", fontSize: 20 }} />
      case "completed":
        return <Assignment sx={{ color: "#3b82f6", fontSize: 20 }} />
      default:
        return <Notifications sx={{ fontSize: 20 }} />
    }
  }

  // Clean StatCard component matching the screenshot design
  const StatCard = ({ title, value, icon, isHighlighted = false, progress = null }) => (
    <Card
      sx={{
        background: isHighlighted ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#ffffff",
        borderRadius: 3,
        border: isHighlighted ? "none" : "1px solid #e5e7eb",
        boxShadow: isHighlighted ? "0 10px 25px rgba(16, 185, 129, 0.2)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isHighlighted ? "0 15px 35px rgba(16, 185, 129, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: isHighlighted ? "rgba(255,255,255,0.9)" : "#6b7280",
                fontSize: "0.875rem",
                fontWeight: 500,
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: isHighlighted ? "white" : "#111827",
                fontSize: { xs: "1.875rem", sm: "2.25rem" },
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box sx={{ position: "relative" }}>
            {progress !== null ? (
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={50}
                  thickness={4}
                  sx={{
                    color: isHighlighted ? "rgba(255,255,255,0.8)" : "#10b981",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: isHighlighted ? "rgba(255,255,255,0.9)" : "#10b981",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                    }}
                  >
                    {progress}%
                  </Typography>
                </Box>
              </Box>
            ) : (
              React.cloneElement(icon, {
                sx: {
                  fontSize: 40,
                  color: isHighlighted ? "rgba(255,255,255,0.9)" : "#10b981",
                },
              })
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  // Clean Card component
  const CleanCard = ({ children, sx = {}, ...props }) => (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        background: "#ffffff",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  )

  const renderUserDashboard = () => (
    <>
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total jobs" value={stats.totalRequests} icon={<Assignment />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="In process" value={stats.pendingRequests} icon={<Schedule />} isHighlighted={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Assigned" value={stats.approvedRequests} icon={<CheckCircle />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Closed" value={stats.rejectedRequests} icon={<CheckCircle />} />
        </Grid>
      </Grid>

      {/* Progress and Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CleanCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "600", mb: 3, color: "#111827" }}>
                Order statistics
              </Typography>

              {/* Tab-like buttons */}
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: "#10b981",
                    color: "white",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 500,
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  Daily
                </Button>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: "#6b7280",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 500,
                  }}
                >
                  Weekly
                </Button>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: "#6b7280",
                    textTransform: "none",
                    borderRadius: 2,
                    fontWeight: 500,
                  }}
                >
                  Monthly
                </Button>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={75}
                    size={120}
                    thickness={8}
                    sx={{
                      color: "#10b981",
                      "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                      },
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 40, color: "#10b981" }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<RequestPage />}
                  onClick={() => navigate("/request")}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#10b981",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  New Request
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => navigate("/history")}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#d1d5db",
                    color: "#6b7280",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#10b981",
                      color: "#10b981",
                      backgroundColor: alpha("#10b981", 0.05),
                    },
                  }}
                >
                  View History
                </Button>
              </Box>
            </CardContent>
          </CleanCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <CleanCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "600", color: "#111827" }}>
                  Wallet balance
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center", py: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <AccountBalanceWallet sx={{ fontSize: 60, color: "#10b981" }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "#111827",
                    mb: 1,
                  }}
                >
                  $ 11,504.38
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Success Rate
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "600", color: "#10b981" }}>
                  {Math.round((stats.approvedRequests / stats.totalRequests) * 100)}%
                </Typography>
              </Box>
            </CardContent>
          </CleanCard>
        </Grid>
      </Grid>
    </>
  )

  const renderDepartmentHeadDashboard = () => (
    <>
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={<Pending />} isHighlighted={true} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Approved Today" value={stats.approvedToday} icon={<CheckCircle />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="This Week" value={stats.totalThisWeek} icon={<TrendingUp />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Department Progress"
            value={`${stats.departmentProgress}%`}
            icon={<CircularProgress />}
            progress={stats.departmentProgress}
          />
        </Grid>
      </Grid>

      {/* Actions and Progress */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CleanCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "600", mb: 3, color: "#111827" }}>
                Department Overview - {user.department}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  Approval Progress This Week
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.departmentProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#f3f4f6",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#10b981",
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "#6b7280", mt: 1, display: "block" }}>
                  {stats.departmentProgress}% of weekly targets completed
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Approval />}
                  onClick={() => navigate("/approvals")}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#10b981",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  Review Approvals
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => navigate("/history")}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#d1d5db",
                    color: "#6b7280",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#10b981",
                      color: "#10b981",
                      backgroundColor: alpha("#10b981", 0.05),
                    },
                  }}
                >
                  Department History
                </Button>
              </Box>
            </CardContent>
          </CleanCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <CleanCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "600", mb: 3, color: "#111827" }}>
                Performance Metrics
              </Typography>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#10b981",
                    mb: 1,
                  }}
                >
                  {stats.avgApprovalTime}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Avg Approval Time
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Efficiency
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ArrowUpward sx={{ fontSize: 16, color: "#10b981" }} />
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "#10b981" }}>
                    12%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Response Time
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ArrowDownward sx={{ fontSize: 16, color: "#10b981" }} />
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "#10b981" }}>
                    8%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CleanCard>
        </Grid>
      </Grid>
    </>
  )

  const renderAccountsDashboard = () => (
    <>
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Disbursements"
            value={stats.pendingDisbursements}
            icon={<AccountBalance />}
            isHighlighted={true}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Processed Today" value={stats.processedToday} icon={<CheckCircle />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Amount" value={`$${stats.totalAmount?.toLocaleString()}`} icon={<TrendingUp />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<CircularProgress />}
            progress={stats.completionRate}
          />
        </Grid>
      </Grid>

      {/* Actions and Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CleanCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "600", mb: 3, color: "#111827" }}>
                Financial Overview
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: "#6b7280", mb: 1 }}>
                  Weekly Processing Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.thisWeekAmount / 25000) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#f3f4f6",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#10b981",
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "#6b7280", mt: 1, display: "block" }}>
                  ${stats.thisWeekAmount?.toLocaleString()} processed this week
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AccountBalance />}
                  onClick={() => navigate("/accounts")}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#10b981",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  Process Funds
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => navigate("/history")}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#d1d5db",
                    color: "#6b7280",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#10b981",
                      color: "#10b981",
                      backgroundColor: alpha("#10b981", 0.05),
                    },
                  }}
                >
                  Transaction History
                </Button>
              </Box>
            </CardContent>
          </CleanCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <CleanCard sx={{ height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "600", mb: 3, color: "#111827" }}>
                Processing Metrics
              </Typography>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#10b981",
                    mb: 1,
                  }}
                >
                  {stats.avgProcessingTime}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Avg Processing Time
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Efficiency
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ArrowUpward sx={{ fontSize: 16, color: "#10b981" }} />
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "#10b981" }}>
                    15%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Error Rate
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ArrowDownward sx={{ fontSize: 16, color: "#10b981" }} />
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "#10b981" }}>
                    3%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </CleanCard>
        </Grid>
      </Grid>
    </>
  )

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f9fafb",
        p: 3,
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "400",
                mb: 1,
                color: "#111827",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Hello,
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#10b981",
                fontSize: { xs: "2rem", sm: "2.5rem" },
                mb: 1,
              }}
            >
              {user.username} 👋
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280", mb: 1 }}>
              Location: Austria | Member since: 20 Aug 2024 | Registered as: Individual
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Chip
              label={user.role.replace("_", " ").toUpperCase()}
              sx={{
                bgcolor: "#10b981",
                color: "white",
                fontWeight: "600",
                mb: 2,
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#10b981",
                  color: "white",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Jobs
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  color: "#6b7280",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                Direct booking
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  color: "#6b7280",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                Service packages
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Role-specific Dashboard Content */}
      {user.role === "user" && renderUserDashboard()}
      {user.role === "department_head" && renderDepartmentHeadDashboard()}
      {user.role === "accounts" && renderAccountsDashboard()}

      {/* Recent Activities */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <CleanCard>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "600", color: "#111827" }}>
                  Recent transactions
                </Typography>
                <Button
                  variant="text"
                  sx={{
                    color: "#6b7280",
                    textTransform: "none",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                >
                  View all
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: alpha("#10b981", 0.05),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{getActivityIcon(activity.type)}</ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.time}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                          color: "#111827",
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          color: "#6b7280",
                        }}
                      />
                      {activity.type === "approved" && (
                        <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 500 }}>
                          -$ 135.00
                        </Typography>
                      )}
                      {activity.type === "completed" && (
                        <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 500 }}>
                          -$ 66.00
                        </Typography>
                      )}
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </CleanCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
