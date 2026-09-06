# public/work/

Project screenshots. One folder per project id, matching the ids in
`src/app/data/projects.ts`.

```
public/work/saas-analytics-platform/desktop.png
public/work/saas-analytics-platform/tablet.png
public/work/saas-analytics-platform/mobile.png
public/work/mobile-banking-redesign/mobile.png
...
```

Then reference them in that project's `screens`:

```ts
screens: {
  desktop: '/work/saas-analytics-platform/desktop.png',
  tablet:  '/work/saas-analytics-platform/tablet.png',
  mobile:  '/work/saas-analytics-platform/mobile.png',
},
```

Any platform listed in `platforms` but missing from `screens` renders a
wireframe placeholder naming the file it expects — so nothing silently ships
empty.

## Suggested capture sizes

| Frame   | Capture at      | Aspect the frame crops to |
|---------|-----------------|---------------------------|
| desktop | 1600 × 1000     | 16:10                     |
| tablet  | 1200 × 1600     | 3:4  (portrait)           |
| mobile  |  900 × 1900     | 9:19 (portrait)           |

Screenshots are cropped from the **top**, so keep the important part of the
screen in the upper portion of the capture. PNG or WebP both work.

## Only list devices the product really ships on

`platforms` drives which frames are drawn. A phone-only product should list
`['mobile']` — showing an empty desktop frame next to it says the opposite of
what you want. Three frames on every project makes the responsive story
meaningless; three frames on the one project that earns it makes the point.

## `_preview/` — temporary, delete before launch

`_preview/` contains generated synthetic UI mockups (abstract dashboards, chat
threads, listing grids) so the device frames can be judged with content in
them. They are wired in automatically by `USE_PREVIEW_SCREENS` in
`src/app/data/projects.ts`.

**They are not your work and must not ship.** Set that constant to `false` and
delete this folder once your own screenshots are in.

They were produced by `tools/generate-preview-screens.py`:

```bash
MOCK_OUT=public/work/_preview python3 tools/generate-preview-screens.py
```
