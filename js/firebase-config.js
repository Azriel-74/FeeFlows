// ============================================================
//  FeeFlow — js/firebase-config.js
//
//  INSTRUCTIONS:
//  1. Go to https://console.firebase.google.com
//  2. Create a project (or open existing one)
//  3. Go to Project Settings → Your apps → Add a Web App
//  4. Copy the firebaseConfig object Firebase gives you
//  5. Paste it below, replacing the placeholder values
//  6. In Firebase Console → Authentication → Sign-in method
//     → Enable "Email/Password"
//  7. In Firestore Database → Create database (start in test mode)
//  8. Done! Cloud sync will work automatically.
// ============================================================

const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

// Export so firebase-init.js can use it
export default firebaseConfig;
