const { initializeApp } =require ("firebase/app");
const { getStorage } =require ("firebase/storage")

const firebaseConfig = {
  apiKey: "AIzaSyBQv9ZxdN_PqSs7ZxqGf-2YIuw7-Tk-8CI",
  authDomain: "streaming-app-99cb0.firebaseapp.com",
  projectId: "streaming-app-99cb0",
  storageBucket: "streaming-app-99cb0.appspot.com",
  messagingSenderId: "376571636911",
  appId: "1:376571636911:web:d338c0286f580f99fb385a",
  measurementId: "G-PCTD46952N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const firebaseStorage =  getStorage(app) 

module.exports = firebaseStorage