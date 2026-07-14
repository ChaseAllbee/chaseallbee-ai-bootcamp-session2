# UI Guidelines

## Design Philosophy

The application should feel **modern and minimal**. The UI should stay out of the user's way — clean whitespace, a restrained color palette, and clear typography. Every element should have a clear purpose; decorative complexity should be avoided.

---

## Layout

- The app is centered in the viewport with a max width of `800px`.
- A single-column layout is used throughout; no sidebars.
- Sections are separated by consistent vertical spacing (`gap: 20px`).
- The page header sits at the top and contains only the app title and a short subtitle.
- The add-task form and task list each live in their own clearly delineated section.

---

## Color Palette

| Role | Current Value | Notes |
|---|---|---|
| Background | `#ffffff` / page default | Light, neutral |
| Surface (cards/sections) | `#f5f5f5` | Subtle off-white |
| Header background | `#282c34` | Dark charcoal |
| Header text | `#ffffff` | White |
| Primary action (buttons) | `#61dafb` | React blue — can be refined to a more neutral accent |
| Primary action hover | `#21a1c9` | Darker shade |
| Destructive action | `#f44336` | Red for delete |
| Destructive hover | `#d32f2f` | Darker red |
| Error text | `#d32f2f` | Matches destructive |
| Body text | System default (dark) | Via `-apple-system` font stack |
| Dividers | `#ddd` | Light grey |

**Guidance**: Keep the palette small. Introduce new colors only when semantically necessary (e.g., overdue task warning). Prefer grey tones for neutral UI chrome.

---

## Typography

- **Font family**: System font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, etc.) for fast load and native feel.
- **Base size**: Browser default (`16px`).
- **Headings**:
  - Page title (`h1`): `1.8rem`, normal weight is acceptable; bold for emphasis.
  - Section headings (`h2`): slightly smaller, consistent weight.
- **Body text**: `1rem`, comfortable line-height (`1.5` recommended).
- Avoid more than two font sizes on any single view.

---

## Components

### Buttons
- Rounded corners (`border-radius: 4px`).
- Adequate padding (`8px 16px`).
- Bold label text for readability.
- Clear hover state (darkened background).
- Destructive buttons (Delete) use red; primary actions use the accent color.
- Buttons should be concise: one or two words maximum.

### Inputs
- Full-width within their container (flex: 1).
- Light border (`1px solid #ddd`), rounded corners (`border-radius: 4px`).
- Comfortable padding (`8px`).
- Focus state should be visually clear (e.g., border color change or subtle box shadow).
- Date picker input should be styled consistently with text inputs.

### Task List Items
- Each task is a row with the task name on the left and action controls on the right.
- Rows are separated by a light bottom border; the last row has no border.
- Adequate vertical padding (`10px`) for touch-friendliness.
- Overdue tasks: display due date in red with a visual indicator (e.g., a warning icon or "Overdue" label).
- Completed tasks: strikethrough on the task name, muted text color, and moved below active tasks.

### Sections / Cards
- Light background (`#f5f5f5`), rounded corners (`border-radius: 8px`).
- Subtle box shadow (`0 2px 4px rgba(0,0,0,0.1)`) for depth without heaviness.
- Consistent internal padding (`20px`).

---

## Spacing

- Use a base spacing unit of `8px`. All padding, margins, and gaps should be multiples of `8px` (e.g., `8px`, `16px`, `20px`, `24px`).
- Avoid cramped layouts — prefer slightly more whitespace over less.

---

## Responsiveness

- The layout should remain usable on screens as narrow as `375px` (mobile).
- The `max-width: 800px` container should be full-width on smaller screens with appropriate horizontal padding.
- The add-task form inputs and buttons should stack vertically on small screens if needed.

---

## Accessibility

- All interactive elements must be keyboard-navigable.
- Buttons must have descriptive labels (avoid icon-only buttons without `aria-label`).
- Color alone must not be used to convey meaning (e.g., overdue tasks need both color and a text/icon indicator).
- Form inputs must have associated labels or `placeholder` attributes at minimum.

---

## What to Avoid

- Heavy gradients or complex background patterns.
- Multiple competing accent colors.
- Animations beyond simple transitions (hover state changes are fine).
- Dense, text-heavy layouts — use whitespace generously.
- Inline styles in components; use CSS classes.
