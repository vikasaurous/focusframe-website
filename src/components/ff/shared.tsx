import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Coffee } from "lucide-react";
import { BUY_ME_A_COFFEE_URL } from "@/config/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export function InstallBetaButton({
  label = "Install beta",
  href = "#download",
  external = false,
  className = "",
}: {
  label?: string;
  href?: string;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`btn-primary ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
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

export function SupportButton() {
  const [open, setOpen] = useState(false);
  const suppressTooltipOnFocusRef = useRef(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) suppressTooltipOnFocusRef.current = false;
        setOpen(nextOpen);
      }}
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="Support FocusFrame"
                data-oneko-zone="avoid"
                onFocus={(e) => {
                  if (suppressTooltipOnFocusRef.current) {
                    suppressTooltipOnFocusRef.current = false;
                    e.preventDefault();
                  }
                }}
                className="support-fab fixed z-40 grid size-11 cursor-pointer place-items-center rounded-full border border-primary/35 bg-card/95 text-primary shadow-lg shadow-black/40 backdrop-blur-sm transition-[transform,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-primary/75 hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <Coffee className="size-[18px]" aria-hidden="true" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            sideOffset={10}
            className="border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-foreground shadow-md"
          >
            Support FocusFrame
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent
        aria-modal="true"
        onCloseAutoFocus={() => {
          suppressTooltipOnFocusRef.current = true;
          queueMicrotask(() => {
            suppressTooltipOnFocusRef.current = false;
          });
        }}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md gap-5 overflow-y-auto rounded-lg border border-border bg-card p-6 text-foreground shadow-2xl shadow-black/60 sm:p-7"
      >
        <DialogHeader className="space-y-2.5 text-left">
          <div className="eyebrow flex items-center gap-2">
            <Coffee className="size-3.5 text-primary" aria-hidden="true" />
            <span>Support</span>
          </div>
          <DialogTitle className="font-serif text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
            Enjoying FocusFrame?
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            FocusFrame is an independent project. Your support helps keep development going and
            makes future improvements possible.
          </DialogDescription>
        </DialogHeader>

        <a
          href={BUY_ME_A_COFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-xs font-semibold tracking-[0.02em] text-primary-foreground transition-[filter,transform] duration-150 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <Coffee className="size-4" aria-hidden="true" />
          <span>Buy me a coffee</span>
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </DialogContent>
    </Dialog>
  );
}
