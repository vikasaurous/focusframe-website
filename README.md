# FocusFrame Website

Official website for **[FocusFrame](https://github.com/vikasaurous/FocusFrame)** — a browser new-tab dashboard designed to make the start of each browsing session more intentional.

The site introduces FocusFrame's features, explains its privacy model, and includes interactive previews of the dashboard, Command Bar, and pixel-art scene.

## What is FocusFrame?

FocusFrame replaces the browser's default new-tab page with a personal productivity space. The extension brings together:

- **Daily focus** — keep your main intention visible.
- **Tasks and habits** — organize three daily priorities and track up to five habits.
- **Quick links and notes** — keep frequently used destinations and thoughts close.
- **Command Bar** — launch searches, websites, and supported AI services from a keyboard shortcut.
- **Year in dots** — see the year progress day by day.
- **Pixel-art companion** — add a small animated cat, dog, or dinosaur to your workspace.
- **Personalization** — adjust dashboard modules, layout, accent color, and companion.

The website is a separate project from the browser extension itself. Find the extension source in the [FocusFrame repository](https://github.com/vikasaurous/FocusFrame).

## Website features

- Responsive product landing page.
- Interactive product preview with Dashboard, Command Bar, and Pixel Scene tabs.
- Embedded demo pages served from `public/focusframe-demo/`.
- Feature, layout, privacy, FAQ, and browser availability sections.
- Pixel-art illustrations and motion effects.
- Accessible navigation and reduced-motion support.

## Tech stack

- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS 4
- Lucide React
- Vitest

## Run locally

### Requirements

- Node.js
- npm

### Install dependencies

```bash
git clone https://github.com/vikasaurous/focusframe-website.git
cd focusframe-website
npm ci
```

### Start development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Create production build |
| `npm run build:dev` | Create development-mode build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
├── components/
│   └── ff/                 # Landing page sections and product UI
├── config/                 # Product links and shared site configuration
├── lib/                    # Animation, state, and utility logic
├── routes/                 # TanStack file-based routes
├── router.tsx              # Router configuration
└── styles.css              # Global styles and design tokens

public/
├── focusframe-demo/        # Static interactive extension previews
├── favicon.svg
└── icon128.png
```

## Privacy

The website's interactive previews run locally in the visitor's browser. The extension stores its settings and content in browser storage and does not require a FocusFrame account or FocusFrame backend. External services opened through the Command Bar are subject to their own privacy policies.

## Links

- **Website repository:** [vikasaurous/focusframe-website](https://github.com/vikasaurous/focusframe-website)
- **Browser extension source:** [vikasaurous/FocusFrame](https://github.com/vikasaurous/FocusFrame)
- **Issues and bug reports:** [Open an issue](https://github.com/vikasaurous/focusframe-website/issues)

---

Less noise. More intention.
