// frontend/src/components/homepage/SolutionSection.tsx


import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./SolutionSection.scss";

const SolutionSection = () => {
  const { t } = useTranslation();

  const points = t("homepage.solution.points", {
    returnObjects: true
  }) as string[];

  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in when section enters viewport
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

  // Parallax effect for image
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !visualRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const progress = (rect.top - windowHeight / 2) / windowHeight;
      visualRef.current.style.transform = `translateY(${progress * 40}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`solution ${visible ? "is-visible" : ""}`}
    >
      <div className="solution__inner">
        <div className="solution__text">
          <h2>{t("homepage.solution.intro")}</h2>

          <ul>
            {points.map((p, i) => (
              <li key={i} style={{ transitionDelay: `${i * 120}ms` }}>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={visualRef}
          className="solution__visual"
        />
      </div>
    </section>
  );
};

export default SolutionSection;
