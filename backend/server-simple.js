import express from "express";
import db from "./db.js";
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

// Test Firestore connection
app.get("/api/test-firestore", async (req, res) => {
  try {
    console.log("Testing Firestore connection...");
    const collections = await db.listCollections();
    console.log("Firestore connection successful");
    res.json({ 
      status: "OK", 
      message: "Firestore connection successful",
      collections: collections.map(c => c.id)
    });
  } catch (err) {
    console.error("Firestore connection test failed:", err);
    res.status(500).json({ 
      status: "ERROR", 
      message: "Firestore connection failed",
      error: err.message 
    });
  }
});

// Get all job cards
app.get("/api/requests", async (req, res) => {
  try {
    console.log("Fetching all job cards");
    const snapshot = await db.collection("jobCards").get();
    const jobCards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${jobCards.length} job cards`);
    res.json(jobCards);
  } catch (err) {
    console.error("Error fetching job cards:", err);
    res.status(500).json({ 
      message: err.message,
      details: "Error connecting to Firestore or fetching data"
    });
  }
});

// Create a job card
app.post("/api/requests", async (req, res) => {
  try {
    console.log("Creating job card:", req.body);
    const docRef = await db.collection("jobCards").add(req.body);
    console.log("Job card created with ID:", docRef.id);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error("Error creating job card:", err);
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 