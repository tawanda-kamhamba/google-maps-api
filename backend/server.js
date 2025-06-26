import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Simple test endpoint
app.get("/api/test-simple", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Simple endpoint working",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 