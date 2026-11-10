import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import CatLayer from "@/components/cat-layer";
import { SupportButton } from "@/components/ff/shared";
import { BUY_ME_A_COFFEE_URL } from "@/config/site";
import { ACCENTS, applyAccentToDocument, DEFAULT_ACCENT, setGlobalAccent } from "@/lib/theme";
import { collectZones } from "@/lib/zones";

describe("SupportButton (Buy Me a Coffee)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-accent");
    document.documentElement.className = "";
    setGlobalAccent(DEFAULT_ACCENT);
    applyAccentToDocument(DEFAULT_ACCENT);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders SSR markup cleanly without client globals", () => {
    const html = renderToString(<SupportButton />);
    expect(html).toContain('aria-label="Support FocusFrame"');
    expect(html).toContain('data-oneko-zone="avoid"');
    expect(html).not.toContain("Enjoying FocusFrame?");
  });

  it("renders floating button in avoid zone with coffee icon and tooltip on focus", async () => {
    render(<SupportButton />);

    const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
    expect(trigger).toHaveAttribute("data-oneko-zone", "avoid");
    expect(trigger.className).toContain("fixed");
    expect(trigger.className).toContain("rounded-full");
    expect(trigger.className).toContain("support-fab");

    fireEvent.focus(trigger);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Support FocusFrame");

    fireEvent.blur(trigger);
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    fireEvent.pointerMove(trigger, { pointerType: "mouse" });
    expect(await screen.findByRole("tooltip", {}, { timeout: 1000 })).toHaveTextContent(
      "Support FocusFrame",
    );
  });

  it("opens accessible modal on click with expected copy and external CTA", async () => {
    render(<SupportButton />);

    const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(screen.getByRole("heading", { name: "Enjoying FocusFrame?" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "FocusFrame is an independent project. Your support helps keep development going and makes future improvements possible.",
      ),
    ).toBeInTheDocument();

    const cta = screen.getByRole("link", { name: /Buy me a coffee/i });
    expect(cta).toHaveAttribute("href", BUY_ME_A_COFFEE_URL);
    expect(cta).toHaveAttribute("href", "https://buymeacoffee.com/vikasaurous");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");

    // Radix modal locks background scroll while open.
    expect(document.body).toHaveAttribute("data-scroll-locked");
  });

  it("closes via Close button and restores focus to the floating button without flashing tooltip", async () => {
    render(<SupportButton />);

    const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(document.body).not.toHaveAttribute("data-scroll-locked");
  });

  it("closes on Escape and restores focus to the floating button", async () => {
    render(<SupportButton />);

    const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");

    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on backdrop pointer interaction and restores focus", async () => {
    render(<SupportButton />);

    const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
    fireEvent.click(trigger);
    await screen.findByRole("dialog");

    // Backdrop/outside pointer interaction triggers DismissableLayer pointerdown outside
    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(document.activeElement).toBe(trigger);
  });

  it("works with all four personalization accent colours", async () => {
    render(<SupportButton />);
    const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
    fireEvent.click(trigger);
    await screen.findByRole("dialog");

    for (const option of ACCENTS) {
      setGlobalAccent(option.id);
      expect(document.documentElement.dataset["accent"]).toBe(option.id);
      expect(document.documentElement.classList.contains(`accent-${option.id}`)).toBe(true);
      const cta = screen.getByRole("link", { name: /Buy me a coffee/i });
      expect(cta.className).toContain("bg-primary");
      expect(cta.className).toContain("text-primary-foreground");
    }
  });

  it("registers an avoid zone for Oneko and keeps resting cat away from bottom-right", () => {
    const origMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      const { container } = render(
        <>
          <CatLayer />
          <SupportButton />
        </>,
      );

      const trigger = screen.getByRole("button", { name: "Support FocusFrame" });
      trigger.getBoundingClientRect = () =>
        ({
          left: 960,
          top: 700,
          right: 1004,
          bottom: 744,
          width: 44,
          height: 44,
          x: 960,
          y: 700,
          toJSON: () => {},
        }) as DOMRect;

      const zones = collectZones([]);
      expect(zones.some((z) => z.type === "avoid" && z.rect.left === 960)).toBe(true);

      const restingCat = container.querySelector('[aria-hidden="true"]') as HTMLElement | null;
      expect(restingCat).not.toBeNull();
      expect(restingCat?.style.left).toBe("16px");
      expect(restingCat?.style.right).toBe("");
    } finally {
      window.matchMedia = origMatchMedia;
    }
  });
});
