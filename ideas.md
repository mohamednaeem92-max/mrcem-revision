# MRCEM Primary Offline Revision: Design Brief

## Ground-truth reference

The target is an offline MRCEM Primary revision workspace informed by the publicly visible MRCEM Success demo route supplied by the user. It should retain the useful study pattern: a course-style dashboard, topic entry cards, question counts, and an uncluttered clinical palette. It must not reuse the MRCEM Success name, logo, illustrations, wording, or protected question-bank assets beyond the user-provided material that the user is authorised to use.

## Chosen approach: Clinical Field Notes

### Design Movement

Contemporary clinical information design, drawing on hospital observation charts and field notebooks rather than a generic SaaS dashboard.

### Core Principles

1. Make the next study action immediately visible, with a permanent left-side study rail and one clear active workspace.
2. Use topic cards as compact clinical folders, carrying completion, accuracy, and review status without visual noise.
3. Treat explanations as structured learning notes, separating reasoning, key fact, and next action.
4. Support long study sessions with calm surfaces, strong contrast, generous reading widths, and keyboard-ready controls.

### Color Philosophy

The primary surface is warm white to reduce the coldness of long clinical reading sessions. Deep petrol green establishes focus and provenance, while a highly recognizable scrub-teal is reserved for active study states and progress. Muted clay distinguishes review items without producing alarm fatigue. Correct and incorrect states use restrained green and red only after an answer is submitted.

### Layout Paradigm

An asymmetric clinical workbench: a fixed left rail for navigation and streak context, a central question or dashboard canvas, and a slim right-side reference column for timers, filters, or progress. On mobile, the rail collapses into an accessible drawer and the right column reflows under the primary content.

### Signature Elements

1. A vertical teal status rule that marks active revision paths and question state.
2. Fine dot-matrix and measurement-line texture in quiet surfaces, echoing clinical chart paper.
3. Stacked topic cards with tab-like subject labels and compact performance dials.

### Interaction Philosophy

The interface should remain sober and decisive. Answer selections have clear focus states; feedback appears only after a deliberate submit action; review and bookmark actions are persistent but secondary. Local changes save automatically and the user can export an encrypted-free JSON backup at any time.

### Animation

Use brief transform and opacity transitions only. Cards lift by 2 px on hover, answer feedback opens with a 180 ms slide-fade, and progress indicators update over 240 ms. Keyboard actions render immediately. All non-essential movement respects reduced-motion preferences.

### Typography System

Use **DM Sans** for interface labels, controls, and dense dashboard information. Use **Source Serif 4** for question stems and explanation prose, giving extended clinical reading a paper-like rhythm. Dashboard headings are DM Sans 700 with compact tracking; question stems are Source Serif 4 at 1.2–1.35 rem; performance metadata is DM Sans 500 in small caps only where scannability improves.

### Brand Essence

**Meridian Revision is a private, offline MRCEM Primary study desk for clinicians who want measured, evidence-aware practice without cloud dependency.**

Personality: precise, calm, clinically practical.

### Brand Voice

Headlines are direct and study-oriented. CTAs name the exact action. Microcopy is short, factual, and supportive without being sentimental.

Examples: “Continue your resuscitation set.” and “Review the reasoning before moving on.”

### Wordmark & Logo

The wordmark uses a compact custom letterform treatment with a north-pointing clinical marker motif. The standalone mark is a bold, angular compass cross formed from four tapered teal segments, hinting at navigation and clinical decision pathways without using medical insignia.

### Signature Brand Color

**Meridian Teal: #007C78**

## Style Decisions

- The user confirmed that the current workspace and mock-exam target are **MRCEM Primary**. This explicit product-scope correction supersedes the prior Intermediate wording and any contrary visual-review suggestion.
- Supporting metrics use compact clinical-record styling rather than generic dashboard tiles. Meridian Teal remains reserved for active study, primary actions, progress, and the compass marker; passive metadata recedes into petrol and neutral tones. Chart rules, folder tabs, source traces, and the compass seal take precedence over generic clinical photography.

- Dashboard and navigation text use DM Sans; Source Serif is reserved for question stems, explanations, and extended learning notes.
- Each subject card is a clinical folder record with a tab label, Meridian Teal status rule, source-state metadata, and a compact Meridian compass marker.
- Meridian Teal denotes active study, action, detected-key progress, and the compass symbol. Muted clay is reserved for OCR review attention; other metadata uses petrol or neutral tones.
- Chart-paper grids, measured rules, and source-trace dividers extend through stats, reference sheets, and review surfaces rather than appearing only in the hero.
- The right column is a compact clinical reference sheet: daily schedule counts, verified-bank scope, and local source context are always visible.
- Dashboard metrics are ruled clinical-record strips with a local trace and provenance seal, not generic KPI tiles.
- The compass mark acts as a functional local-source and active-study seal within records and folder provenance.
- Meridian Teal #007C78 is limited to active navigation, primary study actions, progress rules, and verified local-source seals. Passive metadata uses petrol, neutral ink, or muted clay.
- The compass marker is only a brand mark, active-study marker, or provenance seal. It is not a generic metric or decorative icon.
- Subject folders use tab labels, ruled source-trace strips, and compact provenance or performance zones. Dense operational UI remains DM Sans; Source Serif is reserved for questions, explanations, and learning-note excerpts.
- The reference column functions as a pinned clinical sheet, marked by petrol rules, measured rows, and explicit local-source status.
