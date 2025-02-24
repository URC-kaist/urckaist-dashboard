import React, { useState, useEffect } from 'react';
import Image1 from './public/images-2.jpeg';
import Image2 from './public/dscf0066.jpg.webp';

const Stratigraphy: React.FC<{ interval?: number }> = ({ interval = 3000 }) => {
  const images = [
    Image1,
    Image2
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically update the current image based on the interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, interval);
    // Clear the timer on component unmount
    return () => clearInterval(timer);
  }, [images, interval]);

  // Handler for navigating to the next image
  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  // Handler for navigating to the previous image
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', margin: '0 auto' }}>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
      />
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: 'none',
          fontWeight: 'bold',
          borderRadius: '10px'
        }}
      >
        <p>{'<'}</p>
      </button>
      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          border: 'none',
          fontWeight: 'bold',
          borderRadius: '10px'
        }}
      >
        <p>{'>'}</p>
      </button>
    </div>
  );
};

export default Stratigraphy;
