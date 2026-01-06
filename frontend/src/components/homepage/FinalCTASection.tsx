// frontend/src/components/homepage/FinalCTASection.tsx


import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./FinalCTASection.scss";

const FinalCTASection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const lines = t("homepage.finalCta.headline", {
    returnObjects: true
  }) as string[];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="final-cta">
      <div className="final-cta__content">
        {lines.map((line, i) => (
          <h2 key={i}>{line}</h2>
        ))}

        <button className="final-cta__button">
          {t("homepage.finalCta.cta")}
        </button>
      </div>
    </section>
  );
};

export default FinalCTASection;

