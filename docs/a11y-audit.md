# Accessibility and performance audit (NJACC-28)

Scope: code-level pass, headless. Date 2026-11-13. Only `src/app/` and `src/styles.css` changed.

**Scope note:** sign-in, pricing, checkout and account pages do not exist in this repo yet (login and payments are
tracked separately). Audited what exists: Aurora multi-step waitlist, idea form, shared primitives
(button, field, dialog, toast), global styles. Re-run this audit when those flows land.

## Fixed

| Finding                                                                                             | Fix                                                                                                                             |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--color-text-light` (#777587) was 4.28:1 on page bg, 4.06:1 on `--color-surface-low` (fails 4.5:1) | Darkened to #66647a: 5.46:1 on bg, 5.18:1 on surface-low, 5.72:1 on white                                                       |
| Inputs had `outline: none` with only a 2px bottom border on focus; no global focus ring             | Global `:focus-visible` ring (brand indigo), explicit ring on inputs/textareas, `:focus-within` ring on waitlist interest chips |
| Idea textarea label had no `for`/`id`                                                               | Added `id="idea-description"` and `for`                                                                                         |
| Idea error banner and both success panels were not announced                                        | `role="alert"` on error; `role="status"` on success panels                                                                      |
| Waitlist name/email errors not tied to inputs                                                       | `aria-describedby` to error ids, `required` added                                                                               |
| Decorative Material icons read by screen readers                                                    | `aria-hidden="true"`                                                                                                            |

Already fine: waitlist step changes announced via a polite live region, progress list with `aria-current`,
interest checkboxes in a `fieldset`/`legend`, form errors with `role="alert"`.

Tests: `src/app/aurora/aurora.spec.ts` ("Aurora accessibility").

## Contrast

Brand indigo #3525cd on white passes (about 9:1). Light accent fills (`--color-primary-light`, `--accent-light`)
carry no text in the audited components. Not checked: per-app `--accent` values set in `apps.config.ts`
(each app's accent against white should be verified when changed).

## Not fixed / needs manual pass

- Real screen-reader pass (NVDA/VoiceOver) over sign-in, waitlist and checkout: **needs manual pass**.
- Razorpay overlay escapability and focus return: **needs manual pass** (integration not in this repo yet).
- Keyboard-only purchase flow: checkout does not exist yet; **needs manual pass** when built.
- Focus is not moved to the new step heading on waitlist step change (announced via live region only). Low priority.
- Full-page `aria-live` check of the `shared/dialog` focus trap was not changed; covered by its own spec.
- Lighthouse on `/`, `/pricing`, `/account`: **not run** (`/pricing` and `/account` do not exist; no headless
  Chrome run in this environment). `@supabase/supabase-js` is not a dependency yet, so no bundle impact to note.
  Run `make build` then `npx lighthouse` against a preview when those pages land.
