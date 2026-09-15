const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
require('ts-node/register/transpile-only')
const { createRateLimit } = require('../src/middleware/rateLimit.ts')

const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

test('patient clinical routes require a matching signed patient', () => {
  const patientRoutes = read('src/routes/patientRoutes.ts')
  const patientPortalRoutes = read('src/routes/patientPortalRoutes2.ts')
  const recoveryRoutes = read('src/routes/recoveryPointsRoutes.js')

  for (const route of [
    '"/by-email/:email"',
    '"/:id/srs-scores"',
    '"/portal-data/:email"',
    '"/update-engagement"',
    '"/daily-assessment"',
    '"/daily-data/:email"',
    "'/progress-history/:email'",
    '"/activity"',
  ]) {
    const line = patientRoutes.split('\n').find((candidate) => candidate.includes(`router.`) && candidate.includes(route))
    assert.ok(line?.includes('requirePatientAccess'), `${route} must require patient access`)
  }

  assert.match(patientPortalRoutes, /router\.get\('\/exercises\/:email', requirePatientAccess/)
  for (const route of ["'/add'", "'/weekly/:patientId'", "'/buffer/:patientId'", "'/task-completion'", "'/task-stats/:patientId'", "'/thresholds/:patientId'", "'/activity/:patientId'", "'/mood'"]) {
    const line = recoveryRoutes.split('\n').find((candidate) => candidate.includes('router.') && candidate.includes(route))
    assert.ok(line?.includes('requirePatientAccess'), `${route} must require patient access`)
  }
})

test('patient portal proxies forward the signed session to the backend', () => {
  const proxyFiles = [
    'app/api/patient-portal/exercises/[email]/route.ts',
    'app/api/patients/[id]/recovery/[type]/route.ts',
    'app/api/patients/[id]/srs-scores/route.ts',
    'app/api/patients/activity/route.ts',
    'app/api/patients/daily-assessment/route.ts',
    'app/api/patients/portal-data/[email]/route.ts',
    'app/api/patients/progress-history/[email]/route.ts',
    'app/api/patients/update-engagement/route.ts',
    'app/api/recovery-points/add/route.ts',
    'app/api/recovery-points/buffer/[patientId]/route.ts',
    'app/api/recovery-points/mood/route.ts',
    'app/api/recovery-points/task-completion/route.ts',
    'app/api/recovery-points/task-stats/[patientId]/route.ts',
    'app/api/recovery-points/weekly/[patientId]/route.ts',
  ]

  for (const file of proxyFiles) {
    const source = fs.readFileSync(path.join(root, '..', 'patientportalupdate', file), 'utf8')
    assert.ok(source.includes("request.headers.get('cookie')"), `${file} must forward the patient cookie`)
  }
})

test('intake data is not persisted in browser storage', () => {
  const portalIntake = read('../patientportalupdate/app/intake/page.tsx')
  const standaloneIntake = read('../back-to-life-f/src/components/MultiStepForm.jsx')

  assert.ok(!portalIntake.includes("localStorage.setItem('btl_intake_data'"))
  assert.ok(!portalIntake.includes("localStorage.setItem('btl_patient_data'"))
  assert.ok(!standaloneIntake.includes("localStorage.setItem('btl_patient_data'"))
  assert.ok(!standaloneIntake.includes('patientData: JSON.stringify(patientData)'))
  assert.ok(standaloneIntake.includes('/create-account?token='))
})

test('patient queries never select portal password hashes for API responses', () => {
  const patientModel = read('src/models/patientModel.ts')
  const safePortalSelection = /portalAccount:\s*\{\s*select:\s*\{\s*id:\s*true,\s*patientId:\s*true,\s*email:\s*true,\s*createdAt:\s*true\s*\}/g
  assert.equal([...patientModel.matchAll(safePortalSelection)].length, 2)
})

test('production CORS does not trust arbitrary Vercel applications', () => {
  const app = read('src/app.ts')
  assert.ok(!app.includes('vercelPatterns'))
  assert.ok(!app.includes('regexMatch'))
})

test('rate limiting blocks repeated requests without recording request content', () => {
  const middleware = createRateLimit({ windowMs: 60_000, max: 2, message: 'Slow down' })
  const result = { nextCalls: 0, statusCode: null, body: null, retryAfter: null }
  const req = { ip: '127.0.0.1' }
  const res = {
    setHeader(_name, value) { result.retryAfter = value },
    status(code) { result.statusCode = code; return this },
    json(body) { result.body = body; return this },
  }

  middleware(req, res, () => { result.nextCalls += 1 })
  middleware(req, res, () => { result.nextCalls += 1 })
  middleware(req, res, () => { result.nextCalls += 1 })

  assert.equal(result.nextCalls, 2)
  assert.equal(result.statusCode, 429)
  assert.deepEqual(result.body, { error: 'Slow down' })
  assert.ok(Number(result.retryAfter) > 0)
})
