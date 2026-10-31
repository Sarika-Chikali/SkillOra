import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A separate named app for server-rendered reads (e.g. the public portfolio
// page). Deliberately never touches firebase/auth — getAuth() expects
// browser persistence (indexedDB/localStorage) that doesn't exist in a
// server/Node runtime, so this app only ever initializes Firestore.
const SERVER_APP_NAME = "server";

function getServerApp() {
  return getApps().find((a) => a.name === SERVER_APP_NAME) || initializeApp(firebaseConfig, SERVER_APP_NAME);
}

export const serverDb = getFirestore(getServerApp());
