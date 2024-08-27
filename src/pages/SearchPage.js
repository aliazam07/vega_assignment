import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const UNSPLASH_ACCESS_KEY = 'hmX-cgFwdVPhIVq6KqyZ4FGC5-plGcfVmhX4m7HUUxY';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading status
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query.trim() === '') {
      setError('Please enter a search query.');
      return;
    }

    setError(''); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await axios.get(UNSPLASH_API_URL, {
        params: { query, per_page: 24 },
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });

      if (response.data.results.length === 0) {
        setError('No images found. Try a different search term.');
      } else {
        setImages(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to fetch images. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAddCaption = (image) => {
    navigate('/add-caption', { state: { image } });
  };

  return (
    <div className="search-page">
      <header className="page-header">
        <h1>Md Ali Azam</h1>
        <p>Email: <a href="mailto:mdaliazam2002@gmail.com">mdaliazam2002@gmail.com</a></p>
      </header>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
          className="search-input"
        />
        <button
          onClick={handleSearch}
          className="search-button"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="image"
            />
            <button
              className="add-caption-button"
              onClick={() => handleAddCaption(image)}
            >
              Add Caption
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
