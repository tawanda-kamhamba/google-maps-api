import express from "express";
import cors from "cors";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Use a path relative to this file, not process.cwd()
const DATA_FILE = path.join(__dirname, "jobCards.json");

// Helper to read job cards
async function readJobCards() {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

// Helper to write job cards
async function writeJobCards(jobCards) {
  try {
    await writeFile(DATA_FILE, JSON.stringify(jobCards, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write job cards:", err);
    throw err;
  }
}

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

// Get all job cards
app.get("/api/requests", async (req, res) => {
  try {
    const jobCards = await readJobCards();
    res.json(jobCards);
  } catch (err) {
    res.status(500).json({ message: "Failed to read job cards", error: err.message });
  }
});

// Create a job card
app.post("/api/requests", async (req, res) => {
  try {
    const jobCards = await readJobCards();
    const newJobCard = { id: Date.now().toString(), ...req.body };
    jobCards.push(newJobCard);
    await writeJobCards(jobCards);
    res.status(201).json({ id: newJobCard.id });
  } catch (err) {
    console.error("Failed to create job card:", err);
    res.status(500).json({ message: "Failed to create job card", error: err.message });
  }
});

// Update a job card (approve, edit, etc.)
app.put("/api/requests/:id", async (req, res) => {
  try {
    const jobCards = await readJobCards();
    console.log('PUT /api/requests/:id called with id:', req.params.id);
    console.log('All job card ids:', jobCards.map(card => card.id));
    const idx = jobCards.findIndex(card => card.id === req.params.id);
    if (idx === -1) {
      console.log('Job card not found for id:', req.params.id);
      return res.status(404).json({ message: "Job card not found" });
    }
    // Update fields from request body
    jobCards[idx] = { ...jobCards[idx], ...req.body };
    await writeJobCards(jobCards);
    res.json(jobCards[idx]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update job card", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 