import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddContact from "./AddContact";
import Contacts from "./Contacts";
import Login from "./Login";
import Register from "./Register";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  return (
    <Router>
      <div>
      <nav>
          <button>
            <Link to="/">Home</Link>
          </button>
          <button>
            <Link to="/contacts">Add</Link>
          </button>
          <button>
            <Link to="/login">Login</Link>
          </button>
          <button>
            <Link to="/register">Register</Link>
          </button>
        </nav>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <p>You are not logged in.</p>
        )}
        <Routes>
          <Route path="/" element={<Contacts isAuthenticated={isAuthenticated} />} />
          <Route path="/contacts" element={<AddContact />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
