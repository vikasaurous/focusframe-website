// Central product + link configuration. Store and release URLs stay empty until real listings/assets exist.
// An older AMO listing (v0.1.1) exists on addons.mozilla.org, but remains unlinked while Firefox beta parity is verified.
export const FIREFOX_ADDON_URL = "";
export const CHROME_STORE_URL = "";
export const EDGE_ADDONS_URL = "";
export const BETA_ZIP_URL = ""; // versioned beta ZIP release asset URL — keep empty until published

export const GITHUB_URL = "https://github.com/vikasaurous/FocusFrame";
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/vikasaurous";
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

/** Beta install target: published release ZIP when configured, otherwise the Availability section. */
export const betaHref = () => BETA_ZIP_URL || "#download";
