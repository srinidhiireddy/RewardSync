/* ============================================
   REWARDSYNC — Firebase Configuration
   ============================================ */

// Import the functions you need from the SDKs you need
// (Using CDN-compatible syntax for the dashboard)

const firebaseConfig = {
  apiKey: "AIzaSyCxT4IEOw5tmGINCHBaG0K0-UapeaYrKFI",
  authDomain: "rewardsync-7e513.firebaseapp.com",
  projectId: "rewardsync-7e513",
  storageBucket: "rewardsync-7e513.firebasestorage.app",
  messagingSenderId: "1017582581404",
  appId: "1:1017582581404:web:a06b8649c44498e6941f59",
  measurementId: "G-710YPVMT04"
};

// Initialize Firebase (Compat mode for easier script integration)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Export for global use
window.auth = auth;
window.db = db;
