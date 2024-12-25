import React, { useState } from "react";
import "./SearchPopup.css";
import { useNavigate } from "react-router-dom";

const SearchPopup = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      try {
        const res = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL
          }/class/classrooms/search?term=${encodeURIComponent(term)}`
        );

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        console.log(data);
        setResults(data.data);
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleItemClick = (id) => {
    navigate(`/classes/${id}`);
    onClose();
  };

  return (
    <div className="search-popup">
      <div className="search-popup-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for classrooms..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-secondary"
          />
          <button className="search-popup-close" onClick={onClose}>
            x
          </button>
        </div>
        <ul className="search-results">
          {results.length > 0 ? (
            results.map((result) => (
              <li key={result._id} onClick={() => handleItemClick(result._id)}>
                <span>{result.name}</span>
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchPopup;
