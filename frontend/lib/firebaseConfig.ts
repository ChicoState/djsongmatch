import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-u5PmDyRfyRFy9u-I1S97VCfemBRFqIY",
  authDomain: "djsongmatch-d9f80.firebaseapp.com",
  projectId: "djsongmatch-d9f80",
  storageBucket: "djsongmatch-d9f80.firebasestorage.app",
  messagingSenderId: "923821062550",
  appId: "1:923821062550:web:b046e7edb8ddc0f351c5b7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
