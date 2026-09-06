# shridas.com — Ansh Yadav, Product Designer

Portfolio site. React 18 + Vite 6 + Tailwind v4, with a client-side CMS at `/admin`.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

## Before this goes live

1. **Add `public/resume.pdf`.** The header, footer, about and contact pages all
   link to `/resume.pdf`. Without the file those links 404.
2. **Add `public/portrait.jpg`** (optional). A photo on a plain background suits
   the editorial layout better than the bundled one, which has a purple gradient
   circle baked in. If the file is absent the bundled photo is used.
3. **Turn off the preview screenshots.** `public/work/_preview/` holds 38
   generated SVG mockups — synthetic dashboards, chat and listing UIs — wired
   in so you can see how the device frames look with content. **They are not
   your work.** Set `USE_PREVIEW_SCREENS = false` in
   `src/app/data/projects.ts` to remove all of them at once, and delete the
   folder. Real screenshots you add always win over the preview, so you can
   fill projects in one at a time and flip the switch when the last one is done.
4. **Add project screenshots.** There is no stock imagery on this site — every
   project renders in CSS device frames that show your own screenshots. Drop
   PNGs in `public/work/<project-id>/{desktop,tablet,mobile}.png` and list the
   paths in that project's `screens` in `src/app/data/projects.ts`. Any frame
   without a screenshot shows a wireframe naming the file it wants. See
   `public/work/README.md` for capture sizes.
5. **Check each project's `platforms`.** That array decides which device frames
   are drawn. Only list devices the product genuinely ships on — three frames on
   every project makes the responsive story meaningless.
6. **Fill in the placeholders.** Every `[bracketed]` string in
   `src/app/data/projects.ts` and `src/app/pages/About.tsx` renders on the page
   with a dotted underline. Search the source for `[` or just look for dotted
   text in the browser — when none is left, the content is done.
7. **Review `src/app/data/services.ts`.** Prices carried over unchanged from the
   previous site; confirm they are still what you charge.
8. **Rotate the admin password.** See the security note below.

## Résumé

Source: `resume/resume.html`. Output: `public/resume.pdf`, which is what the
header, footer, About and Contact pages all link to.

```bash
npm run resume     # re-renders the PDF from the HTML via headless Chrome
```

Edit the HTML, run the command, done. Two things are marked in red and dotted
in the PDF and must be filled before you send it anywhere:

- the SRIIO bullet (what you do there)
- Education (degree, institution, years) — you never told me these

It is deliberately a single column with no sidebar: applicant tracking systems
scramble multi-column layouts. All text is selectable and the PDF carries
`/ToUnicode` maps, so extraction works.

## Client confidentiality

Never name a client of an employer anywhere on this site. Employer names
(CheckMed, Nityom, Neuromotion Systems, SRIIO) are your own employment history
and are already public on your profile — their customers are not yours to
publish. An earlier draft named one enterprise customer; it has been removed
from `src/app/data/projects.ts`.

## The `platforms` arrays are a guess

`platforms` in `src/app/data/projects.ts` decides which device frames get drawn
per project. I inferred each from what the product is for — Fleet Management
got mobile because of the driver app, Control Panel is desktop-only as an
internal tool, and so on. Check them: listing a device the product does not
support is the sort of claim an interviewer will test.

## Structure

```
src/
  styles/
    index.css        global base + component layer (all custom CSS)
    theme.css        design tokens — the single source of truth
    tailwind.css     Tailwind entry point + a few utilities
  app/
    data/            site identity, projects, services — edit content here
    components/site/ editorial primitives (Reveal, Copy, WorkIndex, …)
    pages/           one file per route
    components/cms/  the /admin CMS, untouched by the redesign
```

### Custom CSS must live in `@layer components`

Tailwind v4 orders its layers `theme, base, components, utilities`, and
**unlayered CSS beats every layer**. An unlayered `.btn { display: inline-flex }`
silently wins against `md:hidden`, which breaks responsive utilities on any
element carrying a custom class. `src/styles/index.css` wraps all component CSS
in `@layer components` for this reason — keep new rules inside that block.

## Security note

`src/app/contexts/AuthContext.tsx` compares against a hardcoded email and
password, in client-side JavaScript, shipped to every visitor in the bundle.
It protects nothing — anyone can read the credentials in devtools or in this
repository, and `/admin` writes to `localStorage` rather than a server. Treat
the CMS as a local convenience, not access control, and do not reuse that
password anywhere else. `ADMIN_CREDENTIALS.md` in this repo contains the same
secrets in plaintext.
