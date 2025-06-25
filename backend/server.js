import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Test endpoint to check if Firestore is accessible
app.get("/api/test-firestore", async (req, res) => {
  try {
    console.log("Testing Firestore connection...");
    // Try to access Firestore without reading data
    const collections = await db.listCollections();
    console.log("Firestore connection successful, collections:", collections.map(c => c.id));
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
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ 
      message: err.message,
      details: "Error connecting to Firestore or fetching data"
    });
  }
});

// Get job card history for a specific user
app.get("/api/history", async (req, res) => {
  try {
    const { username } = req.query;
    const snapshot = await db.collection("jobCards")
      .where("requestedBy", "==", username)
      .get();
    const jobCards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending disbursements
app.get("/api/accounts/pending", async (req, res) => {
  try {
    const snapshot = await db.collection("jobCards")
      .where("status", "==", "approved")
      .where("disbursed", "==", false)
      .get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get disbursed funds
app.get("/api/accounts/disbursed", async (req, res) => {
  try {
    const snapshot = await db.collection("jobCards")
      .where("disbursed", "==", true)
      .get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get rejected requests
app.get("/api/accounts/rejected", async (req, res) => {
  try {
    const snapshot = await db.collection("jobCards")
      .where("status", "==", "rejected")
      .get();
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Process funds for a request
app.post("/api/accounts/process/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptSubmitted } = req.body;
    
    const docRef = db.collection("jobCards").doc(id);
    await docRef.update({
      disbursed: true,
      dateDisbursed: new Date().toISOString(),
      receiptSubmitted: receiptSubmitted || false,
      status: "completed"
    });
    
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("username", "==", username)
      .where("password", "==", password)
      .where("role", "==", role)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // For simplicity, return the first matching user (never send password in real apps)
    const user = snapshot.docs[0].data();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));