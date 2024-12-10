import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom"; // Utilise uniquement Routes et Route ici
import { auth, db } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import Profile from "./profile"; // Import du composant Profile

function App() {
  // États pour inscription/connexion
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);

  // Gestion de l'inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      setUser(userCredential.user);
      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      alert("Erreur : " + error.message);
    }
  };

  // Gestion de la connexion
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        signInEmail,
        signInPassword
      );
      setUser(userCredential.user);
      alert("Connexion réussie !");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message);
      alert("Erreur : " + error.message);
    }
  };

  // Gestion de la déconnexion
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("Déconnexion réussie !");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error.message);
    }
  };

  // Ajouter un nouveau message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Veuillez entrer un message valide !");
      return;
    }

    try {
      if (editingMessageId) {
        await updateDoc(doc(db, "Messages", editingMessageId), {
          texte: message.trim(),
          timestamp: serverTimestamp(),
        });
        alert("Message modifié !");
        setEditingMessageId(null);
      } else {
        await addDoc(collection(db, "Messages"), {
          texte: message.trim(),
          auteurId: user.uid,
          auteurNom: user.email,
          timestamp: serverTimestamp(),
        });
        alert("Message envoyé !");
      }
      setMessage("");
    } catch (error) {
      console.error("Erreur :", error.message);
      alert("Erreur : Impossible d'envoyer le message.");
    }
  };

  // Récupérer les messages
  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });
    return () => unsubscribe();
  }, []);

  const handleEditMessage = (msg) => {
    setMessage(msg.texte);
    setEditingMessageId(msg.id);
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {!user ? (
                <div>
                  {/* Formulaire d'inscription */}
                  <h2>Inscription</h2>
                  <form onSubmit={handleSignUp}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                    <button type="submit">S'inscrire</button>
                  </form>

                  {/* Formulaire de connexion */}
                  <h2>Connexion</h2>
                  <form onSubmit={handleSignIn}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                    <button type="submit">Se connecter</button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2>Bienvenue, {user.email}</h2>
                  <button onClick={handleSignOut}>Déconnexion</button>
                  <Link to="/profile">
                    <button>Aller au profil</button>
                  </Link>

                  {/* Formulaire pour envoyer un message */}
                  <form onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      placeholder="Écrivez votre message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                    <button type="submit">Envoyer</button>
                  </form>

                  {/* Liste des messages */}
                  <ul>
                    {messages.map((msg) => (
                      <li key={msg.id}>
                        <strong>{msg.auteurNom} :</strong> {msg.texte}{" "}
                        <span style={{ fontSize: "0.8em", color: "gray" }}>
                          ({msg.timestamp
                            ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                            : "Date inconnue"})
                        </span>
                        {msg.auteurId === user.uid && (
                          <button onClick={() => handleEditMessage(msg)}>Modifier</button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
