// frontend/src/components/homepage/HeroSection.tsx


import { useTranslation } from "react-i18next";
import "./HeroSection.scss";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="home-hero">
      <h1 className="home-hero__headline">
        {t("homepage.hero.headline")}
      </h1>

      <p className="home-hero__subheadline">
        {t("homepage.hero.subheadline")}
      </p>

      <div className="home-hero__actions">
        <button>{t("homepage.hero.ctaPrimary")}</button>
        <button>{t("homepage.hero.ctaSecondary")}</button>
      </div>
    </section>
  );
};

export default HeroSection;
