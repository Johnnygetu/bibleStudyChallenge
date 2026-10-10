# Amharic Nokia Pure Headline font for questions & reading verses

## Goal

Render **only** two kinds of content in the new Nokia Pure Headline font, in both React apps:

- **Quiz question text + its four answer options.**
- **The day's reading chapter list** (reader app only — the admin app has no reading/verse surface).

Everything else (greeting, buttons, "Day 1 of 1", person names, nav labels, book-grouping headers, forms) stays on the existing `Inter` / `Cormorant Garamond` stack.

## Scope / boundaries

In scope:
- `BibleStudyReaders/` — declare the font and apply it to the quiz question, quiz options, and reading chapter list.
- `BibleStudyAdmin/` — declare the font and apply it to the question text and option text.

Out of scope (explicitly):
- Person names (greeting, leaderboards, admin reader lists).
- The small book/chapter label under each quiz question (`.quiz-item__chapter`).
- Admin book-grouping header (`.book-name`) and `bible_reference` (`.q-ref`).
- Any backend, DB, or API change. This is CSS-only plus the font asset.

## Assets (already present)

- `BibleStudyReaders/src/assets/NokiaPureHeadline_Bd (2).ttf`
- `BibleStudyAdmin/src/assets/NokiaPureHeadline_Bd (2).ttf`

The filename contains a space and parentheses. Recommend copying/renaming to a clean name in each app to avoid URL-quoting pitfalls:
- `BibleStudyReaders/src/assets/nokia-pure-headline-bd.ttf`
- `BibleStudyAdmin/src/assets/nokia-pure-headline-bd.ttf`

(If renaming is avoided, the `@font-face` `src` must quote the path: `url('./assets/NokiaPureHeadline_Bd (2).ttf')`.)

## Steps

### 1. Verify the font actually has Ethiopic glyphs (gate)
Before wiring, confirm the `.ttf` contains Ethiopic codepoints (U+1200–U+137F), e.g. with `fonttools`: load the font, `getBestCmap()`, and check for U+1200/U+1240/U+1300. 
- If yes → proceed.
- If no → the browser will silently fall back for Amharic, so the visual goal won't be met. **Stop and confirm with the user** that this is the correct Amharic-capable font file.

### 2. Declare the font in each app

`BibleStudyReaders/src/index.css` and `BibleStudyAdmin/src/index.css` — add near the top (after the Google `@import`):

```css
@font-face {
  font-family: 'Nokia Pure Headline';
  src: url('./assets/nokia-pure-headline-bd.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
}
```

Add a token in each `:root`:
```css
--font-amharic: 'Nokia Pure Headline', var(--font-serif), system-ui, sans-serif;
```
(The fallback keeps current appearance if the font fails to load.)

### 3. Apply in the reader app

`BibleStudyReaders/src/components/TodayScreen.css` — add `font-family: var(--font-amharic);` to:
- `.quiz-item__question` (question text)
- `.quiz-option` (answer option text; the check icon is SVG and unaffected)
- `.chapter-group__title` (reading chapter list — book heading)
- `.chapter-toggle__label` (reading chapter list — each "Book N" item)

### 4. Apply in the admin app

`BibleStudyAdmin/src/index.css` — add `font-family: var(--font-amharic);` to:
- `.q-text` (question text)
- `.q-opt-text` (answer option text)

## Files touched

- `BibleStudyReaders/src/index.css`
- `BibleStudyReaders/src/components/TodayScreen.css`
- `BibleStudyReaders/src/assets/` (rename/copy font)
- `BibleStudyAdmin/src/index.css`
- `BibleStudyAdmin/src/assets/` (rename/copy font)

No `.jsx` changes are required (all targets are existing class names).

## Validation

1. `npm run build` in `BibleStudyReaders/` and `BibleStudyAdmin/` — confirm the font is emitted and no Vite asset-resolution error.
2. Reader app: open Today screen — Amharic question text, the four options, and the reading chapter list render in Nokia; greeting/buttons/"Day 1 of 1"/names are unchanged.
3. Admin app: open Quizzes — question text and the four options render in Nokia; book header, references, and forms unchanged.
4. If the font lacks Ethiopic glyphs, expect fallback rendering — treat as a blocker (see step 1).

## Risks / notes

- **Glyph coverage** is the main risk; see the gate in step 1.
- **Rebuild required**: reader app is served from `dist/`; the change only appears after `npm run build` (or `npm run dev`). Tell the user.
- The font is the **Bold headline** cut; Amharic body copy may look heavier than the current type. Acceptable per the request, but worth an eyeball.
- No functional/regression risk to data — styling only.