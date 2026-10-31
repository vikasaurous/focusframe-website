// Central product + link configuration. Store URLs stay empty until real listings exist.
export const FIREFOX_ADDON_URL = "";
export const CHROME_STORE_URL = "";
export const EDGE_ADDONS_URL = "";

export const GITHUB_URL = "https://github.com/vikasaurous/FocusFrame";
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const WEBSITE_URL = ""; // canonical URL placeholder — set once a domain is chosen

export const PRODUCT = {
  name: "FocusFrame",
  tagline: "Make every new tab count.",
  philosophy: "Less noise. More intention.",
  description:
    "Turn your browser's new tab into a personal productivity dashboard with daily focus, tasks, habits, shortcuts and a little pixel-art world.",
};

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Privacy", href: "#privacy" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Firefox CTA target: real listing when configured, otherwise the download section. */
export const firefoxHref = () => FIREFOX_ADDON_URL || "#download";
