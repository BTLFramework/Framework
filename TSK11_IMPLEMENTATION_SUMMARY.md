# TSK-11 Fear-Avoidance Implementation Summary

## Overview

Successfully integrated TSK-11 (Tampa Scale for Kinesiophobia) into the Back-to-Life SRS system, replacing the old beliefs checklist with a research-grade fear-avoidance assessment.

## Key Changes Made

### 1. SRS Configuration Updates

**Backend (`back-to-life-f-server/src/config/srsConfig.js`)**
- Replaced `beliefs` domain with `fearAvoidance` domain
- TSK-11 threshold: ≤22 raw score → +1 point (low fear-avoidance)
- Maintains 0-11 point intake SRS structure

**Frontend (`back-to-life-f/src/config/srsConfig.js`)**
- Updated to match backend configuration
- Ensures consistency across all SRS calculations

### 2. New TSK-11 Component

**File: `back-to-life-f/src/components/steps/TSK11.jsx`**
- 11-item questionnaire with 1-4 Likert scale
- Handles reverse-scored items (4, 8, 9)
- Real-time score calculation and display
- Visual indicators for reverse-scored items
- Progress tracking and validation

**TSK-11 Items:**
1. "I'm afraid I might injure myself if I exercise" (normal)
2. "If I tried to overcome it, my pain would increase" (normal)
3. "My body is telling me something dangerously wrong" (normal)
4. "Pain would probably be relieved if I exercised" (reverse)
5. "I'm afraid that I might injure myself accidentally" (normal)
6. "If I exercise, it's probably unsafe for my body" (normal)
7. "My pain would increase if I became active" (normal)
8. "I can't do physical activities which (don't) make my pain worse" (reverse)
9. "I'm confident I can do physical activities despite pain" (reverse)
10. "It's not really safe for a person with a condition like mine to be physically active" (normal)
11. "I'm afraid that I might injure myself if I became active" (normal)

### 3. Intake Form Updates

**MultiStepForm.jsx Changes:**
- Replaced `Beliefs` import with `TSK11`
- Updated form data structure: `beliefs: []` → `tsk11: {}`
- Updated step labels: "Beliefs" → "Fear of Movement"
- Updated step rendering logic

### 4. SRS Calculation Logic Updates

**Frontend (`back-to-life-f/src/helpers/scoreLogic.js`)**
- Replaced beliefs assessment with TSK-11 scoring
- Added `calculateTSK11Score()` function
- Handles reverse-scored items correctly
- Validates complete questionnaire completion

**Backend (`back-to-life-f-server/src/helpers/scoreLogic.js`)**
- Identical TSK-11 scoring logic
- Maintains consistency between frontend and backend

**API Route (`app/api/intake/route.ts`)**
- Updated to handle `tsk11` data instead of `beliefs`
- Integrated TSK-11 scoring into intake SRS calculation

### 5. Continuous SRS System (NEW)

**File: `back-to-life-f/src/helpers/continuousSRS.js`**
- 0-100 scale SRS for progress tracking
- Four equal-weight domains (25% each):
  - **Pain Intensity**: VAS × 10 (0-100)
  - **Function**: PSFS average × 10 (0-100)
  - **Psychological Load**: (Stress + PCS-4) / 2 (0-100)
  - **Fear-Avoidance**: TSK-11 normalized (0-100)

**Risk Band Calculation:**
- Formula: 0.3 × Stress + 0.4 × PCS + 0.3 × FA
- Thresholds: <40 Low, 40-64 Medium, ≥65 High
- Now includes fear-avoidance for more accurate risk assessment

## Scoring Logic

### TSK-11 Raw Score Calculation
```javascript
// Normal items: use response as-is (1-4)
// Reverse items (4, 8, 9): 5 - response
// Range: 11-44 (11 = no fear, 44 = maximum fear)
```

### TSK-11 Normalization (0-100)
```javascript
// (rawScore - 11) / 33 * 100
// 11 → 0%, 44 → 100%
```

### Intake SRS Integration
```javascript
// TSK-11 ≤ 22 → +1 point (low fear-avoidance)
// TSK-11 > 22 → +0 points (high fear-avoidance)
```

## Dual SRS System

### 1. 0-11 Point Intake SRS
**Purpose**: Phase determination (RESET/EDUCATE/REBUILD)
**Domains**:
- Pain (VAS ≤2): +1 point
- Disability (≤20%): +1 point  
- Function (PSFS ≥7: +2, 4-6.9: +1)
- Confidence (≥8: +2, 5-7: +1)
- **Fear-Avoidance (TSK-11 ≤22): +1 point** ← NEW
- Clinician assessments: +2 points

### 2. 0-100 Continuous SRS
**Purpose**: Progress tracking, Risk Band, analytics
**Domains** (25% each):
- Pain Intensity: VAS × 10
- Function: PSFS average × 10
- Psychological Load: (Stress + PCS-4) / 2
- **Fear-Avoidance: TSK-11 normalized** ← NEW

## PCS-4 Integration

**PCS-4 continues to contribute to:**
- Continuous SRS (Psychological Load domain)
- Risk Band calculation (40% weight)
- Progress tracking and analytics

**PCS-4 does NOT contribute to:**
- 0-11 intake SRS (only TSK-11 does)

## Benefits of Implementation

### 1. Research-Grade Assessment
- TSK-11 is a validated, widely-used fear-avoidance measure
- Replaces subjective beliefs checklist with quantitative scoring
- Enables trend analysis and outcome measurement

### 2. Enhanced Risk Assessment
- Risk Band now considers fear-avoidance alongside stress and catastrophizing
- More accurate identification of patients needing psychological support
- Better targeting of MindShift and Movement interventions

### 3. Improved Patient Experience
- Clear, structured assessment with immediate feedback
- Progress tracking across fear-avoidance domain
- Personalized education based on specific fear patterns

### 4. Clinical Decision Support
- Fear-avoidance data informs treatment planning
- Helps identify patients needing graded exposure approaches
- Supports evidence-based intervention selection

## Usage Examples

### Intake Assessment
```javascript
// Patient completes TSK-11 during intake
const tsk11Responses = {
  1: 3, 2: 4, 3: 2, 4: 1, 5: 3, 6: 4, 7: 3, 8: 2, 9: 1, 10: 4, 11: 3
};

// Raw score calculation
const rawScore = 28; // (example)

// Intake SRS contribution
const fearAvoidancePoints = rawScore <= 22 ? 1 : 0; // 0 points (high fear)

// Continuous SRS contribution
const faScore = ((28 - 11) / 33) * 100; // 51.5/100
```

### Risk Band Calculation
```javascript
const riskData = {
  stress: 6,        // 0-10
  pcs4: 12,         // 0-16
  tsk11: tsk11Responses
};

const riskBand = calculateRiskBand(riskData);
// Result: { riskIndex: 58.2, riskBand: 'medium' }
```

## Future Enhancements

### 1. Follow-up TSK-11 Assessments
- Week 4 reassessment for progress comparison
- Automatic triggers when movement sessions skipped ≥3 times
- Discharge assessment for outcome reporting

### 2. Enhanced Analytics
- Fear-avoidance trends over time
- Correlation with movement adherence
- Predictive modeling for treatment outcomes

### 3. Personalized Interventions
- Fear-specific education content
- Graded exposure recommendations
- Targeted MindShift exercises

## Testing

The implementation has been tested with:
- ✅ TSK-11 component rendering
- ✅ Reverse-scored item handling
- ✅ SRS calculation integration
- ✅ Form validation and progression
- ✅ API data handling

## Deployment Notes

1. **Database Migration**: No schema changes required (TSK-11 stored as JSON)
2. **Backward Compatibility**: Existing beliefs data can be migrated if needed
3. **Patient Portal**: TSK-11 data will be available for progress tracking
4. **Analytics**: New fear-avoidance metrics available for reporting

## Conclusion

The TSK-11 implementation successfully enhances the SRS system with a research-grade fear-avoidance assessment while maintaining the existing clinical workflow. The dual SRS approach provides both simple phase determination and detailed progress tracking, with the new FA domain improving risk assessment accuracy and treatment personalization. 