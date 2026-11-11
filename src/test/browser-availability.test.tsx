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

describe("Browser availability & beta installation", () => {
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

  it("updates Hero CTA and subtitle without linking to Firefox Add-ons", () => {
    render(<Hero />);

    expect(screen.queryByRole("link", { name: /Add to Firefox/i })).not.toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Install beta/i });
    expect(cta).toHaveAttribute("href", "#download");
    expect(
      screen.getByText("Chrome beta (manual install) · Firefox experimental · Edge not tested yet"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Brave/i)).not.toBeInTheDocument();
  });

  it("renders truthful statuses and 7-step manual install guide in Browsers", () => {
    render(<Browsers />);

    expect(screen.getByRole("heading", { name: "Google Chrome" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Brave" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Firefox" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Microsoft Edge" })).toBeInTheDocument();

    expect(screen.getAllByText("Beta available")).toHaveLength(1);
    expect(screen.getByText("Experimental")).toBeInTheDocument();
    expect(screen.getAllByText("Not tested yet").length).toBeGreaterThanOrEqual(2);

    // Unverified browsers stay disabled and never link to AMO.
    expect(screen.getByRole("button", { name: "Compatibility testing" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Not tested yet" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Versioned beta ZIP not published yet" }),
    ).toBeDisabled();

    const githubZipLink = screen.getByRole("link", { name: /Get ZIP on GitHub/i });
    expect(githubZipLink).toHaveAttribute("href", GITHUB_URL);
    expect(githubZipLink).toHaveAttribute("target", "_blank");
    expect(githubZipLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByText(/Download the beta ZIP\./i)).toBeInTheDocument();
    expect(screen.getAllByText(/chrome:\/\/extensions/).length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText(/brave:\/\/extensions/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Brave/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Enable Developer mode\./i)).toBeInTheDocument();
    expect(screen.getByText(/Click Load unpacked\./i)).toBeInTheDocument();
    expect(screen.getByText(/manifest\.json/)).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("href") ?? "").not.toContain("addons.mozilla.org");
    }
  });

  it("keeps HowItWorks, Faq, FinalCta, and Footer consistent without AMO links", () => {
    render(
      <>
        <HowItWorks />
        <Faq />
        <FinalCta />
        <Footer />
      </>,
    );

    expect(
      screen.getByText("Download the beta and load it unpacked in Chrome."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Which browsers are supported during beta\?/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Google Chrome is available for beta testing via manual unpacked installation/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Chrome beta via unpacked install · Firefox experimental · Edge not tested yet",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Brave/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Install beta/i })).toHaveAttribute(
      "href",
      "#download",
    );
    expect(
      screen.getByRole("link", { name: "Browser availability & beta install" }),
    ).toHaveAttribute("href", "#download");

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("href") ?? "").not.toContain("addons.mozilla.org");
    }
  });
});
