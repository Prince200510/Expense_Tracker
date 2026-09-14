---
name: Institutional Wealth & Expense Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#97f5cc'
  on-secondary-container: '#007353'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#40000d'
  on-tertiary-container: '#f13f5c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#97f5cc'
  secondary-fixed-dim: '#7bd8b1'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#920029'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  currency-display:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  currency-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an executive-grade, institutional wealth terminal tailored for high-cadence personal finance and expense intelligence. The aesthetic merges precision minimalism with contemporary financial architecture: disciplined, discreet, and authoritative. It deliberately strips away consumer fintech tropes—such as neon gradients, heavy frosting, and gamified micro-interactions—in favor of a high-density, legible, and reassuring environment built for serious capital allocation.

The visual tone reflects private banking infrastructure: clean surfaces, razor-sharp micro-borders, quiet typography, and surgical color accents reserved strictly for directional delta, risk indicators, and financial state changes.

## Colors

The color architecture is rooted in high-contrast neutrality with purposeful, disciplined functional accents.

- **Primary (`#0F172A` - Slate 900):** Anchors major structural headers, primary actions, and top-tier numerical totals.
- **Secondary / Positive State (`#047857` - Emerald 700):** Used strictly for credited sums, positive yield, SIP investments, and surplus budget metrics.
- **Tertiary / Negative State (`#BE123C` - Crimson 700):** Reserved for outflow spikes, tax withholdings, over-budget warnings, and debits.
- **Warning / Pending (`#B45309` - Amber 700):** Denotes clearing delays, pending UPI mandates, and credit cycle thresholds.
- **Base Surfaces:** Warm Off-White (`#F8FAFC` base canvas with pure `#FFFFFF` module cards) to reduce eye fatigue during prolonged balance sheets reconciliation.
- **Borders & Dividers:** Subtle, structural micro-lines (`#E2E8F0` and `#F1F5F9`) providing pixel-precise boundaries without visual clutter.

## Typography

The typographic hierarchy combines **Hanken Grotesk** for clean, modern readability with **JetBrains Mono** for strictly formatted, non-proportional monetary figures.

- **Tabular Numerics:** All currency figures (`₹`), balances, transaction values, and percentage yields must enforce tabular figures (`font-variant-numeric: tabular-nums`) through the monospace token set. This ensures aligned decimal places across deep financial ledgers.
- **Indian Rupee Formatting:** Always render the standard symbol `₹` with a tight kerning lock against the principal number. Group values via the Indian numbering format (e.g., `₹12,48,250.00`).
- **Hierarchy of Purpose:** Merchant and entity names (e.g., *HDFC Bank*, *Zerodha Broking*, *Zepto Marketplace*) render in medium-weight primary text, while payment metadata (e.g., *UPI/REF-839210*, *NEFT*) utilize high-contrast, uppercase monospace caption tokens.

## Layout & Spacing

This layout adheres to a high-density, mobile-first modular grid built around an 8pt base grid with a 4pt sub-unit for tight data pairing.

- **Mobile Canvas Grid:** Single-column layout bounded by `margin-mobile` (`1rem`) on phones, scaling to a 4-column structured sub-grid on tablets and small viewports with `gutter-mobile` (`0.75rem`).
- **Data Densification:** Ledger line-items prioritize vertical economy. Grouped transactions use `space-xs` and `space-sm` gaps between category tags, merchant labels, and debit amounts to prevent unnecessary scroll fatigue.
- **Touch Ergonomics:** All interactive list items, tab switches, and quick-filter chips strictly maintain a minimum vertical touch target of 48px, even when the visual bounding box is condensed (`space-md`).

## Elevation & Depth

Visual hierarchy is communicated through **tonal separation and crisp micro-borders**, rejecting heavy shadows and artificial blurs:

- **Surface Layering:** 
  - Canvas background: `#F8FAFC` (Slate 50).
  - Default card & container surfaces: `#FFFFFF`.
  - Nested ledger wells & metadata containers: `#F1F5F9` (Slate 100).
- **Micro-Borders:** Every card, module, and input features a deterministic 1px solid border (`#E2E8F0`). This creates clear bounding boxes suited for complex data sheets.
- **Ambient Shadow (Reserved):** Used exclusively on floating utility bars, bottom sheets, and elevated transaction confirmation trays:
  - `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02);`
- No glassmorphic transparency is permitted over transactional tables. Background surfaces behind sticky headers use `#FFFFFF` with a 1px border separator on scroll.

## Shapes

The design system maintains a **Soft (`1`)** geometry:
- **Base Components:** 0.25rem (4px) corner radii on input containers, micro tags, status badges, and transaction rows.
- **Structural Cards:** 0.5rem (8px) corner radii for analytics widgets, account summaries, and breakdown cards.
- **Bottom Drawers & Modals:** 0.75rem (12px) on top radii to establish clear container grouping while preserving a serious, non-playful profile.
- Strict rejection of pill buttons or circular icons except for standard 32px/40px merchant avatar glyphs.

## Components

### 1. Transaction Ledger Rows
- **Container:** Full-width row with a 1px bottom divider (`#F1F5F9`). Touch-highlight state: `#F8FAFC`.
- **Left Anchor:** 36px square institution/merchant badge (rounded-sm) in `#F1F5F9` housing a high-contrast mono-brand logo or two-letter categorical glyph.
- **Body:** Merchant name (Hanken Grotesk 14px, semibold) with an immediate baseline subline for payment mode and timestamp (JetBrains Mono 11px, `#64748B`, e.g., `UPI · ICICI **4012 · 14:32`).
- **Right Anchor:** JetBrains Mono tabular amount. Debits show `-₹X,XXX.XX` in `#0F172A`; credits show `+₹X,XXX.XX` in `#047857`.

### 2. Primary & Auxiliary Buttons
- **Primary (Action/Transfer):** Solid `#0F172A` background, white typography, 0.25rem border-radius, 48px height, medium weight. Zero gradient.
- **Secondary (Filter/Export):** 1px border `#E2E8F0`, `#FFFFFF` surface, `#0F172A` text.
- **Destructive:** Border and text in `#BE123C`, background `#FFF1F2`.

### 3. Filter Chips & Categorical Toggles
- Height: 32px.
- Unselected: Surface `#FFFFFF`, border `#E2E8F0`, text `#64748B`.
- Selected: Surface `#0F172A`, border `#0F172A`, text `#FFFFFF`.
- Typography: JetBrains Mono 11px, medium, uppercase.

### 4. Input Fields (Amount & UPI ID)
- Minimalist top-label in JetBrains Mono 10px uppercase.
- Input box: `#FFFFFF` surface, 1px border `#CBD5E1`, focused state transitions cleanly to 1px `#0F172A`.
- Dedicated large-currency inputs feature a static `₹` prefix in slate-400 with oversized tabular numerals (28px) to reduce input error.

### 5. Metric Cards & Cash Flow Widgets
- `#FFFFFF` surface with 1px border `#E2E8F0`.
- Top-right delta badge: Pill-free tag displaying percentage variance against rolling 30-day average (`+4.2%` in `#047857` with `#ECFDF5` fill).
- Sparklines rendered without filled gradient fills: 1.5px solid stroke in `#0F172A` or `#047857`.