# Patient Portal End-to-End Testing Checklist

This checklist ensures the Back to Life patient portal is fully functional and all data flows are correct. **Use this checklist for every test run.**

---

## 1. Intake Form Submission
- [ ] Complete the intake form as a new test patient (e.g., testback@example.com)
- [ ] Ensure all required fields are filled (pain, function, PCS-4, TSK-11, confidence, beliefs, region, etc.)
- [ ] Submit the form and confirm a success response
- [ ] Verify the correct SRS score is calculated (out of 11) per backend logic
  - Pain: 0–10 slider → 2 points (normalized, inverted)
  - Function: 1–5 Likert → 2 points
  - Psych Load: Stress + PCS-4 → 2 points
  - Fear-Avoidance: TSK-11 → 2 points (normalized)
  - Confidence: 2 points
  - Beliefs: 1 point
  - Clinician: 2 points (if applicable)

## 2. Patient Portal Data Population
- [ ] Log in as the test patient
- [ ] Confirm the SRS score matches the intake form and is out of 11
- [ ] Confirm the phase label matches the SRS score (RESET, EDUCATE, REBUILD)
- [ ] Assessments and intake sections are populated with submitted data

## 3. Movement Session
- [ ] Movement session section is visible
- [ ] 3 exercises are populated based on intake/region/phase logic
- [ ] Exercises are correct for the patient’s region and phase

## 4. Mindfulness & Recovery Insights
- [ ] Mindfulness section is visible and populated
- [ ] Recovery insights are shown and match the patient’s intake/phase
- [ ] Insights update as patient progresses

## 5. Recovery Points Section
- [ ] Recovery points section is visible
- [ ] Points breakdown (MOVEMENT, LIFESTYLE, MINDSET, EDUCATION, ADHERENCE) is correct
- [ ] Weekly, streak, and completion rate data are accurate

## 6. Backend API & Data Flow
- [ ] `/patients/portal-data/:email` returns all required patient data
- [ ] `/patients/update-engagement` updates engagement without error
- [ ] No 404 or 500 errors in backend logs during the workflow

## 7. Error Handling & UI
- [ ] No errors in browser console or backend logs
- [ ] All sections load without blank states or crashes
- [ ] UI matches expected Back to Life theme and logic

---

**Reference:**
- SRS logic: `back-to-life-f-server/src/controllers/patientController.ts` and `src/config/srsConfig.js`
- API routes: `back-to-life-f-server/src/routes/patientRoutes.ts`
- Intake logic: Intake form in `back-to-life-f` and `patientportalupdate`
- Movement/insights logic: `patientportalupdate/components/`, `hooks/`, and `lib/`

---

**Use this checklist for every test. Mark each item as complete before considering the system ready.** 