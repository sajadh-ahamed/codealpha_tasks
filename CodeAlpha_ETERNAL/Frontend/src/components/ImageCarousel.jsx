import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './ImageCarousel.css'

const ImageCarousel = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setImageLoaded(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setImageLoaded(false)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setImageLoaded(false)
  }

  return (
    <div className="image-carousel">
      <div className="carousel-main">
        <button
          className="carousel-button carousel-button-prev"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <FiChevronLeft />
        </button>
        <div className="carousel-image-wrapper">
          {!imageLoaded && <div className="image-skeleton" />}
          <img
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="carousel-image"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        </div>
        <button
          className="carousel-button carousel-button-next"
          onClick={goToNext}
          aria-label="Next image"
        >
          <FiChevronRight />
        </button>
      </div>
      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
