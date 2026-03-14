import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtcFs29DUJCO7I7Cq8wGlm4YBla-mStwU",
  authDomain: "devlinks-48143.firebaseapp.com",
  projectId: "devlinks-48143",
  storageBucket: "devlinks-48143.firebasestorage.app",
  messagingSenderId: "996153357341",
  appId: "1:996153357341:web:9f43b2c48aa2ebd13702f4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);