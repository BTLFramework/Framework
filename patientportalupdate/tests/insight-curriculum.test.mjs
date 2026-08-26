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
