# 🎓 Adaptive Study App — Front-End Design Specification (MVP)

**Hackathon:** McHacks 13
**Scope:** Front-end design only (UI/UX)
**Platform:** Web app, mobile-first display
**Audience:** University students

This document defines the **visual design, screen structure, and interaction patterns** for the MVP.
No backend logic or AI implementation is assumed here — this is a design handoff.

---

## 1. Product Vision

The app allows students to input their university classes and study materials, then engage with those materials in a **dynamic, adaptive study mode** that changes based on:

- Subject matter
- Style of examination (problem-based, essay, memorization)
- Course structure

The UI must communicate *intelligence, clarity, and trust*.

---

## 2. Design Principles

- **Academic but modern**
- Calm under pressure (exam-season friendly)
- Minimal cognitive load
- No gamification visuals (no points, no streak fireworks)
- Clear explanations of *why* the study mode works the way it does

Tone: confident, explanatory, neutral.

---

## 3. MVP Screen Map

```
Semester Dashboard
        ↓
   Class Dashboard
      ↓      ↓
Upload Materials   Study Mode
```

---

## 4. Global Layout (Mobile Web)

### Navigation

- **Bottom navigation bar** (persistent):
  - Dashboard
  - Classes
  - Study
  - Upload

### Top App Bar

- App name (left)
- Back arrow on secondary screens
- Optional help icon in Study Mode

---

## 5. Screen Designs

### 5.1 Semester Dashboard

High-level overview of semester progress and classes.

**Includes:**

- Semester title
- Weeks remaining
- Class cards
- Add/Edit Classes CTA

---

### 5.2 Class Dashboard

Control center for a single course.

**Includes:**

- Class name
- Subject + exam type
- Primary CTA: Study Mode
- Secondary CTA: Upload Materials
- Materials overview
- Study approach explanation

---

### 5.3 Upload Materials

Simple drag-and-drop upload flow.

**Includes:**

- Upload zone
- File list
- Confirmation states

---

### 5.4 Study Mode

Adaptive study experience.

**Entry state:**

- Session explanation
- Start Session CTA

---

## 6. Study Mode Variants

### Math / Problem Solving

- Problem card
- Answer input
- Step-by-step feedback

### Essay / Short Answer

- Prompt
- Large text response
- Progress indicator

### Memorization / Recall

- Recall prompt
- Delayed reveal
- Self-assessment buttons

---

## 7. Visual Design System

### Color Palette

- Primary: #1F2A44
- Background: #F8F9FB
- Surface: #FFFFFF
- Border: #E4E7EC
- Accent Green: #2E7D6F
- Accent Indigo: #4B5FD7

---

### Typography

- Font: Inter
- Headings: SemiBold
- Body: Regular
- Generous line height

---

## 8. Motion & Feedback

- Subtle fades and slides
- Clear loading states
- Instructional empty states

---

## 9. Status

✅ MVP screens defined
✅ Visual system locked
✅ Study mode variants designed
