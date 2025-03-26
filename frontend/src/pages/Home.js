import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Function to fetch books from Google Books API
  const fetchBooks = async (query) => {
    if (!query.trim()) {
      setBooks([]); // Clear books if input is empty
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=21`
      );

      if (response.data.items) {
        setBooks(response.data.items);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  // Use Effect for Debounce Search (Triggers API after user stops typing)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks(search);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(delayDebounce); // Cleanup timeout
  }, [search]); // Runs every time search state changes

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">𝔉ustlibrary</div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="home-content">
        <h1 className="welcome-text">Welcome to 𝔉ustlibrary</h1>
        <h2 className="searcho-text">Search your interest</h2>

        {/* Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search for books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Show books only if search is not empty */}
        {books.length > 0 && (
          <div className="book-list">
            {books.map((book) => {
              const volumeInfo = book.volumeInfo || {}; // Handle undefined `volumeInfo`
              
              // Check if title exists, otherwise use a default value
              const title = volumeInfo.title
                ? volumeInfo.title.length > 50
                  ? volumeInfo.title.substring(0, 50) + "..."
                  : volumeInfo.title
                : "No Title Available"; // Fallback title

              // Check if authors exist, otherwise use a default value
              const authors = volumeInfo.authors && volumeInfo.authors.length > 0
                ? volumeInfo.authors.length > 1
                  ? `${volumeInfo.authors[0]}, Others`
                  : volumeInfo.authors[0]
                : "Unknown Author"; // Fallback author

              return (
                <div key={book.id} className="book-card">
                  {/* Clickable Image */}
                  <a
                    href={volumeInfo.previewLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                      alt={title}
                      className="book-image"
                    />
                  </a>

                  {/* Clickable Title */}
                  <h3 className="book-title">
                    <a
                      href={volumeInfo.previewLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-link"
                    >
                      {title}
                    </a>
                  </h3>

                  {/* Book Author */}
                  <p className="book-author">{authors}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
