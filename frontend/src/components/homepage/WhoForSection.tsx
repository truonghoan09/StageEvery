import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./WhoForSection.scss";

const WhoForSection = () => {
  const { t } = useTranslation();
  const items = t("homepage.whoFor.items", {
    returnObjects: true
  }) as string[];

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="who-for">
      <div className="who-for__container">
        <h2 className="who-for__headline">
          {t("homepage.whoFor.headline")}
        </h2>

        <ul className="who-for__list">
          {items.map((item, i) => (
            <li key={i} className="who-for__item">
              <span className="who-for__marker">—</span>
              <span className="who-for__text">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhoForSection;
