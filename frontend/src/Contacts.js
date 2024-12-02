import React, { useState, useEffect } from "react";

function Contacts({ isAuthenticated }) {
  const [contacts, setContacts] = useState([]);

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

  return (
    <div>
      <h1>Contacts</h1>
      {isAuthenticated && <button onClick={() => alert("Add Contact")}>Add Contact</button>}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.firstName} {contact.lastName} - {contact.email}
            {isAuthenticated && (
              <>
                <button onClick={() => alert(`Edit Contact ${contact.id}`)}>Edit</button>
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
