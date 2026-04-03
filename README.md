# finoscale-assets-platform
Full-stack NestJS + Angular assignment for Finoscale

# Finoscale Assets Platform

## Overview
Full-stack NestJS + Angular assignment to display and edit financial Assets data across multiple financial years.  

- **Backend:** NestJS  
- **Frontend:** Angular 21 + AG Grid  
- **Data:** Financials.json (loaded at startup)

## Features
- Load financial assets from JSON
- Inline editing of asset values
- Recalculate totals on backend
- Dynamic table columns based on years
- TOTAL row non-editable, bold
- Right-aligned numeric values with 2 decimals
- Error handling with notifications (Angular snackbar)
- Loading skeleton and reactive signals for state

## Assumptions
- Inline editing chosen for simplicity
- TOTAL row is non-editable
- Backend keeps JSON in memory; no DB persistence
- JSON file is small enough to load in memory

## Not Implemented / Optional
- Authentication / role-based access
- DB persistence
- Mobile responsiveness
- Advanced filters / row pinning

## Known Limitations
- Large JSON may slow backend
- Inline edits can be accidental (no modal confirmation)
- CORS only allows localhost:4200

## Installation

### Backend
```bash
cd backend
npm install
npm run start:dev
