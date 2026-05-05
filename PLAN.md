# Personal Portfolio — Implementation Plan

**Owner**: Rahul Kolli  
**Stack**: Next.js 16 · App Router · TypeScript · Tailwind CSS v4 · lucide-react  
**Goal**: A bare-minimum, content-complete portfolio. Design/styling deferred to Phase 2.

---

## Phases

### Phase 0 — Foundation ✅
- [x] Scaffold project via `create-next-app` (Next.js 16, TypeScript, Tailwind v4, App Router)
- [x] Create `.github/instructions/portfolio.instructions.md`
- [x] Create this `PLAN.md`

---

### Phase 1 — Data & Dependencies
- [ ] **Step 1**: Install `lucide-react` (only extra dependency)
- [ ] **Step 2**: Create `lib/data.ts` — all resume data as typed TypeScript constants
  - Interfaces: `Experience`, `Project`, `SkillGroup`, `ContactInfo`
  - Constants: `experiences[]`, `projects[]`, `skillGroups[]`, `contact`

---

### Phase 2 — Shared Layout
- [ ] **Step 3**: Create `components/Navbar.tsx` — site name left, nav links right (Home, About, Experience, Projects, Skills, Contact)
- [ ] **Step 4**: Create `components/Footer.tsx` — GitHub link, name, year
- [ ] **Step 5**: Update `app/layout.tsx` — wrap content with `<Navbar>` and `<Footer>`

---

### Phase 3 — Pages (one at a time)
- [ ] **Step 6**: `app/page.tsx` → **Hero** — Name, job title tagline, GitHub button
- [ ] **Step 7**: `app/about/page.tsx` → **About** — Bio paragraph from resume summary
- [ ] **Step 8**: `app/experience/page.tsx` → **Experience** — Work history cards with bullet points
- [ ] **Step 9**: `app/projects/page.tsx` → **Projects** — Project cards with stack tags
- [ ] **Step 10**: `app/skills/page.tsx` → **Skills** — Skills grouped by category
- [ ] **Step 11**: `app/contact/page.tsx` → **Contact** — Email + GitHub link

---

### Phase 4 — Verification
- [ ] **Step 12**: `npm run dev` — all 6 routes render correctly
- [ ] **Step 13**: `npm run build` — TypeScript strict mode passes, no errors

---

### Phase 5 — Design (deferred)
- TBD: Typography, color palette, spacing system, animations
- TBD: Mobile responsiveness pass
- TBD: Dark mode

---

## Conventions (see `.github/instructions/portfolio.instructions.md` for full rules)
- All content sourced from `lib/data.ts` — never hardcode in components
- Server Components by default; `'use client'` only when needed
- Tailwind only — no extra CSS libraries
- `lucide-react` for all icons
