import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtbiFPSv2dfhqDub7Un-YWjUJ9wvHzBmg",
  authDomain: "el-amigo-de-caldas.firebaseapp.com",
  projectId: "el-amigo-de-caldas",
  storageBucket: "el-amigo-de-caldas.firebasestorage.app",
  messagingSenderId: "948631988653",
  appId: "1:948631988653:web:b8b57f9aa4e599dccf5924"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
