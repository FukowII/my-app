import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./Firebase"; // Import correct de l'instance app

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState(null); // Fichier sélectionné
  const [profilePictureUrl, setProfilePictureUrl] = useState(""); // URL de l'image
  const auth = getAuth(app);
  const storage = getStorage(app);
  const db = getFirestore(app);

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Récupère les informations utilisateur
          const userDoc = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDoc);
  
          // Si le document utilisateur existe, récupère l'URL de l'image de profil
          if (docSnap.exists() && docSnap.data().profilePicture) {
            setProfilePictureUrl(docSnap.data().profilePicture);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image de profil :", error.message);
        }
      } else {
        alert("Vous devez être connecté pour accéder à cette page.");
        window.location.href = "/";
      }
    });
  }, [db]);
  

  const handleUploadProfilePicture = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    try {
      const user = auth.currentUser;
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, profilePicture);
      const downloadUrl = await getDownloadURL(storageRef);

      setProfilePictureUrl(downloadUrl);

      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { profilePicture: downloadUrl });

      alert("Image de profil mise à jour !");
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error.message);
      alert("Erreur lors du téléchargement de l'image.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Gérer votre image de profil</h2>
      <img
        src={profilePictureUrl || "https://via.placeholder.com/150"}
        alt="Image de profil"
        style={{ width: "150px", height: "150px", borderRadius: "50%", marginBottom: "20px" }}
      />
      <form onSubmit={handleUploadProfilePicture}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit">Télécharger l'image</button>
      </form>
    </div>
  );
};

export default Profile;
