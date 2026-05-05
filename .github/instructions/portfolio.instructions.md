---
applyTo: '**'
---

# Rahul Kolli — Personal Portfolio: Development Instructions

## Project Identity
- **Owner**: Rahul Kolli
- **GitHub**: github.com/rahulkolli98
- **Stack**: Next.js 16, App Router, TypeScript (strict), Tailwind CSS v4, lucide-react
- **Purpose**: Personal developer portfolio — static, no backend, no CMS

## Architecture Rules

### Data Layer
- ALL content (experience, projects, skills, contact) lives in `lib/data.ts` as typed TypeScript constants
- Never hardcode resume content directly inside components or pages
- Each data shape must have an explicit TypeScript interface defined at the top of `lib/data.ts`

### Routing
- One route per section: `/`, `/about`, `/experience`, `/projects`, `/skills`, `/contact`
- Use Next.js App Router file-system routing — one `page.tsx` per folder under `app/`
- No dynamic routes needed for the bare-minimum version

### Components
- Shared layout components (Navbar, Footer) live in `components/`
- Reusable page-specific components (e.g. `ExperienceCard`, `ProjectCard`) also go in `components/`
- One-off page sections can stay inline in the page file

### Styling
- Use Tailwind CSS utility classes only — no custom CSS beyond `app/globals.css`
- Design is intentionally deferred — use neutral, readable styles until a design pass is requested
- No UI component libraries (no shadcn, no MUI) until explicitly approved
- Stick to a plain white/slate palette for the bare-minimum phase

## Code Quality
- Strict TypeScript — no `any` types
- All components are React Server Components by default
- Add `'use client'` only when interactivity or browser hooks are required
- No unnecessary `useEffect` — prefer passing data via props from Server Components
- Keep components focused — if a file exceeds ~80 lines, consider splitting

## Implementation Discipline
- Implement one section/step at a time and stop for confirmation
- Never add animations, fancy layouts, or extra sections beyond what is requested
- When adding icons, use `lucide-react` exclusively
- Do not install additional packages without asking first

## Content Source
All content is sourced from `resume.txt`. Key structured data lives in `lib/data.ts`:

### Experience (chronological, newest first)
1. Eventzai — Full Stack Developer (Apr 2024–Present)
2. Blooph — Full Stack Developer (Jun 2023–Mar 2024)
3. Dept of Education, IIT — Data Admin (Aug 2023–May 2024)
4. Accenture–CVS Health — Associate Software Engineer (Sep 2020–Aug 2022)

### Projects
- CodeForGood (Mesa Farm Volunteer)
- Mood-Based Movie/Book Recommender
- Restaurant Menu Decoder
- Shopping List Mobile App
- Fake News Detection

### Skills Categories
Languages | Frameworks & Libraries | Databases | Cloud & DevOps | Tools & Platforms | AI/ML Tools | Architecture & Design

## File Structure
```
personal-portfolio/
├── .github/
│   └── instructions/
│       └── portfolio.instructions.md   ← this file
├── app/
│   ├── layout.tsx                      ← root layout (Navbar + Footer)
│   ├── page.tsx                        ← Hero
│   ├── about/page.tsx
│   ├── experience/page.tsx
│   ├── projects/page.tsx
│   ├── skills/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ExperienceCard.tsx
│   └── ProjectCard.tsx
├── lib/
│   └── data.ts                         ← all resume data + TypeScript interfaces
└── PLAN.md
```
