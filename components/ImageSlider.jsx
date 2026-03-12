'use client';
import React, { useState, useEffect, useRef } from 'react';
import '../componentStyles/ImageSlider.css';

function ImageSlider({ initialSlides = [] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    // If we don't have initialSlides (e.g. CSR navigation), fetch them
    if (!initialSlides || initialSlides.length === 0) {
      const fetchSlides = async () => {
        try {
          const response = await fetch('/api/slides');
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setSlides(data);
            }
          }
        } catch (error) {
          console.error('Error fetching slides:', error);
        }
      };
      fetchSlides();
    }
  }, [initialSlides]);

  // If still no slides after check, return null or a skeleton to avoid showing old hardcoded images
  if (slides.length === 0) {
    return <div className="image-slider-container loading"></div>;
  }

  // Create extended slides for infinite loop effect
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  useEffect(() => {
    if (slides.length > 1) { 
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 5000); 

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 0) {
      if (currentIndex === extendedSlides.length - 1) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(1);
        }, 500);
      } else if (currentIndex === 0) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(slides.length);
        }, 500);
      }
    }
  }, [currentIndex, extendedSlides.length, slides.length]);

  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [isTransitioning]);

  const goToSlide = (index) => {
    setCurrentIndex(index + 1);
  };

  return (
    <div className="image-slider-container">
      <div
        ref={sliderRef}
        className="slider-images"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? 'transform 0.5s ease' : 'none',
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div className="slider-item" key={index}>
            {slide.buttonUrl ? (
              <a href={slide.buttonUrl} target="_blank" rel="noopener noreferrer">
                <img src={slide.imageUrl} alt={`Slide ${index}`} />
              </a>
            ) : (
              <img src={slide.imageUrl} alt={`Slide ${index}`} />
            )}
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index + 1 ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;
