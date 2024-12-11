import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddContact from "./AddContact";
import Contacts from "./Contacts";
import Login from "./Login";
import Register from "./Register";
import EditContact from "./EditContact";


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
  
        {isAuthenticated ? (
          <>
            <button>
              <Link to="/contacts">Add Contact</Link>
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button>
              <Link to="/login">Login</Link>
            </button>
            <button>
              <Link to="/register">Register</Link>
            </button>
          </>
        )}
      </nav>
  
      <Routes>
        <Route path="/" element={<Contacts isAuthenticated={isAuthenticated} />} />
        {isAuthenticated ? (
          <>
          <Route path="/contacts" element={<AddContact />} />
          <Route path="/contact/edit/:id" element={<EditContact />} />
          </>
          
          
        ) : (
          <>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </div>
  </Router>
  
  );
}

export default App;
