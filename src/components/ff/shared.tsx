import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { firefoxHref, FIREFOX_ADDON_URL } from "@/config/site";

export function Reveal({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // @ts-expect-error polymorphic ref
  return <Tag ref={ref} className={`reveal ${className}`}>{children}</Tag>;
}

export function SectionHead({ index, label, title, children, className = "" }: { index: string; label: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <p className="eyebrow flex items-center gap-3">
        <span className="text-primary">{index}</span>
        <span className="h-px w-8 bg-border" />
        {label}
      </p>
      <h2 className="display mt-5 text-5xl text-foreground sm:text-6xl lg:text-7xl">{title}</h2>
      {children && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{children}</p>}
    </Reveal>
  );
}

export function FirefoxButton({ label = "Add to Firefox", className = "" }: { label?: string; className?: string }) {
  const external = Boolean(FIREFOX_ADDON_URL);
  return (
    <a href={firefoxHref()} className={`btn-primary ${className}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
      <ArrowUpRight className="size-4" aria-hidden />
    </a>
  );
}

export function BrandMark({ className = "size-6" }: { className?: string }) {
  return (
    <img
      src="/icon128.png"
      alt="FocusFrame"
      width={24}
      height={24}
      className={className}
    />
  );
}

export function WindowFrame({ children, title = "New Tab", className = "" }: { children: ReactNode; title?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg bg-card glow-frame ${className}`}>
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto max-w-xs flex-1 truncate rounded bg-background px-3 py-1 text-center font-mono text-[10px] text-subtle">{title}</div>
      </div>
      {children}
    </div>
  );
}
