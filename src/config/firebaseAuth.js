import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCxQNVYjn5AlUd8UKqDGKv7l6Z9HCnMTd4",
  authDomain: "e-comerse-project.firebaseapp.com",
  projectId: "e-comerse-project",
  storageBucket: "e-comerse-project.firebasestorage.app",
  messagingSenderId: "916406607079",
  appId: "1:916406607079:web:16ba0e934849f697f21642"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth= getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };