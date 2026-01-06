// frontend/src/components/homepage/ShowcaseSection.tsx


import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./ShowcaseSection.scss";

const ShowcaseSection = () => {
  const { t } = useTranslation();

  return (
    <section className="showcase">
      <div className="showcase__overlay" />

      <div className="showcase__container">
        <header className="showcase__header">
          <h2>{t("homepage.showcase.headline")}</h2>
          <p>{t("homepage.showcase.description.0")}</p>
        </header>

        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          speed={700}
          navigation
          pagination={{ clickable: true }}
          className="showcase__slider"
        >
          <SwiperSlide>
            <img
              src="assets/images/home/showcase/stageevery-artist-website.png"
              alt="Artist Website"
            />
            <span className="showcase__label">Artist Website</span>
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="assets/images/home/showcase/stageevery-epk-presskit.png"
              alt="EPK / Press Kit"
            />
            <span className="showcase__label">EPK / Press Kit</span>
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="assets/images/home/showcase/stageevery-shareable-profile.png"
              alt="Shareable Profile"
            />
            <span className="showcase__label">Shareable Profile</span>
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="assets/images/home/showcase/stageevery-visual-identity.png"
              alt="Visual Identity"
            />
            <span className="showcase__label">Visual Identity</span>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default ShowcaseSection;
