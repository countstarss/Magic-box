"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Poster {
  image: string;
  title: string;
  description?: string;
}

interface CarouselProps {
  posters: Poster[];
}

const Carousel = ({ posters }: CarouselProps) => {
  const [emblaRef, embla] = useEmblaCarousel();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  const updateButtons = useCallback(() => {
    if (!embla) return;
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", updateButtons);
    updateButtons();
  }, [embla, updateButtons]);

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {posters.map((poster, index) => (
            <div key={index} className="relative min-w-full flex items-center justify-center p-4">
              <img src={poster.image} alt={poster.title} className="w-full h-auto rounded-lg shadow-lg" />
              
              {/* 悬浮标题和描述 */}
              <div className="absolute inset-0 top-32 left-32 bg-transparent flex flex-col p-6 rounded-lg">
                <h3 className="text-4xl font-bold text-white mb-2">{poster.title}</h3>
                {poster.description && (
                  <p className="text-lg text-white">{poster.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 左边按钮 */}
      <button
        className={`absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-xl rounded-full p-2 ml-4
          ${canScrollPrev ? "bg-black/50" : "bg-black/50 cursor-not-allowed"}`}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <ChevronLeft />
      </button>

      {/* 右边按钮 */}
      <button
        className={`absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-xl rounded-full p-2 mr-4
          ${canScrollNext ? "bg-black/50" : "bg-black/50 cursor-not-allowed"}`}
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Carousel;