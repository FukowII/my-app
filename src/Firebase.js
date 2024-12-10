import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQHbQfT93MQDZQXz19xykZkdH5XSbYdSo",
  authDomain: "finaux-ece.firebaseapp.com",
  projectId: "finaux-ece",
  storageBucket: "finaux-ece.appspot.com", // Correction ici
  messagingSenderId: "122349965892",
  appId: "1:122349965892:web:5a1c3b1a70a812a2266211",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

