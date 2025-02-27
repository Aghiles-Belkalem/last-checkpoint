import "../components/Css/contact.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImgFetched from "../components/addressBook/imgTrack";

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

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchContacts();
  }, [navigate]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        setError("Non authentifié");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const userId = JSON.parse(user).id;
        const userContacts = data.filter(
          (contact: Contact) => contact.user_id === userId,
        );
        setContacts(userContacts);
      } else {
        setError("Échec du chargement des contacts");
      }
    } catch (err) {
      setError("Erreur de connexion, veuillez réessayer");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Non authentifié");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id),
        );
      } else {
        setError("Échec de la suppression du contact");
      }
    } catch (err) {
      setError("Erreur de connexion, veuillez réessayer");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-contact/${id}`);
  };

  const handleAdd = () => {
    navigate("/add-contact");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <main className="contact-list-container">
      <header className="contact-list-header">
        <h1>Mes Contacts</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="contact-logout-button"
        >
          Se déconnecter
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="contact-add-button"
        >
          Ajouter un contact
        </button>
      </header>

      {error && <div className="contact-error-message">{error}</div>}

      <section className="contact-list">
        {contacts.length === 0 ? (
          <p>Aucun contact disponible</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <div className="contact-card-header">
                {contact.photo_url ? (
                  <ImgFetched
                    photo_url={contact.photo_url}
                    token={`${localStorage.getItem("token")}`}
                  />
                ) : (
                  <div className="contact-photo-placeholder">
                    <span>{contact.firstname[0]}</span>
                  </div>
                )}
                <div className="contact-info">
                  <h3 className="contact-name">
                    {contact.firstname} {contact.lastname}
                  </h3>
                  <p className="contact-email">{contact.mail}</p>
                </div>
              </div>

              <div className="contact-details">
                <p>📞 {contact.phone_number}</p>
                <p>📍 {contact.address}</p>
              </div>

              <div className="contact-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit(contact.id)}
                  className="contact-edit-button"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(contact.id)}
                  className="contact-delete-button"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
