import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = fs.readFileSync(path.join(root, 'lib/InsightLibrary.ts'), 'utf8')
const array = source.slice(source.indexOf('export const insightLibrary: Insight[] = [') + 'export const insightLibrary: Insight[] = '.length, source.indexOf('\n];') + 2)
const lessons = JSON.parse(JSON.stringify(runInNewContext(array)))
const first = lessons.filter(lesson => lesson.week <= 2)
const readAsset = lesson => JSON.parse(fs.readFileSync(path.join(root, 'public', lesson.assetPath), 'utf8'))

test('first fortnight preserves identity, order, points, asset routes, and daily offsets', () => {
  const expected = [
    [21, '/insight/ps-danger.mp4'], [22, '/insight/stress-recovery-summary.json'],
    [23, '/insight/recovery-foundations-week1.json'], [24, '/insight/recovery-signals-week1.json'],
    [25, '/insight/motion-lotion-summary.json'], [28, 'FORM:flare-up-plan'],
    [29, '/insight/week1-reflection.json'], [30, 'https://vimeo.com/245179549'],
    [31, '/insight/pain-variability-summary.json'], [32, '/insight/flare-up-management-summary.json'],
    [33, '/insight/recovery-not-linear-summary.json'], [34, '/insight/pacing-strategies-summary.json'],
    [35, '/insight/sleep-recovery-summary.json'], [36, '/insight/week2-application.json'],
  ]
  assert.equal(first.length, 14)
  first.forEach((lesson, index) => {
    assert.deepEqual([lesson.id, lesson.assetPath], expected[index])
    assert.equal(lesson.week, index < 7 ? 1 : 2)
    assert.equal(lesson.releaseOffset, index % 7)
    assert.equal(lesson.points, 5)
  })
})

test('each revised quiz has valid, distinct choices and explanatory feedback', () => {
  for (const lesson of first.filter(lesson => lesson.questions)) {
    assert.equal(lesson.questions.length, 2, lesson.title)
    for (const question of lesson.questions) {
      assert.equal(new Set(question.options).size, question.options.length)
      assert.ok(question.correctAnswer >= 0 && question.correctAnswer < question.options.length)
      assert.ok(question.explanation.length > 60)
    }
    assert.equal(lesson.quizQ, lesson.questions[0].question)
    assert.equal(lesson.quizA, lesson.questions[0].options[lesson.questions[0].correctAnswer])
  }
})

test('revised summary cards opt into complete content, including later tiles and qualifications', () => {
  const summaries = first.filter(lesson => lesson.assetPath.endsWith('-summary.json'))
  assert.equal(summaries.length, 7)
  for (const lesson of summaries) {
    const data = readAsset(lesson)
    assert.equal(data.presentation, 'complete', lesson.title)
    assert.ok(data.takeaway.length > 30)
    assert.ok(data.slides.length >= 5)
    assert.equal(new Set(data.slides.map(slide => slide.id)).size, data.slides.length)
  }
  const renderer = fs.readFileSync(path.join(root, 'components/InsightSummaryCard.tsx'), 'utf8')
  assert.match(renderer, /showCompleteText \? remaining : contentTiles.slice/)
  assert.match(renderer, /showCompleteText \? \(\s*<p[^>]*>\{tile.content\}/)
  assert.match(renderer, /showCompleteText && why && data.slides\[0\]\?\.content/)
})

test('early reflections teach first and keep the weekly response burden to three fields', () => {
  for (const id of [24, 29, 36]) {
    const form = readAsset(first.find(lesson => lesson.id === id))
    assert.equal(form.type, 'form')
    assert.equal(form.sections.flatMap(section => section.fields).length, 3)
    assert.ok(form.sections.every(section => section.description.length > 30))
    assert.match(JSON.stringify(form), /unsure|not sure|uncertain/i)
  }
  const thought = readAsset(first.find(lesson => lesson.id === 24))
  assert.equal(thought.sections[0].title, 'A worked example')
  assert.match(thought.sections[0].description, /more balanced thought/)
})

test('early stress skill is practical, optional, and does not require pain relief', () => {
  const stress = JSON.stringify(readAsset(first.find(lesson => lesson.id === 22)))
  assert.match(stress, /breath come in gently/)
  assert.match(stress, /Stop if you feel dizzy/)
  assert.match(stress, /If breathing is not for you/)
  assert.match(stress, /does not have to remove pain/)
})
