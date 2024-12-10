import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenue sur l'application</h1>
      <Link to="/profile">
        <button>Aller au profil</button>
      </Link>
    </div>
  );
};

export default Home;
