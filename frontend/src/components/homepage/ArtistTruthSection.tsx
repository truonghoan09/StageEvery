// frontend/src/components/homepage/ArtistTruthSection.tsx


import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./ArtistTruthSection.scss";

const ArtistTruthSection = () => {
  const { t } = useTranslation();
  const lines = t("homepage.artistTruth.text", {
    returnObjects: true
  }) as string[];

  const sectionRef = useRef<HTMLElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in when visible
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !visualRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(rect.top / window.innerHeight, -1), 1);

      visualRef.current.style.transform = `translateY(${progress * 30}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`artist-truth ${visible ? "is-visible" : ""}`}
    >
      <div className="artist-truth__inner">
        <div className="artist-truth__text">
          {lines.map((line, index) =>
            index === 0 ? (
              <p key={index} className="lead">
                {line}
              </p>
            ) : (
              <p key={index}>
                <em>{line}</em>
              </p>
            )
          )}
        </div>

        <div
          ref={visualRef}
          className="artist-truth__visual"
        />
      </div>
    </section>
  );
};

export default ArtistTruthSection;
