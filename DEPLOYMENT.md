# Deploying the FocusFrame website

The easiest path is the **Publish** button in Lovable (free `*.lovable.app` URL, custom domains supported in project settings).

To self-host, export the project to GitHub (Lovable → GitHub → Connect) into a repository such as `focusframe-website`.

## Cloudflare (recommended)
This project is built with TanStack Start and targets Cloudflare Workers.
1. Cloudflare Dashboard → Workers & Pages → Create → Import a repository.
2. Select the repository, production branch `main`.
3. Build command: `npm run build`. Deploy command: `npx wrangler deploy` (the build emits a Worker-ready output).
4. Deploy, then add your custom domain under the project's Domains tab; Cloudflare DNS records and HTTPS are configured automatically.
5. Every push to `main` redeploys.

## Vercel (alternative / staging)
1. Import the repository in Vercel; Vercel detects TanStack Start.
2. Build command `npm run build`. Deploy.
3. Use a separate domain or subdomain (e.g. `staging.`) — don't point the same domain at both hosts.

## Before launch
- Set `FIREFOX_ADDON_URL` (and later Chrome/Edge) in `src/config/site.ts`.
- Replace `https://example.com` in `public/sitemap.xml` and set `WEBSITE_URL`.
