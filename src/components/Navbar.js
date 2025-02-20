import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser , FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>
      <img src="logo1.png" alt="logo" width="100" height="40" />
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={menuOpen ? "active" : ""}>
        <li><Link to="/" onClick={closeMenu}><FaHome /> Home</Link></li>
        <li><Link to="/dashboard" onClick={closeMenu}><FaUser/> Dashboard </Link></li>
        <li><Link to="/profile" onClick={closeMenu}><FaUser/> Profile</Link></li>
        <li><Link to="/signup" onClick={closeMenu}><FaSignInAlt/> Signup</Link></li>
        <li><button onClick={() => { handleLogout(); closeMenu(); }}><FaSignOutAlt /> Logout
          </button></li>
      </ul>
    </nav>
  );
}

export default Navbar;