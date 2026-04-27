# Design Brief: GlucoFit

## Visual Direction

Health-focused, modern healthcare dashboard. Premium, trustworthy, human-centered aesthetic combining clinical clarity with approachable warmth. Professional without coldness; accessible without cuteness.

## Tone & Purpose

**Primary:** Trust & clinical accuracy. **Secondary:** Motivation & achievable health goals. Clean, purposeful, no decorative excess.

## Color Palette (OKLCH)

| Name | Light | Dark | Usage |
|------|-------|------|-------|
| Primary | 0.508 0.112 262.85 | 0.65 0.098 262.85 | Buttons, active nav, glucose focus |
| Secondary | 0.533 0.182 142.49 | 0.65 0.14 142.49 | Success states, weight badge, fitness growth |
| Background | 0.995 0 0 | 0.13 0 0 | Page background, neutral base |
| Card | 0.99 0 0 | 0.17 0 0 | Metric cards, modular content zones |
| Muted | 0.92 0 0 | 0.21 0 0 | Disabled states, secondary UI |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 | Alerts, warning states |

## Typography

| Type | Font | Weight | Use |
|------|------|--------|-----|
| Display | GeneralSans (Poppins) | 600–700 | Headlines, brand, metric labels |
| Body | DM Sans (Inter) | 400–500 | Body text, descriptions, data |
| Mono | JetBrainsMono | 400 | Code blocks, numeric values, timestamps |

## Structural Zones

| Zone | Treatment | Notes |
|------|-----------|-------|
| Header | `bg-card` + `border-b` | 12px padding, clear GlucoFit logo + nav |
| Sidebar | `bg-sidebar` + `border-r` | Authenticated users only; primary nav items with blue active state |
| Main Content | `bg-background` | Light gray/white; card-based layout |
| Metric Cards | `card-elevated` utility | `p-6`, `rounded-lg`, `shadow-sm`, colored badges |
| Charts | `bg-card` + `border` | Chart colors: primary blue (glucose), secondary green (weight), accent palette |
| Footer | `bg-muted/30` + `border-t` | Subtle background, muted text |

## Component Patterns

- **Metric Card:** Displays health stat (glucose/weight) with large number, colored badge, trend arrow, unit label.
- **Notification Badge:** Inline success state (green), primary highlight (blue), destructive alert (red).
- **Input Fields:** `bg-input` white/light gray, `border` light, `ring` primary blue on focus.
- **Buttons:** Primary (solid blue, white text), secondary (blue outline), destructive (red).
- **Data Table:** Striped rows, `hover:bg-muted/30`, sort indicators in primary blue.

## Spacing & Rhythm

- Base unit: 4px (multiples: 8px, 12px, 16px, 24px, 32px)
- Card padding: 24px (6 × 4px)
- Section gap: 16px (dense) to 24px (open)
- Border-radius: 8px (consistent, moderate, friendly)

## Motion & Interaction

- Smooth transitions: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` on hover/focus
- No animations on load; minimal entrance animations for modals/toasts
- Active states: blue border/background change, no lift or shadow expansion

## Signature Detail

Health metric cards display dual badges: glucose in primary blue (clinical focus), weight in secondary green (fitness achievement). Creates visual rhythm and reinforces the dual-health-metric positioning of GlucoFit. Badges are subtle (`bg-*/15 text-*`), never dominant.

## Anti-Patterns to Avoid

- No full-page gradients or decorative orbs
- No rainbow color palettes; stick to 2 primaries + neutrals
- No oversized shadows or glowing effects
- No default Tailwind blue (#3B82F6); use explicit OKLCH (#2563EB → 0.508 0.112 262.85)
- No scattered animations; all transitions must have purpose
