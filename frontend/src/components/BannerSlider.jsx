import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "../styles/bannerSlider.css";

const banners = [
  "/banner1.jpg",
  "/banner2.png",
  "/banner3.png",
  "/banner4.png",
];

export default function BannerSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      slidesPerView={2}
      spaceBetween={20}
      loop={true}
      speed={800}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{ clickable: true }}
      navigation={true}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      }}
    >
      {banners.map((banner, index) => (
        <SwiperSlide key={index}>
          <img
            src={banner}
            alt={`Banner ${index + 1}`}
            className="banner-image"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}