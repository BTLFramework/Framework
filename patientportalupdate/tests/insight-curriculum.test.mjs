import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const libraryPath = path.join(root, 'lib', 'InsightLibrary.ts')
const library = fs.readFileSync(libraryPath, 'utf8')

const values = (pattern) => [...library.matchAll(pattern)].map((match) => match[1])

test('recovery insight curriculum contains seven complete weeks', () => {
  const weeks = values(/\bweek:\s*([1-7]),/g).map(Number)
  const ids = values(/\bid:\s*(\d+),\s*\n\s*week:/g).map(Number)
  const releaseOffsets = values(/\breleaseOffset:\s*([0-6]),/g).map(Number)

  assert.equal(weeks.length, 49)
  assert.equal(ids.length, 49)
  assert.equal(new Set(ids).size, 49)
  assert.equal(releaseOffsets.length, 49)

  for (let week = 1; week <= 7; week += 1) {
    assert.equal(weeks.filter((value) => value === week).length, 7)
  }

  for (let offset = 0; offset <= 6; offset += 1) {
    assert.equal(releaseOffsets.filter((value) => value === offset).length, 7)
  }
})

test('curriculum has no fictional patient-story placeholders', () => {
  assert.doesNotMatch(library, /Patient Story|coming soon|john-success|maria-success|future-story|Nina's postpartum win/i)
})

test('all referenced local insight assets resolve or use a built-in renderer', () => {
  const assetPaths = values(/assetPath:\s*"([^"]+)"/g)
  const missing = assetPaths.filter((assetPath) => {
    if (/^(https?:|FORM:)/.test(assetPath)) return false
    if (/\/recap-week\d+\.json$/.test(assetPath)) return false
    return !fs.existsSync(path.join(root, 'public', assetPath))
  })

  assert.deepEqual(missing, [])
})

test('all local insight JSON files are valid JSON', () => {
  const insightDir = path.join(root, 'public', 'insight')
  for (const file of fs.readdirSync(insightDir).filter((name) => name.endsWith('.json'))) {
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(insightDir, file), 'utf8')), file)
  }
})

test('known broken or mislabeled external resources are not used', () => {
  const insightDir = path.join(root, 'public', 'insight')
  const localContent = fs.readdirSync(insightDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => fs.readFileSync(path.join(insightDir, name), 'utf8'))
    .join('\n')
  const curriculumContent = `${library}\n${localContent}`

  assert.doesNotMatch(library, /3qk6VYVXZd8|7tRdDqXgsJ0|03U7tn6xkHo/)
  assert.equal((library.match(/2n7FOBFMvXg/g) || []).length, 1)
  assert.doesNotMatch(curriculumContent, /albertahealthservices\.ca\/services\/Page11132/)
  assert.doesNotMatch(curriculumContent, /paintoolkit\.org\/resources\/flare-up-management/)
  assert.doesNotMatch(curriculumContent, /tamethebeast\.org\/stories/)
  assert.doesNotMatch(curriculumContent, /painhealth\.csse\.uwa\.edu\.au/)
  assert.doesNotMatch(curriculumContent, /div12\.org\/wp-content/)
  assert.doesNotMatch(curriculumContent, /va\.gov\/PAINMANAGEMENT\/CBT_CP\/Veterans/)
})

test('condition-specific GMI is not assigned in the universal curriculum', () => {
  assert.doesNotMatch(library, /title:\s*"Graded Motor Imagery"/)
  assert.doesNotMatch(library, /assetPath:\s*"\/insight\/gmi-summary\.json"/)
})

test('referenced local curriculum assets avoid unsupported clinical promises', () => {
  const assetPaths = values(/assetPath:\s*"([^\"]+)"/g)
    .filter((assetPath) => assetPath.startsWith('/insight/') && assetPath.endsWith('.json'))
  const referencedContent = assetPaths
    .filter((assetPath) => fs.existsSync(path.join(root, 'public', assetPath)))
    .map((assetPath) => fs.readFileSync(path.join(root, 'public', assetPath), 'utf8'))
    .join('\n')
  const reviewedText = `${library}\n${referencedContent}`

  assert.doesNotMatch(reviewedText, /accelerates? healing|speeds? tissue repair|slows? healing/i)
  assert.doesNotMatch(reviewedText, /prevents stiffness|safe to move test/i)
  assert.doesNotMatch(reviewedText, /brain (creates|decides) pain/i)
  assert.doesNotMatch(reviewedText, /anti-inflammatory foods can support tissue healing/i)
})

test('all referenced local curriculum assets use supported formats', () => {
  const assetPaths = values(/assetPath:\s*"([^\"]+)"/g)
  const unsupported = assetPaths.filter((assetPath) =>
    assetPath.startsWith('/insight/') && !assetPath.endsWith('.json') && !assetPath.endsWith('.mp4')
  )

  assert.deepEqual(unsupported, [])
})

test('week one introduces the complete MSK recovery model', () => {
  const weekOne = library.slice(
    library.indexOf('// --- Week 1:'),
    library.indexOf('// ========= WEEK 2')
  )
  const foundations = fs.readFileSync(
    path.join(root, 'public', 'insight', 'recovery-foundations-week1.json'),
    'utf8'
  )
  const thoughtAction = fs.readFileSync(
    path.join(root, 'public', 'insight', 'recovery-signals-week1.json'),
    'utf8'
  )
  const movement = fs.readFileSync(
    path.join(root, 'public', 'insight', 'motion-lotion-summary.json'),
    'utf8'
  )
  const reviewed = `${weekOne}\n${foundations}\n${thoughtAction}\n${movement}`

  assert.match(reviewed, /stress/i)
  assert.match(reviewed, /sleep/i)
  assert.match(reviewed, /food|nutrition/i)
  assert.match(reviewed, /hydration/i)
  assert.match(reviewed, /thought.action loop/i)
  assert.match(reviewed, /hands-on care/i)
  assert.match(reviewed, /movement is how (your body|we) rebuild/i)
  assert.match(reviewed, /flare-up/i)
})

test('quiz questions may provide explanatory feedback', () => {
  assert.match(library, /explanation\?: string/)
  assert.match(library, /explanation: "Hands-on care can reduce pain/)
  assert.match(library, /explanation: "Recovery behaviours work best as support/)
})

test('weeks two and three progress from application to daily-life capacity', () => {
  const weekTwo = library.slice(
    library.indexOf('// ========= WEEK 2'),
    library.indexOf('// ========= WEEK 3')
  )
  const weekThree = library.slice(
    library.indexOf('// ========= WEEK 3'),
    library.indexOf('// ========= WEEK 4')
  )

  assert.match(weekTwo, /Use your flare-up plan/)
  assert.match(weekTwo, /Pacing without avoidance/)
  assert.match(weekTwo, /sleep-support experiment/i)
  assert.match(weekTwo, /week2-application\.json/)
  assert.doesNotMatch(weekTwo, /questions:\s*\[\s*\{\s*question:\s*"What was your biggest learning/)

  assert.match(weekThree, /Posture is an option, not a verdict/)
  assert.match(weekThree, /Test a difficult recovery prediction/)
  assert.match(weekThree, /Act on what matters/)
  assert.match(weekThree, /week3-capacity\.json/)
  assert.doesNotMatch(weekThree, /questions:\s*\[\s*\{\s*question:\s*"What was your biggest learning/)
})

test('week two and three application forms use teach-back and behavioural experiments', () => {
  const weekTwo = fs.readFileSync(
    path.join(root, 'public', 'insight', 'week2-application.json'),
    'utf8'
  )
  const weekThree = fs.readFileSync(
    path.join(root, 'public', 'insight', 'week3-capacity.json'),
    'utf8'
  )

  assert.match(weekTwo, /in your own words/i)
  assert.match(weekTwo, /How is pacing different from avoiding activity/)
  assert.match(weekTwo, /one activity or sleep-support experiment/i)
  assert.match(weekThree, /A difficult prediction I noticed/)
  assert.match(weekThree, /manageable action could help test that prediction/i)
  assert.match(weekThree, /One activity, role, or value that matters to me/)
})

test('weeks four and five progress from graded capacity to self-management', () => {
  const weekFour = library.slice(
    library.indexOf('// ========= WEEK 4'),
    library.indexOf('// ========= WEEK 5')
  )
  const weekFive = library.slice(
    library.indexOf('// ========= WEEK 5'),
    library.indexOf('// WEEK 6')
  )

  assert.match(weekFour, /optional attention skill/i)
  assert.match(weekFour, /Build a graded return ladder/)
  assert.match(weekFour, /Adjust the movement dose/)
  assert.match(weekFour, /week4-graded-capacity\.json/)

  assert.match(weekFive, /Update learned protection/)
  assert.match(weekFive, /Keep going, modify, or seek support/)
  assert.match(weekFive, /week5-self-management\.json/)
  assert.doesNotMatch(weekFive, /assetPath:\s*"https:\/\/www\.tamethebeast\.org\/"/)
})

test('week four and five forms support graded decisions and appropriate escalation', () => {
  const weekFour = fs.readFileSync(
    path.join(root, 'public', 'insight', 'week4-graded-capacity.json'),
    'utf8'
  )
  const weekFive = fs.readFileSync(
    path.join(root, 'public', 'insight', 'week5-self-management.json'),
    'utf8'
  )
  const decisionSupport = fs.readFileSync(
    path.join(root, 'public', 'insight', 'response-decision-summary.json'),
    'utf8'
  )

  assert.match(weekFour, /What information supports that decision/)
  assert.match(weekFour, /Progress one part of the dose/)
  assert.match(weekFive, /I can usually continue when/)
  assert.match(weekFive, /I will seek appropriate support when/)
  assert.match(decisionSupport, /Continue/)
  assert.match(decisionSupport, /Modify/)
  assert.match(decisionSupport, /Seek Support/)
})

test('weeks six and seven progress from setback rehearsal to a recovery handoff', () => {
  const weekSix = library.slice(
    library.indexOf('// ========= WEEK 6'),
    library.indexOf('// ========= WEEK 7')
  )
  const weekSeven = library.slice(library.indexOf('// ========= WEEK 7'))

  assert.match(weekSix, /Unhook from a worst-case prediction/)
  assert.match(weekSix, /Choose a regulation skill that fits/)
  assert.match(weekSix, /Rehearse your setback response/)
  assert.match(weekSix, /Rehearse your complete recovery plan/)
  assert.doesNotMatch(weekSix, /subtitle:\s*"Catastrophising"/)

  assert.match(weekSeven, /Self-management includes knowing when to ask for help/)
  assert.match(weekSeven, /Prepare for the next clinical conversation/)
  assert.match(weekSeven, /Create your recovery handoff/)
  assert.match(weekSeven, /week7-clinician-handoff\.json/)
})

test('the final handoff captures the minimum clinician-loop information', () => {
  const handoff = fs.readFileSync(
    path.join(root, 'public', 'insight', 'week7-clinician-handoff.json'),
    'utf8'
  )

  assert.match(handoff, /How confident are you/)
  assert.match(handoff, /Which idea remains unclear/)
  assert.match(handoff, /main recovery barrier/)
  assert.match(handoff, /meaningful activity or goal/)
  assert.match(handoff, /When symptoms increase, my first steps/)
  assert.match(handoff, /seek professional support/)
  assert.match(handoff, /main question for my practitioner/)
  assert.match(handoff, /What may need review/)
})
