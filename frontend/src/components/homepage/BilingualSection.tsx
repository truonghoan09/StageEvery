// frontend/src/components/homepage/BilingualSection.tsx

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./BilingualSection.scss";

const BilingualSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bilingual-wave bilingual-wave--compact"
    >
      <svg
        className="bilingual-wave__svg"
        viewBox="0 0 2000 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          className="map-line"
          d="
            M0 320
            L120 200
            L240 380
            L360 230
            L480 420
            L620 260
            L760 460
            L900 240
            L1040 420
            L1180 280
            L1320 460
            L1480 260
            L1620 420
            L1760 300
            L1900 440
            L2000 320
          "
        />
      </svg>

      <div className="bilingual-wave__content">
        <h2>{t("homepage.bilingual.headline")}</h2>
        <p>{t("homepage.bilingual.description.0")}</p>
      </div>
    </section>
  );
};

export default BilingualSection;
