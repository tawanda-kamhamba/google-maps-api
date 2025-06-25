import express from "express";
import db from "./db.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Create a job card
app.post("/api/requests", async (req, res) => {
  try {
    const docRef = await db.collection("jobCards").add(req.body);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all job cards
app.get("/api/requests", async (req, res) => {
  try {
    const snapshot = await db.collection("jobCards").get();
    const jobCards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobCards);
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