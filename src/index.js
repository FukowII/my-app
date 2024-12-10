import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Correction ici
import { auth } from "./Firebase"; // Assure-toi que le fichier "Firebase.js" est correctement configuré
import { BrowserRouter } from "react-router-dom"; // Import de React Router

// Rendu de l'application React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Gestion de l'inscription
const signUpForm = document.getElementById("sign-up-form");
if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("password-signup").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      alert("Erreur : " + error.message);
    }
  });
}

// Gestion de la connexion
const signInForm = document.getElementById("sign-in-form");
if (signInForm) {
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email-signin").value;
    const password = document.getElementById("password-signin").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Connexion réussie !");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      alert("Erreur : " + error.message);
    }
  });
}

// Rapport des performances (facultatif)
reportWebVitals();
