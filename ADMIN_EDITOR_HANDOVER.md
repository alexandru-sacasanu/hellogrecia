# Handover: live-preview click-to-edit admin editor

## What's done (merged to main)
Backend/CRUD for everything the editor will need to open in its side panel:
- `apps/web/src/app/admin/{DestinationForm,CampaignForm,HomeSectionForm}.tsx` + their
  `destinatii/`, `campanii/`, `home/[id]`, `home/noua` pages and `actions.ts`/`write.ts` functions.
- RLS write policies for `destinations`/`campaigns` (`supabase/migrations/20261016120000_*`).
- Offer editing (`admin/oferte/[id]`) already existed before this work.

## What's NOT done: the webview itself
Goal: `/admin/editor` shows an iframe of the real site; admin clicks a card/text/section in
the iframe and a side panel opens the right admin edit form (reusing the pages above) —
no separate editing UI to build, just wire the two together.

### Design (reasoned through, not yet built)
1. **`EditModeBridge.tsx`** (new, "use client", mounted once in `app/layout.tsx` wrapped in
   `<Suspense>`): on mount, `if (window.self === window.top) return;` (inert for every real
   visitor — only activates when embedded in the admin's iframe, same-origin so postMessage
   is simple/safe). Then:
   - Add a capture-phase `document.addEventListener("click", ..., true)` that does
     `e.target.closest("[data-edit]")`; if found, `preventDefault()` + `stopPropagation()` and
     `postMessage({source:"hg-edit", kind:"edit", type: el.dataset.edit, id: el.dataset.editId}, location.origin)`.
     **Only** elements carrying `data-edit` are intercepted — everything else (nav, search
     form, currency switch) keeps working normally, so admin can still browse the live site
     inside the iframe.
   - Post `{source:"hg-edit", kind:"nav", path}` on `usePathname()`/`useSearchParams()` change
     so the editor shell's address bar can track the iframe.
2. **`data-edit="<type>" data-edit-id="<id>"` attributes** to add (plain HTML attrs, no JS
   needed on the components themselves):
   - `OfferCard.tsx` → `data-edit="offer"`, id = `o.id`
   - `DestinationCard.tsx` (both variants) → `data-edit="destination"`, id = `d.id`
   - `CampaignBanner.tsx` → `data-edit="campaign"`, id = `c.id`
   - `blocks.tsx` `Hero` → wrap **just** the h1+subtitle block (not the search form/CTA
     button — those must stay clickable) in a div with `data-edit="section"`, id = the
     home_section id (thread `id` prop into `Hero`, `OfferRow`, `DestinationGrid`,
     `BenefitTiles` — currently only passed as React `key`, not as a prop)
   - `OfferRow`'s `.sec-head`, `DestinationGrid`'s `.sec-head` → same section-edit target
   - `BenefitTiles`, new `TextBlock` → whole section is safe to tag (no interactive children)
   - **Do NOT** wrap whole sections that contain interactive children (search form, links,
     favorite buttons) in `data-edit` — click delegation uses `closest()`, so an outer
     `data-edit` would swallow clicks meant for inputs/buttons inside it. Only tag precise
     text/heading regions or fully-static sections.
   - `oferte/[slug]/page.tsx` → wrap the `offer-main` text column (title/summary/facts) in
     `data-edit="offer"`, id = `o.id` (reuses the same offer edit panel — OfferForm already
     covers meeting_point/included/cancellation_policy/description, no new fields needed)
   - `destinatii/[slug]/page.tsx` → same idea with `data-edit="destination"`
3. **`globals.css`**: `html.hg-edit-mode [data-edit]{cursor:pointer;outline:2px dashed transparent}`
   `html.hg-edit-mode [data-edit]:hover{outline-color:#ff6a3d}`. `EditModeBridge` adds the
   `hg-edit-mode` class to `document.documentElement` on mount.
4. **`/admin/editor/page.tsx`** (new, client component `EditorShell`):
   - `<iframe src="/">` (the live site) + a small top bar (path display, refresh).
   - A right-side panel, hidden until a message arrives; on `{kind:"edit", type, id}` set its
     `src` to `/admin/oferte/{id}`, `/admin/destinatii/{id}`, or `/admin/campanii/{id}`
     (`type` maps directly to the route segment). **Simplification already decided**: don't
     bother hiding the admin sidebar/public header in the panel (`embed=1` + layout refactor)
     for v1 — just make the panel wide enough (~520px). Cosmetic, not functional.
   - Section clicks (`type === "section"`) → panel `src = /admin/home/{id}`.
5. Add `{ href: "/admin/editor", label: "Editor live" }` to `admin/layout.tsx` NAV.

### Known traps
- **Another session/person is also actively pushing to this repo** (Netlify setup, logo
  swap, time-of-day hero — see commits around `9c83ead`). `git fetch && git log origin/main`
  before every push; expect to rebase.
- This sandbox cannot reach `*.supabase.co` at all (proxy 403 + DNS fails) — can't run/test
  the dev server here. Verify via `npx tsc --noEmit` + `npm run lint` + reasoning, or on a
  machine with real network access. `next build` will compile/typecheck fine and only fail
  at the Supabase-calling static-generation step, same as every previous pass.
- Run `npx next typegen` before `tsc --noEmit` if `.next/` was deleted — `PageProps`/
  `LayoutProps` are generated, not real types, and `tsc` fails to resolve them otherwise.
