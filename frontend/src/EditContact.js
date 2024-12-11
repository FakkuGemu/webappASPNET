import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditContact() {
  const { id } = useParams(); 
  const [contact, setContact] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7154/api/Categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Failed to fetch categories", error));

    fetch(`https://localhost:7154/api/Contacts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setContact(data);

        if (data.categoryId) {
          fetch(`https://localhost:7154/api/Subcategories/byCategory/${data.categoryId}`)
            .then((response) => response.json())
            .then((subcategories) => setSubcategories(subcategories))
            .catch((error) => console.error("Failed to fetch subcategories", error));
        }
      })
      .catch((error) => console.error("Failed to fetch contact", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setContact({ ...contact, categoryId: selectedCategoryId, subcategoryName: "" });

    fetch(`https://localhost:7154/api/Subcategories/byCategory/${selectedCategoryId}`)
      .then((response) => response.json())
      .then((data) => setSubcategories(data))
      .catch((error) => console.error("Failed to fetch subcategories", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to edit contacts.");
      return;
    }

    const updatedContact = {
      ...contact,
      subcategoryName: contact.categoryId !== "3" ? contact.subcategoryName : null,
      customSubcategory: contact.categoryId === "3" ? contact.customSubcategory : null,
    };

    await fetch(`https://localhost:7154/api/Contacts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedContact),
    });

    navigate("/"); 
  };

  if (!contact) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Contact</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={contact.password || ""}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={contact.firstName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={contact.lastName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={contact.phoneNumber}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Category:
          <select
            name="categoryId"
            value={contact.categoryId || ""}
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        {contact.categoryId !== "3" && (
          <label>
            Subcategory:
            <select
              name="subcategoryName"
              value={contact.subcategoryName || ""}
              onChange={handleInputChange}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <br />
        {contact.categoryId === "3" && (
          <label>
            Custom Subcategory:
            <input
              type="text"
              name="customSubcategory"
              value={contact.customSubcategory || ""}
              onChange={handleInputChange}
            />
          </label>
        )}
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditContact;
