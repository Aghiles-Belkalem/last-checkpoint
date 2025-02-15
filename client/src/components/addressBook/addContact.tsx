import "../Css/addContact.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddContact = () => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setError("Vous devez être connecté");
      navigate("/login");
      return;
    }

    let userId: number | null = null;
    let userEmail: string | null = null;

    try {
      const parsedUser = JSON.parse(user);
      userId = parsedUser?.id || null;
      userEmail = parsedUser?.email || null;
    } catch (error) {
      console.error("Erreur lors du parsing de l'utilisateur :", error);
      setError("Erreur de récupération des informations utilisateur");
      setLoading(false);
      return;
    }

    if (!userId || !userEmail) {
      setError("Utilisateur non trouvé ou mal formaté.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId.toString());
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("mail", mail);
    formData.append("address", address);
    formData.append("phone_number", phone_number);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        navigate("/contactList");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Échec de l'ajout du contact");
      }
    } catch (err) {
      console.error("Erreur pendant l'envoi du formulaire :", err);
      setError("Erreur de connexion, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-contact-form">
      <h1>Ajouter un nouveau contact</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">Prénom:</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Nom:</label>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mail">Email:</label>
          <input
            type="email"
            id="mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Adresse:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Téléphone:</label>
          <input
            type="tel"
            id="phone_number"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo" className="custom-file-upload">
            Choisir une photo
          </label>
          <input
            className="input-img"
            type="file"
            id="photo"
            onChange={(e) =>
              setPhoto(e.target.files ? e.target.files[0] : null)
            }
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "button-loading" : ""}
        >
          {loading ? "Ajout en cours..." : "Ajouter le contact"}
        </button>
      </form>
    </main>
  );
};

export default AddContact;
