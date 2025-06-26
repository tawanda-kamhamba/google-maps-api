import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firestore with error handling
let db = null;
let firestoreInitialized = false;

async function initializeFirestore() {
  try {
    const admin = await import("firebase-admin");
    const { readFileSync } = await import("fs");

    let serviceAccount;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
      serviceAccount = JSON.parse(credentialsString);
      console.log("Using environment variable for Firestore credentials");
    } else {
      serviceAccount = JSON.parse(
        readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
      );
      console.log("Using local service account file for Firestore credentials");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
    
    db = admin.firestore();
    firestoreInitialized = true;
    console.log("Firestore initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
    firestoreInitialized = false;
  }
}

// Initialize Firestore on startup
initializeFirestore();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    firestore: firestoreInitialized ? "connected" : "disconnected"
  });
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
  if (!firestoreInitialized || !db) {
    return res.status(500).json({ 
      status: "ERROR", 
      message: "Firestore not initialized",
      error: "Firestore connection failed during startup"
    });
  }

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
  if (!firestoreInitialized || !db) {
    return res.status(500).json({ 
      message: "Firestore not available",
      details: "Database connection failed"
    });
  }

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
  if (!firestoreInitialized || !db) {
    return res.status(500).json({ 
      message: "Firestore not available",
      details: "Database connection failed"
    });
  }

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