import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Contacts({ isAuthenticated }) {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetch("https://localhost:7154/api/Contacts")
      .then((response) => response.json())
      .then((data) => setContacts(data));
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete contacts.");
      return;
    }

    await fetch(`https://localhost:7154/api/Contacts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleEdit = (id) => {
    navigate(`/contact/edit/${id}`); 
  };

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.firstName} {contact.lastName} - {contact.email}
            {isAuthenticated && (
              <>
                <button onClick={() => handleEdit(contact.id)}>Edit</button>
                <button onClick={() => handleDelete(contact.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contacts;
