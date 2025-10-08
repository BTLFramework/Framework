"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
  id: number;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  resourceLink?: string;
  resourceLabel?: string;
}

interface CarouselData {
  slides: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

interface SummaryCarouselProps {
  assetPath: string;
}

export function SummaryCarousel({ assetPath }: SummaryCarouselProps) {
  const [carouselData, setCarouselData] = useState<CarouselData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(assetPath)
      .then(response => response.json())
      .then(data => {
        setCarouselData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading carousel data:', error);
        setLoading(false);
      });
  }, [assetPath]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!carouselData || !carouselData.slides || carouselData.slides.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No content available</div>
      </div>
    );
  }

  const currentSlideData = carouselData.slides[currentSlide];
  const totalSlides = carouselData.slides.length;

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Slide Content */}
        <div 
          className="p-8 min-h-[300px] flex flex-col justify-center transition-all duration-300"
          style={{ 
            backgroundColor: currentSlideData.backgroundColor,
            color: currentSlideData.textColor 
          }}
        >
          <h3 className="text-2xl font-bold mb-4">{currentSlideData.title}</h3>
          <p className="text-lg leading-relaxed mb-6">{currentSlideData.content}</p>

          {/* Resource Link Button (if present) */}
          {currentSlideData.resourceLink && currentSlideData.resourceLabel && (
            <div className="mt-4">
              <a
                href={currentSlideData.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-btl-600 text-white font-semibold rounded-full hover:bg-btl-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <span>{currentSlideData.resourceLabel}</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            {carouselData.showArrows !== false && (
              <button
                onClick={goToPrevious}
                disabled={currentSlide === 0}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
            )}

            {/* Dots */}
            {carouselData.showDots !== false && (
              <div className="flex gap-2">
                {carouselData.slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentSlide 
                        ? 'bg-btl-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Next Button */}
            {carouselData.showArrows !== false && (
              <button
                onClick={goToNext}
                disabled={currentSlide === totalSlides - 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Slide counter */}
          <div className="text-center mt-2 text-sm text-gray-500">
            {currentSlide + 1} / {totalSlides}
          </div>
        </div>
      </div>
    </div>
  );
}

