import React, { useEffect, useState } from "react";
import AddBook from "./components/AddBook";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("none");
  const [selectedBook, setSelectedBook] = useState(null);

  // ✅ Fetch books from backend
  const fetchBooks = () => {
    setLoading(true);
    fetch("http://localhost:8084/api/books")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch books");
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching books:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ✅ Delete a book
  const deleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await fetch(`http://localhost:8084/api/books/${id}`, {
        method: "DELETE",
      });
      fetchBooks();
    }
  };

  // ✅ Filter and sort books
  const filteredBooks = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "title") return a.title.localeCompare(b.title);
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      return 0;
    });

  // ✅ Hover transition helper
  const buttonHover = (e, scale) => {
    e.target.style.transform = `scale(${scale})`;
    e.target.style.opacity = scale === 1 ? "1" : "0.9";
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #eef2ff, #dbeafe)",
        minHeight: "100vh",
        color: "#1e293b",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#1d4ed8" }}>📚 Online Bookstore</h1>

      {/* 🔍 Search and Sort controls */}
      <div
        style={{
          margin: "20px auto",
          textAlign: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by title or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="none">Sort by</option>
          <option value="title">Title (A–Z)</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
        </select>
      </div>

      {/* 🧾 Book List */}
      <h2 style={{ textAlign: "center" }}>Available Books</h2>
      {loading ? (
        <p style={{ textAlign: "center" }}>⏳ Loading books...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center" }}>⚠️ {error}</p>
      ) : filteredBooks.length > 0 ? (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {filteredBooks.map((book, index) => (
            <li
              key={index}
              style={{
                background: "white",
                marginBottom: "15px",
                padding: "15px 20px",
                borderRadius: "10px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.1)")
              }
            >
              <span>
                <strong style={{ color: "#1e40af" }}>{book.title}</strong> by{" "}
                {book.author} — ₹{book.price}
              </span>
              <div>
                <button
                  onClick={() => setSelectedBook(book)}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginRight: "8px",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => buttonHover(e, 1.05)}
                  onMouseOut={(e) => buttonHover(e, 1)}
                >
                  👁 View
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => buttonHover(e, 1.05)}
                  onMouseOut={(e) => buttonHover(e, 1)}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: "center" }}>No books available.</p>
      )}

      {/* ➕ Add new book form */}
      <div
        style={{
          margin: "40px auto",
          padding: "25px",
          background: "#e0e7ff",
          borderRadius: "12px",
          width: "380px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <AddBook onBookAdded={fetchBooks} />
      </div>

      {/* 📘 Book Details Popup Modal */}
      {selectedBook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setSelectedBook(null)}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              width: "340px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
              textAlign: "center",
              animation: "fadeIn 0.3s ease-in-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#1e3a8a" }}>📖 Book Details</h3>
            <p><strong>Title:</strong> {selectedBook.title}</p>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Price:</strong> ₹{selectedBook.price}</p>

            <button
              onClick={() => setSelectedBook(null)}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                marginTop: "15px",
                transition: "0.2s",
              }}
              onMouseOver={(e) => buttonHover(e, 1.05)}
              onMouseOut={(e) => buttonHover(e, 1)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
