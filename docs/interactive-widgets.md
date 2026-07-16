# Interactive Care Widgets

These widgets are designed as in-page decision aids for Dr. Tripti Raheja's site. They should support a visitor's confidence without creating nested pages, fake diagnostic flows, or dead-end novelty interactions.

## Global Rules

- Widgets must update content in place.
- Widgets must not route visitors to another treatment page as the primary interaction.
- Medical language must stay preparatory, not diagnostic.
- Every state should preserve a direct clinic action, usually a phone call.
- Checked items are session-only UI state. They are not stored or submitted.
- Empty, partial, and completed states must all look intentional.

## Home: Concern Guide

Location: home page, after stats and before treatment cards.

Purpose: Help a visitor turn a vague concern into a call-ready visit brief without forcing them to self-diagnose.

Steps:

1. Visitor sees Step 1 of 3 and selects one broad concern.
2. The summary panel acknowledges the selected concern and previews the next step.
3. Visitor continues to Step 2 of 3.
4. Step 2 shows two follow-up questions that are specific to the selected concern.
5. Visitor answers both follow-up questions.
6. Visitor continues to Step 3 of 3.
7. Step 3 asks timing/readiness: planning ahead, prefer this week, or call today.
8. Visitor toggles whether reports or prescriptions are already available.
9. A compact inline summary shows the selected concern, timing and report readiness.
10. Visitor can go back step-by-step or reset the widget to the beginning.

States:

- Step 1 empty: no concern selected; Continue is disabled.
- Step 1 selected: concern card receives active styling; Continue is enabled.
- Step 2 unanswered: concern-specific questions appear; Continue is disabled until all are answered.
- Step 2 partial: answered options receive active styling; compact summary shows progress.
- Step 2 complete: Continue is enabled.
- Step 3 default: timing starts at planning ahead and reports are not ready.
- Timing planning ahead: copy frames the visit as clarity/planning.
- Timing prefer this week: copy frames the visit as an early appointment need.
- Timing call today: copy asks the visitor to call today and keeps emergency wording only for severe symptoms.
- Reports ready: summary tells visitor to keep reports together before calling.
- Reports not ready: summary reassures visitor they can still call.
- Back: moves to the previous step while preserving prior answers.
- Reset: concern clears, answers clear, timing returns to planning ahead, reports toggle clears.

Cases:

- Visitor is unsure: "Not sure where to start" still creates a general consultation brief.
- Visitor has no reports: widget remains usable and gives a next step.
- Visitor selects call today: widget does not diagnose; it gives softer same-day guidance and only uses urgent medical language for severe warning symptoms.
- Visitor changes the Step 1 concern: Step 2 answers reset because the question set changes.
- Visitor goes back from Step 3: prior answers are preserved.
- Mobile layout: choices, follow-up questions and timing buttons stack vertically.
- Accessibility: option and toggle buttons use `aria-pressed`; tabs/buttons remain keyboard reachable.

## Home: Call Note Builder

Location: home page, after process and before reviews.

Purpose: Help visitors explain their need clearly when calling the clinic. This replaces the old checklist because checking items was not useful enough.

Steps:

1. Visitor selects the concern group: pregnancy, fibroid/fertility, or surgery opinion.
2. Visitor chooses what they need help with.
3. Visitor chooses timing: soon, this week, or flexible.
4. The widget generates a short call note in plain language.
5. The widget also shows three useful questions to ask and a small bring-if-available chip list.
6. Visitor can call the clinic from the generated note.

States:

- Default: pregnancy group, first goal, soon timing.
- Active group changed: goals, call note, questions and bring chips update.
- Goal changed: script and questions update.
- Timing changed: appointment timing text updates.
- Call action: opens phone link, not an internal nested page.

Cases:

- Pregnancy: creates call notes around watching symptoms, report review or delivery planning.
- Fibroid/fertility: creates call notes around options, symptom relief or pregnancy planning.
- Surgery opinion: creates call notes around need for surgery, method comparison or recovery planning.
- Mobile layout: controls and generated note stack.

## Treatment Pages: Curated Treatment Planner

Location: all treatment pages, directly after the service hero image.

Purpose: Give each treatment page its own guided planning widget. This should not be the same tab/checklist pattern repeated across pages; each treatment must ask questions that are specific to that treatment decision.

Steps:

1. Widget receives the current service slug.
2. It loads the matching treatment-specific question set.
3. Visitor moves through three treatment-specific steps.
4. Each step asks one focused question and shows multiple relevant options.
5. Selecting an option updates the discussion plan and "why this matters" note.
6. Visitor can move back, jump between steps, or reset.
7. Final state keeps the selected answers, bring-if-available chips, leave-with outcomes and clinic call action visible.

States:

- Valid slug: uses that service's title, intro, steps, options, bring list and outcomes.
- Unknown slug fallback: uses laparoscopic surgery content as a safe default.
- Step inactive: neutral rail styling.
- Step active: rose styling.
- Step answered: soft completed styling.
- Option selected: active option styling and insight note appears.
- No option selected: Next is disabled.

Cases:

- High-risk pregnancy: asks stage, risk reason, and consultation goal.
- Laparoscopic surgery: asks surgery reason, decision uncertainty, and recovery concern.
- Infertility/fibroid care: asks priority, timeline, and treatment question.
- Hysteroscopy: asks trigger, comfort concern, and follow-up need.
- Robotic surgery: asks condition, comparison need, and readiness factor.
- Mobile layout: step rail, options, insight and summary stack vertically.

## Patient Information: Visit-Day Planner

Location: patient information page, before clinic gallery.

Purpose: Give visitors a different type of interaction from the other widgets: instead of checking tasks, they choose the visit type, location, and focus area, then receive a generated visit-day plan.

Steps:

1. Visitor chooses a visit type: clinic consultation, pregnancy follow-up, or procedure discussion.
2. Visitor chooses the location: Raheja Clinic or C K Birla Hospital.
3. Visitor chooses the focus area: report review, new symptoms, pregnancy planning, or surgery clarity.
4. The right-side plan updates with arrival guidance, location detail, a three-step appointment timeline, bring-if-available chips, and the clinic call action.

States:

- Default: clinic consultation, Raheja Clinic, report review.
- Visit type selected: active card receives rose/cream styling and changes arrival guidance, timeline, and bring list.
- Location selected: location toggle changes address/context note.
- Focus selected: focus chip changes the generated summary sentence.
- Help action: phone link remains available.

Cases:

- Clinic consultation: emphasizes symptoms, reports, medicine list, and next steps.
- Pregnancy follow-up: emphasizes antenatal file, scans, monitoring and warning signs.
- Procedure discussion: emphasizes imaging, insurance/admission questions and recovery planning.
- Visitor only wants phone help: help strip remains visible in the plan panel.
- Mobile layout: controls and generated plan stack.

## Maintenance Notes

- Main component file: `components/InteractiveCare/InteractiveCare.tsx`
- Styles: `components/InteractiveCare/InteractiveCare.module.css`
- Home placement: `app/page.tsx`
- Treatment placement: `components/ServiceLayout/ServiceLayout.tsx`
- Patient information placement: `app/patient-information/page.tsx`

When adding a new treatment page, add a matching key to `treatmentPaths`. If no key is added, the widget will render the fallback journey.
