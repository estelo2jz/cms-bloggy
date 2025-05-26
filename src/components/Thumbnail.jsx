// components/Thumbnail.jsx
import React, { useState, useEffect } from 'react';
import './styles/Thumbnail.scss';

function Thumbnail({ src, alt = 'Post image', fallbackKeyword = 'technology' }) {
  const safeFallback = `https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80`; // static safe image
  const keywordFallback = `https://source.unsplash.com/800x400/?${fallbackKeyword}`;
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (src && src.trim()) {
      setImgSrc(src);
    } else {
      // Try keyword-based first, fallback to static on error
      setImgSrc(keywordFallback);
    }
  }, [src]);

  const handleError = () => {
    setImgSrc(safeFallback);
  };

  return (
    <div className="thumbnail">
      <img
        src={imgSrc}
        alt={alt}
        className="thumbnail__image"
        onError={handleError}
      />
    </div>
  );
}

export default Thumbnail;
