import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BestForYou = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const images = [
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
    "https://f.nooncdn.com/p/pzsku/Z178787BB2C14662ABCBDZ/45/_/1733941182/fb1b14be-621c-42ee-ada3-0b0e99fa55f9.jpg?format=webp&width=800",
  ];

  return (
    <div className="relative flex container mt-10 mx-auto flex-col gap-6 px-4 py-8 md:py-16">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
        <div className="flex flex-col relative">
          {/* Mobile design element */}
          <div className="absolute -left-3 md:-left-6 top-1/2 transform -translate-y-1/2 h-10 w-1 bg-black hidden md:block"></div>

          {/* Fashion-forward heading with accent */}
          <div className="flex items-center gap-2 md:gap-4">
            <span className="h-[2px] w-6 bg-black inline-block md:hidden"></span>
            <h2 className="text-2xl md:text-3xl font-light tracking-widest text-gray-900 uppercase">Trending</h2>
          </div>

          {/* Subheading with seasonal callout */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3 mt-1 md:mt-2">
            <p className="text-sm md:text-base font-medium text-teal-800">
                Spring/Summer 2025
            </p>
            <span className="hidden md:inline-block h-1 w-1 bg-gray-400 rounded-full"></span>
            <p className="text-sm text-gray-500 hidden md:block">Discover the latest styles</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 md:mt-0">
          {/* Season tag - mobile only */}
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded md:hidden">NEW IN</span>

          {/* Navigation buttons with refined design */}
          <div className="flex gap-2">
            <button
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.swiper.slideNext()}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* View all link with fashion styling */}
          <a href="#" className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:text-gray-600 ml-2">
            <span>VIEW ALL</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={12}
        slidesPerView={1.2}
        navigation={false}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="h-[500px] md:h-[600px] w-full"
        ref={swiperRef}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="h-full w-full overflow-hidden group">
            <div className="relative h-full w-full">
              <img
                src={src}
                alt={`image-${index}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Add hover overlay with product info for fashion look */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white">
                  <p className="text-sm font-medium">New Collection</p>
                  <p className="text-xs opacity-80 mt-1">Shop now</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BestForYou
