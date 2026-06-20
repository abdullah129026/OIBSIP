---
name: design-system-pulze
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Pulze

## Mission
Deliver implementation-ready design-system guidance for Pulze that can be applied consistently across marketing site interfaces.

## Brand
- Product/brand: Pulze
- URL: https://www.pulze.io/
- Audience: readers and knowledge seekers
- Product surface: marketing site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=sans-serif`, `font.family.stack=sans-serif`, `font.size.base=12px`, `font.weight.base=400`, `font.lineHeight.base=normal`
- Typography scale: `font.size.xs=12px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=28px`, `font.size.2xl=40px`, `font.size.3xl=48px`, `font.size.4xl=60px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#0a0a0a`, `color.text.tertiary=#ffffff`, `color.text.inverse=#0000ee`, `color.surface.strong=#14c9e1`
- Spacing scale: `space.1=6px`, `space.2=10px`, `space.3=20px`, `space.4=30px`, `space.5=32px`, `space.6=40px`, `space.7=60px`, `space.8=80px`
- Radius/shadow/motion tokens: `radius.xs=8px`, `radius.sm=12px`, `radius.md=40px`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
