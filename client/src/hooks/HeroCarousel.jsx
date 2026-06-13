import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade"

import hero1 from "../assets/Hero banner/5_offline_01.jpg";
import hero2 from "../assets/Hero banner/hero.jpg";
import hero3 from "../assets/Hero banner/special sales.jpg";

const heroSlides = [
  {
    id: 1,
    image: hero1,
    title: "Premium Collection",
    content: "Luxury made for you",
  },

  {
    id: 2,
    image: hero2,
    title: "New Arrivals",
    content: "Fresh and Amazing Styles",
  },

  {
    id: 3,
    image: hero3,
    title: "Limited Deals",
    content: "Grab yours before they are gone",
  },
];
export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      speed={1500}
      autoplay={{
        delay: 4000,
  
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      loop={true}
      
      className="h-[70vh] rounded-xl duration-500 transition-all"
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <section
            style={{ backgroundImage: `url(${slide.image})` }}
            className="relative h-[70vh] bg-cover bg-center flex items-center justify-center  text-center text-white"
          >
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 ">
              <h2 className="text-5xl font-bold mb-4 ">{slide.title}</h2>

              <p className="text-lg text-gray-200">{slide.content}</p>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
