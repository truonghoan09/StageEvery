import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./EPKSection.scss";

const EPKSection = () => {
  const { t } = useTranslation();
  const items = t("homepage.epk.items", {
    returnObjects: true,
  }) as string[];

  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Fade + slide in when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`epk ${visible ? "is-visible" : ""}`}
    >
      <div className="epk__container">
        <div className="epk__content">
          <h2>{t("homepage.epk.headline")}</h2>

          <ul>
            {items.map((item, i) => (
              <li key={i} style={{ transitionDelay: `${i * 100}ms` }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="epk__visual">
          <img
            src="assets/images/home/epk-workspace-mockup.jpg"
            alt="Electronic Press Kit preview"
          />
        </div>
      </div>
    </section>
  );
};

export default EPKSection;
