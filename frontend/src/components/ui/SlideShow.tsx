import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

interface SlideshowProps {
  images: string[]; // Array of image URLs
  autoSlide?: boolean; // Enable auto sliding
  autoSlideInterval?: number; // Time interval for auto sliding (in ms)
}

const Slideshow: React.FC<SlideshowProps> = ({
  images,
  autoSlide = false,
  autoSlideInterval = 3000,
}) => {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));

  const next = () =>
    setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(() => {
      setCurr((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval]);

  return (
    <div className="relative overflow-hidden">
      {/* Slideshow Images */}
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-2 rounded-full bg-transparent opacity-100 hover:opacity-100 hover:bg-black/50 transition-all duration-300"
          style={{ width: "40px", height: "40px" }} // Make button smaller
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <button
          onClick={next}
          className="p-2 rounded-full bg-transparent opacity-100 hover:opacity-100 hover:bg-black/50 transition-all duration-300"
          style={{ width: "40px", height: "40px" }} // Make button smaller
        >
          <ChevronRight size={24} color="white" />
        </button>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-3 h-3 bg-white rounded-full ${
                curr === i ? "p-2" : "bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;
