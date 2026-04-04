

## Plan: Replace Accessibility Icon with Custom Image

### What changes
Replace the Lucide `Accessibility` icon with the uploaded universal accessibility symbol image in all locations where it appears:

1. **Copy the uploaded image** to `src/assets/accessibility-icon.jpeg`

2. **`src/components/layout/Header.tsx`** — Replace the `<Accessibility>` Lucide icon (lines 126 and 209) with an `<img>` tag using the imported image. Remove the `Accessibility` import from lucide-react if no longer needed.

3. **`src/components/AccessibilityPanel.tsx`** (line 285) — Same replacement inside the panel header.

4. **`src/pages/Accessibility.tsx`** (line 85) — Same replacement in the accessibility page header.

### Technical details
- Import: `import accessibilityIcon from "@/assets/accessibility-icon.jpeg"`
- Replace `<Accessibility className="w-5 h-5" />` with `<img src={accessibilityIcon} alt="" className="w-5 h-5 object-contain" aria-hidden="true" />`
- Adjust sizes per context (w-5 h-5 for header buttons, w-5 h-5 for panel header)

