import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = fs.readFileSync(path.join(root, 'lib/InsightLibrary.ts'), 'utf8')
const lessons = runInNewContext(source.slice(source.indexOf('export const insightLibrary: Insight[] = [') + 'export const insightLibrary: Insight[] = '.length, source.indexOf('\n];') + 2))
test('all active summary lessons have titled carousels and complete slides', () => {
  const summaries = lessons.filter(l => l.assetPath.endsWith('-summary.json'))
  assert.equal(summaries.length, 20)
  for (const lesson of summaries) {
    const data = JSON.parse(fs.readFileSync(path.join(root, 'public', lesson.assetPath), 'utf8'))
    assert.equal(data.presentation, 'carousel')
    assert.equal(data.title, lesson.title)
    assert.ok(data.slides.length >= 4)
    assert.equal(new Set(data.slides.map(s => s.id)).size, data.slides.length)
    for (const slide of data.slides) {
      assert.ok(slide.title && slide.content)
      if (slide.resourceLink) assert.ok(slide.resourceLabel)
      if (slide.visual) assert.equal(lesson.id, 31, 'pain visuals must not leak into other lessons')
    }
  }
})
test('carousel uses lesson metadata and preserves resources without completing tasks', () => {
  const component = fs.readFileSync(path.join(root, 'components/InsightLessonCarousel.tsx'), 'utf8')
  assert.ok(component.includes('data.title || data.slides[0].title'))
  assert.ok(component.includes('slide.resourceLink'))
  assert.ok(component.includes('slide.steps.map'))
  assert.ok(component.includes('data.slides.length - 1'))
  assert.ok(component.includes('preventScroll: true'))
  assert.ok(!component.includes('slide.id ==='))
  assert.ok(!component.includes('setInterval'))
  assert.ok(!component.includes('onComplete('))
  assert.ok(!component.includes('fetch('))
})
