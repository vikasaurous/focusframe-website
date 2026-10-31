import { createFileRoute } from "@tanstack/react-router";
import { Hero, Nav, Preview, Statement } from "@/components/ff/top";
import { LayoutSection, Modules } from "@/components/ff/modules";
import { CommandSection } from "@/components/ff/command";
import { Personalize, PixelWorld, YearDots } from "@/components/ff/world";
import { Browsers, Faq, FinalCta, Footer, HowItWorks, Privacy } from "@/components/ff/bottom";
import { PRODUCT } from "@/config/site";

const TITLE = "FocusFrame — Make Every New Tab Count";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: PRODUCT.description },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: PRODUCT.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: PRODUCT.description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Preview />
        <Statement />
        <Modules />
        <LayoutSection />
        <CommandSection />
        <PixelWorld />
        <YearDots />
        <Personalize />
        <Privacy />
        <HowItWorks />
        <Browsers />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
