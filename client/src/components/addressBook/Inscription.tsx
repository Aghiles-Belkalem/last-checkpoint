import "../Css/iscription.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Inscription() {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstname || !lastname || !mail || !password) {
      setError("Tous les champs sont requis !");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstname, lastname, mail, password }),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.error || "Une erreur est survenue. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="inscription-container">
      <section className="inscription-content">
        <article>
          <header>
            <h1>Inscription</h1>
            <p>Créez un compte pour accéder à votre carnet d'adresses.</p>
          </header>

          <form onSubmit={handleSubmit}>
            {error && <section className="error-message">{error}</section>}

            <section className="form-group">
              <label htmlFor="firstname">Prénom :</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Entrez votre prénom"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </section>

            <section className="form-group">
              <label htmlFor="lastname">Nom :</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Entrez votre nom"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </section>

            <section className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Entrez votre email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
            </section>

            <section className="form-group">
              <label htmlFor="password">Mot de passe :</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </section>

            <button
              className="button-inscription"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "S'inscrire"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
