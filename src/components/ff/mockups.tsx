import { PixelScene, type Pet } from "./pixel";

/** Code-rendered recreation of the FocusFrame new-tab dashboard (stand-in until original screenshots are supplied). */
export function DashboardMock({ pet = "cat", night = false }: { pet?: Pet; night?: boolean }) {
  return (
    <div className="bg-background">
      <div className="relative">
        <PixelScene pet={pet} night={night} />
        <div className="absolute inset-x-0 top-[12%] text-center">
          <p className="font-mono text-[9px] tracking-[0.2em] text-foreground/80 sm:text-xs">SATURDAY · 31 OCTOBER</p>
          <p className="display text-3xl text-foreground sm:text-5xl">Good evening.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
        <MiniCard title="Daily Focus"><p className="font-serif text-sm text-foreground sm:text-base">Ship the landing page</p></MiniCard>
        <MiniCard title="Top 3 Tasks">
          {["Write copy", "Review PR", "Gym"].map((t, i) => (
            <p key={t} className={`flex items-center gap-1.5 text-[10px] sm:text-xs ${i === 0 ? "text-subtle line-through" : "text-foreground"}`}>
              <span className={`size-2 border border-subtle ${i === 0 ? "bg-live" : ""}`} />{t}
            </p>
          ))}
        </MiniCard>
        <MiniCard title="Quick Links">
          <div className="flex flex-wrap gap-1">{["GH", "YT", "MDN", "Mail"].map((l) => <span key={l} className="rounded border border-border px-1.5 font-mono text-[9px] text-muted-foreground">{l}</span>)}</div>
        </MiniCard>
        <MiniCard title="Habits">
          <div className="grid grid-cols-7 gap-0.5">{Array.from({ length: 14 }, (_, i) => <span key={i} className={`aspect-square ${[0, 1, 2, 4, 7, 8, 10].includes(i) ? "bg-live" : "bg-border"}`} />)}</div>
        </MiniCard>
      </div>
    </div>
  );
}

function MiniCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 rounded border border-border bg-card p-2 sm:p-3">
      <p className="font-mono text-[8px] uppercase tracking-widest text-subtle sm:text-[9px]">{title}</p>
      {children}
    </div>
  );
}

export function CommandBarMock() {
  const rows = [["/wiki", "Wikipedia"], ["/r", "Reddit"], ["/gh", "GitHub"]];
  return (
    <div className="relative bg-background">
      <div className="opacity-30 blur-[1px]"><PixelScene night /></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-md border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 font-mono text-xs">
            <span className="text-live">›</span><span className="text-foreground">/</span><span className="anim-blink h-3.5 w-1.5 bg-live" />
            <span className="kbd ml-auto">ALT K</span>
          </div>
          {rows.map(([c, n], i) => (
            <div key={c} className={`flex items-center justify-between px-3 py-2 font-mono text-[11px] ${i === 0 ? "bg-card-hover text-foreground" : "text-muted-foreground"}`}>
              <span>{n}</span><span className="text-subtle">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
