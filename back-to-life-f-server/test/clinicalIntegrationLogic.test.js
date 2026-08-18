require('ts-node/register/transpile-only')

const test = require('node:test')
const assert = require('node:assert/strict')
const {
  createTreatmentPlanPayload,
  reconcileBooleanSrsComponents,
} = require('../src/services/clinicalIntegrationLogic.ts')

test('clinician SRS components replace prior values instead of stacking', () => {
  assert.equal(reconcileBooleanSrsComponents(5, [false, false], [true, true]), 7)
  assert.equal(reconcileBooleanSrsComponents(7, [true, true], [true, true]), 7)
  assert.equal(reconcileBooleanSrsComponents(7, [true, true], [false, true]), 6)
  assert.equal(reconcileBooleanSrsComponents(11, [false, false], [true, true]), 11)
})

test('exercise assignments can be saved without a narrative summary', () => {
  const payload = JSON.parse(createTreatmentPlanPayload('', ['neck-isometric']))
  assert.equal(payload.summary, '')
  assert.deepEqual(payload.assignedExercises, ['neck-isometric'])
})

test('an empty exercise list explicitly clears manual assignments', () => {
  const payload = JSON.parse(createTreatmentPlanPayload('', []))
  assert.deepEqual(payload.assignedExercises, [])
  assert.equal(createTreatmentPlanPayload('', undefined), null)
})
