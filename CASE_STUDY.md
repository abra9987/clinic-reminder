# Clinic Appointment Reminder System

## Problem
- Dental clinic administrators in Ufa, Russia need to remind patients about upcoming appointments
- Messengers (Telegram, WhatsApp) are unreliable due to government blocks; SMS delivery is inconsistent; patients often have spotty internet
- The only guaranteed moment of contact is when the patient is physically at the clinic booking their next visit
- Result: high no-show rates, wasted doctor time, lost revenue (~15-20% of scheduled appointments missed)

## Solution
After an appointment, the receptionist fills a quick form (patient name, doctor, date/time) and a QR code appears on screen. The patient scans it with their phone camera, sees a clean appointment card, and taps one button to save the visit to their phone calendar — with automatic reminders at 24 hours and 2 hours before. No internet needed after that moment; the phone calendar works offline.

Key features:
- One-tap calendar save (Google Calendar link + .ics file for any phone)
- Automatic reminders at 24h and 2h before the appointment
- Works completely offline after initial scan
- Clean, professional patient-facing card (mobile-first)
- Simple analytics: track how many patients actually add reminders

## Tech Stack
- **Backend:** FastAPI (Python) with async PostgreSQL (asyncpg + SQLAlchemy 2.0)
- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + Vite
- **Database:** PostgreSQL 16
- **Containerization:** Docker Compose (3 services: backend, frontend/nginx, db)
- **Deployment:** Coolify on Hetzner Helsinki, accessed from Russia via VDSina.com proxy

## Results
- Before: No systematic reminder system. Verbal reminders only. ~15-20% no-show rate (estimated)
- After: Every patient gets a calendar reminder with zero ongoing effort from staff
- Receptionist time per patient: ~20 seconds (fill 3-4 fields, show QR)
- Patient time: ~5 seconds (scan QR, tap "Add to calendar")
- Expected no-show reduction: 30-50% (based on industry data for calendar-based reminders)

## Screenshots
- [Admin form — creating a new reminder with all fields filled]
- [QR code screen — large QR code displayed after creation]
- [Patient page — mobile view of the appointment card]
- [Patient page — the two "Add to calendar" buttons]
- [Appointment list — admin view with analytics counters]

## Timeline
- Started: April 2026
- MVP delivered: April 2026
- Phase 2 (MIS integration): planned

## Lessons Learned
- The hardest part: ensuring .ics files work correctly across iOS and Android with proper timezone (Asia/Yekaterinburg) and VALARM reminders
- The offline-first constraint (no internet after QR scan) was actually the key insight that made the solution elegant — calendar events are inherently offline
- Would consider adding SMS as a fallback channel once reliable providers are found for the Russian market
