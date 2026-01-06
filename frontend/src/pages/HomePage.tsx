//frontend/src/pages/HomePage.tsx


import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import {
  HeroSection,
  ArtistTruthSection,
  SolutionSection,
  ShowcaseSection,
  EPKSection,
  BilingualSection,
  WhoForSection,
  FinalCTASection
} from "../components/homepage";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* ===== SEO META ===== */}
      <Helmet>
        <title>{t("homepage.seo.title")}</title>
        <meta
          name="description"
          content={t("homepage.seo.description")}
        />

        {/* Open Graph */}
        <meta property="og:title" content={t("homepage.seo.title")} />
        <meta
          property="og:description"
          content={t("homepage.seo.description")}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ===== SEMANTIC LAYOUT ===== */}
      <header>
        <HeroSection />
      </header>

      <main>
        <ArtistTruthSection />
        <SolutionSection />
        <ShowcaseSection />
        <EPKSection />
        <BilingualSection />
        <WhoForSection />
      </main>

      <footer>
        <FinalCTASection />
      </footer>
    </>
  );
};

export default HomePage;
