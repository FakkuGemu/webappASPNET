import React, { useState, useEffect } from "react";

function AddContact() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("https://localhost:7154/api/Categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Failed to fetch categories", error));
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);

    
    fetch(`https://localhost:7154/api/Subcategories/byCategory/${selectedCategoryId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch subcategories");
            }
            return response.json();
            })
        .then((data) => setSubcategories(data))
        .catch((error) => console.error("Failed to fetch subcategories", error));
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least 8 characters, including uppercase, lowercase, and a number.");
      return;
    }

    const contact = {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        categoryId: parseInt(categoryId),
        subcategoryId: categoryId === "1" ? parseInt(subcategoryId) : null,
        subcategory: categoryId === "3" && customSubcategory
          ? { name: customSubcategory }
          : null, 
      };

    try {
        const token = localStorage.getItem("token"); 

        const response = await fetch("https://localhost:7154/api/Contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify(contact),
        });

      if (!response.ok) {
        throw new Error("Failed to add contact. Make sure the email is unique.");
      }

      setSuccess("Contact added successfully!");
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setCategoryId("");
      setSubcategoryId("");
      setCustomSubcategory("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Add Contact</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
        <label>Category:</label>
        <select value={categoryId} onChange={handleCategoryChange} required>
            <option value="">Select a category</option>
            {categories.map((category) => (
            <option key={category.id} value={category.id}>
                {category.name}
            </option>
            ))}
        </select>
        </div>
        {categoryId !== "3" && (
        <div>
            <label>Subcategory:</label>
            <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            required
            >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
                </option>
            ))}
            </select>
        </div>
        )}
        {categoryId === "3" && (
        <div>
            <label>Custom Subcategory:</label>
            <input
            type="text"
            value={customSubcategory}
            onChange={(e) => setCustomSubcategory(e.target.value)}
            required
            />
        </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Add Contact</button>
      </form>
    </div>
  );
}

export default AddContact;
