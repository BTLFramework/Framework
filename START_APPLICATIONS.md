# Back-to-Life App - Startup Guide

## 🚀 How to Start All Applications

This project consists of 3 main applications that need to be running simultaneously:

### 1. Backend Server (Port 3001)
```bash
cd "back-to-life-f-server"
npm run dev
```
**Status**: ✅ Already running (as shown in terminal)

### 2. Patient Portal (Port 3000)
```bash
cd patientportalupdate
npm run dev
```
**What it does**: Next.js patient-facing portal with recovery tools, assessments, and progress tracking

### 3. Admin Dashboard (Port 5173)
```bash
cd "back-to-life-f 3"
npm run dev
```
**What it does**: React/Vite admin dashboard for managing patients and viewing data

## 🔧 Quick Start Commands

### Option 1: Start All (Run in separate terminals)
```bash
# Terminal 1 - Backend
cd "back-to-life-f-server" && npm run dev

# Terminal 2 - Patient Portal  
cd patientportalupdate && npm run dev

# Terminal 3 - Admin Dashboard
cd "back-to-life-f 3" && npm run dev
```

### Option 2: Background Processes
```bash
# Start backend in background
cd "back-to-life-f-server" && npm run dev &

# Start patient portal in background
cd patientportalupdate && npm run dev &

# Start admin dashboard in foreground
cd "back-to-life-f 3" && npm run dev
```

## 📱 Application URLs

Once all applications are running:

- **Patient Portal**: http://localhost:3000 (Next.js patient portal)
- **Admin Dashboard**: http://localhost:5173 (Vite admin dashboard)  
- **Backend API**: http://localhost:3001 (Express server)

## 🎯 SRS Scoring System (Signature Recovery Score™)

**Scale**: 0-11 points  
**Phases**:
- **RESET (0-3)**: Focus on symptom control & movement reassurance
- **EDUCATE (4-7)**: Graded exposure, education, habit change  
- **REBUILD (8-11)**: Higher-load rehab, capacity & performance building

**Baseline Scoring (0-9 max)**:
- Pain (VAS ≤2): +1 point
- Disability (≤20%): +1 point  
- Function (PSFS ≥7): +2 points, (4-6.9): +1 point
- Confidence (≥8): +2 points, (5-7): +1 point
- No negative beliefs: +1 point
- Clinician assessments: +2 points max

**Follow-up Scoring (0-11 max)**: Adds improvement bonuses and GROC ratings

## 🔍 Application Features

### Patient Portal (patientportalupdate/)
- ✅ Recovery Score Wheel with real-time calculations (SRS 0-11 scale)
- ✅ Personalized Exercise System (3 exercises per session)
- ✅ TDI Integration (Thoracic Disability Index) with 9 pain regions
- ✅ Gamified Progress Tracking with metallic badges
- ✅ Phase-based progression: RESET (0-3), EDUCATE (4-7), REBUILD (8-11)
- ✅ Score Breakdown Modal showing actual intake form data calculations

### Admin Dashboard (back-to-life-f 3/)
- ✅ Patient Management Interface with comprehensive data views
- ✅ SRS Score Display and Calculations (0-11 scale with phase indicators)
- ✅ Patient Data Overview with disability index breakdown
- ✅ Recovery Progress Monitoring across all assessment domains

### Backend Server (back-to-life-f-server/)
- ✅ Patient Authentication & Management with secure JWT tokens
- ✅ SRS Calculation Engine (0-11 scale) with baseline & follow-up logic
- ✅ Multi-Index Assessment System (NDI, ODI, TDI, ULFI, LEFS) with region mapping
- ✅ Database Management (Prisma + PostgreSQL) with comprehensive schema
- ✅ Email Services & Notifications for patient communication

## 🛠️ Development Status

**✅ COMPLETED FEATURES:**
- **SRS Calculation Engine**: Signature Recovery Score™ (0-11 scale) with comprehensive breakdown
- **TDI Integration**: Thoracic Disability Index with 9 pain regions (Neck→NDI, Mid-Back→TDI, Low Back→ODI, etc.)
- **Phase Classification**: RESET (0-3), EDUCATE (4-7), REBUILD (8-11) with targeted interventions
- **Exercise System**: 16 exercises across 3 recovery phases with SRS-based personalization
- **UI/UX Enhancements**: Metallic badges, simplified movement cards, clean design
- **Real-time Integration**: Seamless data flow between intake forms and patient portal
- **Score Breakdown Modal**: Detailed calculation showing actual form data and point allocation

**🔧 READY FOR PRODUCTION:**
- All core functionality implemented and tested
- Database schema updated with TDI support
- Frontend-backend integration complete
- HTTPS transition preparation in progress

## 🚨 Troubleshooting

If you get "Missing script" errors:
- Make sure you're in the correct directory
- Use the exact commands above with proper directory names
- Note: "back-to-life-f 3" has spaces in the name, so use quotes

## 🎯 Next Steps for HTTPS Transition

The applications are ready for HTTPS deployment. Consider:
1. SSL certificate setup
2. Environment variable configuration for production
3. Database connection string updates
4. CORS policy adjustments for production domains 