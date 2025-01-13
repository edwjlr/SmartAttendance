import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDL3whVAlhEgPNHHCtFREBbo8M0KaXF9d4",
  authDomain: "graphic-charter-415020.firebaseapp.com",
  projectId: "graphic-charter-415020",
  storageBucket: "graphic-charter-415020.appspot.com",
  messagingSenderId: "927957605783",
  appId: "1:927957605783:web:fc6456e14b8fa30e35b8d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);
export const storage = getStorage(app);

export { auth, firestore };