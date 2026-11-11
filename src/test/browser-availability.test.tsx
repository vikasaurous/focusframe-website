import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Browsers, Faq, FinalCta, Footer, HowItWorks } from "@/components/ff/bottom";
import { Hero } from "@/components/ff/top";
import {
  BETA_ZIP_URL,
  CHROME_STORE_URL,
  EDGE_ADDONS_URL,
  FIREFOX_ADDON_URL,
  GITHUB_URL,
} from "@/config/site";

describe("Browser availability & manual unpacked installation", () => {
  const originalIO = globalThis.IntersectionObserver;

  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    globalThis.IntersectionObserver = originalIO;
  });

  it("keeps unverified store and release ZIP URLs empty in site config", () => {
    expect(FIREFOX_ADDON_URL).toBe("");
    expect(CHROME_STORE_URL).toBe("");
    expect(EDGE_ADDONS_URL).toBe("");
    expect(BETA_ZIP_URL).toBe("");
  });

  it("updates Hero CTA and subtitle without claiming verified Chrome beta availability or AMO links", () => {
    render(<Hero />);

    expect(screen.queryByRole("link", { name: /Add to Firefox/i })).not.toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Manual install/i });
    expect(cta).toHaveAttribute("href", "#download");
    expect(
      screen.getByText("Chrome manual testing setup · Firefox experimental · Edge not tested yet"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Brave/i)).not.toBeInTheDocument();
  });

  it("renders truthful statuses and 7-step GitHub repository ZIP install guide in Browsers", () => {
    render(<Browsers />);

    expect(screen.getByRole("heading", { name: "Google Chrome" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Brave" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Firefox" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Microsoft Edge" })).toBeInTheDocument();

    expect(screen.getByText("Manual testing setup")).toBeInTheDocument();
    expect(screen.queryByText(/Beta available/i)).not.toBeInTheDocument();
    expect(screen.getByText("Experimental")).toBeInTheDocument();
    expect(screen.getAllByText("Not tested yet").length).toBeGreaterThanOrEqual(2);

    // Unverified browsers stay disabled and never link to AMO or fake release ZIPs.
    expect(screen.getByRole("button", { name: "Compatibility testing" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Not tested yet" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "No versioned release ZIP published" }),
    ).toBeDisabled();

    const githubZipLink = screen.getByRole("link", { name: /Get ZIP on GitHub/i });
    expect(githubZipLink).toHaveAttribute("href", GITHUB_URL);
    expect(githubZipLink).toHaveAttribute("target", "_blank");
    expect(githubZipLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(
      screen.getByText(
        "Download the FocusFrame repository ZIP from GitHub using Code → Download ZIP.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Extract the downloaded ZIP archive.")).toBeInTheDocument();
    expect(screen.queryByText(/Download the beta ZIP\./i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/chrome:\/\/extensions/).length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText(/brave:\/\/extensions/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Brave/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Enable Developer mode\./i)).toBeInTheDocument();
    expect(screen.getByText(/Click Load unpacked\./i)).toBeInTheDocument();
    expect(screen.getByText(/Select the extracted folder containing/i)).toBeInTheDocument();
    expect(screen.getAllByText("manifest.json").length).toBeGreaterThanOrEqual(2);

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("href") ?? "").not.toContain("addons.mozilla.org");
    }
  });

  it("keeps HowItWorks, Faq, FinalCta, and Footer consistent without AMO links or versioned ZIP claims", () => {
    render(
      <>
        <HowItWorks />
        <Faq />
        <FinalCta />
        <Footer />
      </>,
    );

    expect(
      screen.getByText(
        "Download the FocusFrame repository ZIP from GitHub using Code → Download ZIP, extract it, and load the folder containing manifest.json in Chrome.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Which browsers are currently supported\?/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Google Chrome can be loaded manually for testing as an unpacked extension/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Chrome manual testing setup · Firefox experimental · Edge not tested yet"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Brave/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Beta available/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Manual install" })).toHaveAttribute(
      "href",
      "#download",
    );
    expect(
      screen.getByRole("link", { name: "Browser availability & manual install" }),
    ).toHaveAttribute("href", "#download");

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("href") ?? "").not.toContain("addons.mozilla.org");
    }
  });
});
