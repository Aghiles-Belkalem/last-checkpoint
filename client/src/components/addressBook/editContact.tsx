import "../Css/editContact.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Contact = {
  id: number;
  user_id: number;
  firstname: string;
  lastname: string;
  mail: string;
  address: string;
  phone_number: string;
  photo_url: string | null;
};

export default function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchContactDetails();
  }, [id, navigate]);

  const fetchContactDetails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token || !id) {
        setError("Non authentifié");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setContact(data);
      } else {
        setError("Échec de la récupération du contact");
      }
    } catch (err) {
      setError("Erreur de connexion, veuillez réessayer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (contact) {
      setContact({
        ...contact,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target.files?.[0];
    if (fileInput) {
      setFile(fileInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || !contact) {
      setError("Non authentifié");
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("firstname", contact.firstname);
      formData.append("lastname", contact.lastname);
      formData.append("mail", contact.mail);
      formData.append("phone_number", contact.phone_number);
      formData.append("address", contact.address);

      if (file) {
        formData.append("photo", file);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact/${contact.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        navigate("/contactList");
      } else {
        setError("Erreur lors de la mise à jour du contact");
      }
    } catch (err) {
      setError("Erreur de connexion, veuillez réessayer");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <main className="edit-contact-container">
      <header>
        <h1>Modifier le Contact</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      {contact ? (
        <form onSubmit={handleSubmit} className="edit-contact-form">
          <div className="form-group">
            <label htmlFor="firstname">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={contact.firstname}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={contact.lastname}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mail">Email</label>
            <input
              type="email"
              id="mail"
              name="mail"
              value={contact.mail}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Téléphone</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={contact.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresse</label>
            <input
              type="text"
              id="address"
              name="address"
              value={contact.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="photo-upload">
            <label htmlFor="file-upload" className="custom-file-upload">
              Télécharger une photo
            </label>
            <input
              id="file-upload"
              type="file"
              className="input-img"
              onChange={handleFileChange}
            />
            {contact.photo_url && <img src={contact.photo_url} alt="Profil" />}
          </div>

          <button type="submit" className="submit-button">
            Enregistrer
          </button>
        </form>
      ) : (
        <p>Ce contact n'existe pas.</p>
      )}
    </main>
  );
}
