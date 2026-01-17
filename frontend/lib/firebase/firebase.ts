import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import firebaseConfig from "./config";

// Initialize Firebase (singleton pattern to prevent multiple initializations)
let firebaseApp: FirebaseApp;
let auth: Auth;

if (typeof window !== "undefined") {
  // Client-side only
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  auth = getAuth(firebaseApp);
}

export { firebaseApp, auth };
