# Finoscale Assets Platform

## Overview
This is a full-stack assignment built using **NestJS** (backend) and **Angular 21** (frontend) to display and edit financial assets data across multiple financial years.  

- **Backend:** NestJS  
- **Frontend:** Angular 21 + AG Grid  
- **Data:** `Financials.json` loaded at startup  

---

## Features
- Load financial assets dynamically from JSON
- Inline editing of asset values
- Recalculate totals in real-time
- Dynamic table columns based on years
- `TOTAL` row is **non-editable and bold**
- Numeric values are **right-aligned** with 2 decimal places
- Error handling with Angular **snackbar notifications**
- Loading skeleton for better UX
- Reactive signals for state management

---

## Assumptions
- Inline editing chosen for simplicity and clarity
- Backend keeps JSON in memory (no database)
- `TOTAL` row is read-only
- JSON is small enough to be loaded entirely in memory
- CORS configured only for `localhost:4200`

---

## Not Implemented / Optional
- Authentication / role-based access
- Database persistence
- Mobile responsiveness
- Advanced AG Grid features like row pinning or column grouping

---

## Known Limitations
- Large JSON files may slow backend response
- Inline edits can be accidental (no modal confirmation)
- Backend error messages are basic and may need enhancements

---

## Installation

### Backend
```bash
cd backend
npm install
npm run start:dev
