import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
import SearchPopup from "./SearchPopup";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
        <div className="logo-icon">
          <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="31.4213" height="297.858" rx="15.7106" transform="matrix(0.621356 0.783528 -0.621356 0.783528 270.076 59.5)" fill="#2CA3FF"/>
            <rect x="91.6687" y="310.728" width="35.319" height="180.057" rx="17.6595" transform="rotate(-90 91.6687 310.728)" fill="#2CA3FF"/>
            <rect width="31.4214" height="297.86" rx="15.7107" transform="matrix(-0.621361 -0.783524 0.621361 -0.783524 229.024 439)" fill="#2CA3FF"/>
            <rect x="407.434" y="187.772" width="35.319" height="180.059" rx="17.6595" transform="rotate(90 407.434 187.772)" fill="#2CA3FF"/>
          </svg>
        </div>
        <div className="logo-word">
          LearnTantra
        </div>
        </Link>
        {/* <input type="text" placeholder="Search classrooms" className="search-input" /> */}
        <svg 
          onClick={togglePopup}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>

        {showPopup && <SearchPopup onClose={togglePopup} />}  {/* render the popup */}
      </div>
      
      <div className="navbar-right">
        {auth.user ? (
          <>
            <Link to="/profile" className="profile-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </Link>
            <button className="logout-btn" onClick={logout} >Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
