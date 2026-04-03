# Finoscale Assets Platform

## Overview

This is a full-stack assignment built using **NestJS** (backend) and **Angular 21** (frontend) to display and edit financial assets data across multiple financial years.

- **Backend:** NestJS
- **Frontend:** Angular 21 + AG Grid
- **Data:** `Financials.json` loaded at startup

---

## Features
- Load financial assets dynamically from JSON
- Inline editing of asset values (editable only for asset rows, TOTAL row is read-only)
- Recalculate totals in real-time
- Dynamic table columns based on financial years
- TOTAL row is bold and non-editable
- Numeric values are right-aligned with 2 decimals
- Error handling with Angular snackbar notifications
- Loading skeleton for better UX
- Reactive signals for state management

---

## Assumptions
- Inline editing chosen for simplicity
- Backend keeps JSON in memory (no database persistence)
- TOTAL row is read-only
- JSON is small and can be fully loaded in memory
- CORS allows only localhost:4200 for frontend

---

## Not Implemented / Optional
- Authentication / role-based access
- Database persistence
- Mobile responsiveness
- Advanced AG Grid features (row pinning, column grouping)

---

## Known Limitations
- Large JSON files may slow backend response
- Inline edits can be accidental (no modal confirmation)
- Backend error messages are basic and could be improved

---

## Installation & Running

Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev

frontend (Angular)
```bash
cd frontend
npm install
ng serve

