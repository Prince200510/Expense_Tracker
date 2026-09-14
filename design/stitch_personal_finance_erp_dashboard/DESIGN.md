---
name: Institutional Ledger & Wealth ERP
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
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002114'
  on-tertiary-container: '#069669'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  numeric-metric:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  numeric-table:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies an institutional-grade financial operating environment engineered for private wealth management, capital allocation, and personal enterprise resource planning. The visual voice is calculated, unyielding, and mathematically rigorous—drawing direct inspiration from high-frequency trading terminals, institutional treasury desks, and sovereign wealth audit logs. 

The aesthetic is grounded in **Modern Technical Minimalism** layered with razor-sharp structural discipline. Visual noise, decorative illustrations, arbitrary gradients, and exaggerated radiuses are systematically eliminated. In their place, the interface prioritizes extreme data clarity, unambiguous information hierarchy, dense ledger surfaces, and surgical typographic alignment. The emotional tone must project total fiduciary control, forensic clarity, and institutional permanence.

## Colors

The palette is engineered around structural stability and rigorous financial semantics:

- **Primary Canvas & Structural Neutrals:** The bedrock relies on slate neutrals (`#F8FAFC` base application background, `#F1F5F9` sub-tier panels, `#FFFFFF` elevated functional cards). Grid structural demarcation is governed strictly by hair-thin strokes (`#E2E8F0` resting borders, `#CBD5E1` active boundaries, `#94A3B8` high-emphasis framing).
- **Executive Core:** `#0F172A` (Obsidian Slate) governs primary structural chrome, brand anchor elements, and primary text headers. Crisp Cobalt (`#2563EB`) provides precise visual focus, selected tabs, interactive active states, and focused data points.
- **Strict Financial Semantics:**
  - **Yield & Surplus (Emerald):** `#059669` (text/solid fills) and `#ECFDF5` (background badges) designate positive returns, inward cash flow, and asset growth.
  - **Deficit & Liability (Crimson):** `#DC2626` (text/solid fills) and `#FEF2F2` (background badges) convey debit velocity, expense overruns, and capital decay.
  - **Threshold Warnings (Amber):** `#D97706` (text/solid fills) and `#FFFBEB` (background badges) demarcate budget consumption exceeding 75%, statutory audit dates, and margin exposure.
- **Categorical Data Accents:** Analytical charts rely on an orthogonal 6-color system: Cobalt (`#2563EB`), Emerald (`#10B981`), Amber (`#F59E0B`), Violet (`#7C3AED`), Cyan (`#06B6D4`), and Rose (`#F43F5E`).

## Typography

Typography enforces absolute visual order and numerical integrity. All monetary amounts, ledgers, volume indicators, and transaction records mandate `font-feature-settings: "tnum" 1, "cv05" 1, "cv01" 1` to guarantee proportional alignment across multi-column data sheets.

- **Primary Typeface:** `Inter` handles operational UI, navigation, table headers, and structural KPI metrics. Negative tracking (`-0.01em` to `-0.02em`) is applied to weights above 500 for compact clarity.
- **Monospace Ledger Core:** `JetBrains Mono` is deployed for financial data grids, balance reconciliation tables, asset codes, timestamps, and Indian Rupee (`₹`) precision accounting.
- **Currency Standard:** The rupee symbol (`₹`) is rendered in monospace weight alongside its numeric string (e.g., `₹ 12,48,500.00`) to guarantee vertical column decimal parity across hundreds of consecutive ledger entries.

## Layout & Spacing

The layout is architected around a desktop-first (target 1440px), compact 8-pixel baseline framework. Layout components conform to strict multi-pane workstation mechanics:

- **Application Canvas Grid:** Desktop environments utilize a 12-column dynamic grid pinned by a fixed 240px collateral navigation rail on the left and an optional 360px collateral ledger drawer on the right. Main operational space maintains `1rem` (16px) gutters, collapsing to `0.5rem` (8px) within high-density nested financial tables and analytics grids.
- **Responsive Adaptation:**
  - **Desktop (1440px+):** Full analytical view with multi-card financial KPI rows, split chart canvases, and live data sheets.
  - **Tablet (768px – 1024px):** Collapsible sidebar rail into compact icon bar (56px width); secondary KPI metrics stack into dual 6-column modules; horizontal table overflow engages smooth native hardware scrolling with sticky primary key columns.
  - **Mobile (< 768px):** Structural rearrangement into single-column vertical stacks; padding reduces to `0.75rem`; transaction tables transform into condensed summary lists with bottom-sheet drawer disclosures.
- **Density Rhythms:** Component interior vertical padding is deliberately compressed to maximize above-the-fold telemetry (`space-xs` and `space-sm` dominate table row heights, dropdown options, and metric pill margins).

## Elevation & Depth

This system avoids deep diffuse shadows and blurred glass surfaces. Depth is established through structural layering, tonal differentiation, and razor-sharp borders:

- **Level 0 (App Shell):** Tonal neutral base `#F8FAFC`. Zero elevation, zero shadows.
- **Level 1 (Data Cards & Worksheets):** Crisp `#FFFFFF` elevated structural panels bounded by a crisp 1px perimeter border of `#E2E8F0`. Soft contact shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
- **Level 2 (Active Dropdowns, Filter Menus, Flyouts):** Solid `#FFFFFF` fill framed by `#CBD5E1` border with structured directional elevation: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Forensic Modals, Audit Overlays):** Surface `#FFFFFF` enclosed by a precision dark-tint border `#94A3B8`, anchored by high-contrast ambient dispersion: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. All modals utilize an institutional dark scrim: `rgba(15, 23, 42, 0.6)`.

## Shapes

The geometric framework enforces an authoritative and disciplined posture using `roundedness: 1`:

- **Standard Elements (Input fields, table cells, metric badges):** `0.25rem` (4px). Provides subtle edge anti-aliasing without introducing casual soft curves.
- **Containers & Functional Cards:** `0.375rem` to `0.5rem` (6px to 8px max). Retains crisp grid alignment when nested in multi-column dashboards.
- **Delta Pills & Quantitative Badges:** `0.25rem` (4px) structural tag shapes or exact semicircular capsules solely where high visual separation from adjacent monospaced text is required.

## Components

### Buttons
- **Primary Executive:** Background `#0F172A`, text `#FFFFFF`, border `1px solid #0F172A`. On hover: `#1E293B`. Active: `#020617`. Height 32px (compact) or 36px (default), padding horizontal 12px, typography `Inter` 13px weight 500.
- **Secondary Outlined:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #CBD5E1`. Hover: background `#F8FAFC`, border `#94A3B8`.
- **Destructive/Liquidation:** Background `#FEF2F2`, text `#DC2626`, border `1px solid #FCA5A5`. Hover: background `#DC2626`, text `#FFFFFF`.

### Financial Data Tables (ERP Standard)
- Row height: Fixed 36px (dense) to 42px (standard).
- Cell layout: Text left-aligned; all financial numbers and `₹` metrics right-aligned with monospace numerals.
- Header row: Surface `#F8FAFC`, text `#64748B`, typography `Inter` 11px uppercase weight 600 with tracking `0.05em`, border bottom `1px solid #CBD5E1`.
- Dividing lines: Razor 1px horizontal rule `#F1F5F9`. Alternating row stripe (optional) `#FAFAFA`. Active/Hover row highlight: `#F8FAFC`.

### KPI Metric Modules & Delta Badges
- Cards feature 12px vertical / 16px horizontal internal spacing.
- Subtitle: `Inter` 11px uppercase weight 600 in `#64748B`.
- Metric Value: Primary display in `Inter` or `JetBrains Mono` 24px weight 600 in `#0F172A` with integrated Rupee sign (`₹`).
- Delta Badges: Sized at 20px height, 6px padding horizontal, text 11px monospace weight 500.
  - Positive Variance: Background `#ECFDF5`, text `#059669`, with upward vector arrow (`+3.42%`).
  - Negative Variance: Background `#FEF2F2`, text `#DC2626`, with downward vector arrow (`-1.18%`).

### Form Inputs & Monetary Entry
- Height 32px (dense) or 36px (standard), background `#FFFFFF`, border `1px solid #CBD5E1`, text `#0F172A`, typography 13px. Focus state: border `1px solid #2563EB`, box-shadow `0 0 0 1px #2563EB`.
- Currency Prefixes: Fixed non-editable addon `₹` rendered in `#64748B` with background `#F8FAFC`, border right `1px solid #CBD5E1`.

### Status Indicators & Threshold Chips
- **Budget Health Chips:** Compact rectangular pills (height 18px, border-radius 2px).
  - Normal (<75%): Background `#F1F5F9`, text `#475569`.
  - Alert (75%–99%): Background `#FFFBEB`, text `#B45309`, border `1px solid #FCD34D`.
  - Critical Deficit (100%+): Background `#FEF2F2`, text `#B91C1C`, border `1px solid #F87171`.

### Sparklines & Inline Visualizers
- Minimal footprint vector sparklines (120px width, 28px height) embedded directly inside card rows and table cells.
- Green trend stroke: `#10B981` (fill gradient: `rgba(16, 185, 129, 0.08)` to transparent).
- Red trend stroke: `#EF4444` (fill gradient: `rgba(239, 68, 68, 0.08)` to transparent).
- Zero axis demarcation: 1px dotted `#E2E8F0`.