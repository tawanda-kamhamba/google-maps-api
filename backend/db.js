import admin from "firebase-admin";
import { readFileSync } from "fs";

let serviceAccount;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    // Handle the case where the JSON might have escaped newlines
    const credentialsString = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    serviceAccount = JSON.parse(credentialsString);
    console.log("Using environment variable for Firestore credentials");
  } else {
    serviceAccount = JSON.parse(
      readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
    );
    console.log("Using local service account file for Firestore credentials");
  }
} catch (error) {
  console.error("Error loading Firestore credentials:", error);
  throw new Error("Failed to load Firestore credentials");
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
  throw error;
}

const db = admin.firestore();

export default db;