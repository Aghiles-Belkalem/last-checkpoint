import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mail: email, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Connexion échouée");
        return;
      }

      const data = await response.json();
      const token = data.token;
      const user = data.user;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify({ id: user.id, email: user.mail }),
      );

      navigate("/contactList");
    } catch (err) {
      setError("Erreur de connexion, veuillez réessayer");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Bienvenue</h1>
            <p className="login-subtitle">Connectez-vous à votre compte</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="login-error-message">{error}</div>}

            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Se connecter
            </button>
          </form>

          <div className="login-signup-link">
            <p className="login-text">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="signup-button"
              >
                Créez-en un ici
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
