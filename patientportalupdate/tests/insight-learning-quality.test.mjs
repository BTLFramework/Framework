import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = fs.readFileSync(path.join(root, 'lib/InsightLibrary.ts'), 'utf8')
const lessons = runInNewContext(source.slice(source.indexOf('export const insightLibrary: Insight[] = [') + 'export const insightLibrary: Insight[] = '.length, source.indexOf('\n];') + 2))

test('knowledge checks use applied multiple-choice questions with explanatory feedback', () => {
  const quizzes = lessons.filter(lesson => lesson.questions?.length)
  assert.equal(quizzes.length, 29)
  for (const lesson of quizzes) {
    assert.ok(lesson.questions.length >= 2, lesson.title)
    for (const question of lesson.questions) {
      assert.ok(question.options.length >= 3, `${lesson.title}: ${question.question}`)
      assert.equal(new Set(question.options).size, question.options.length)
      assert.ok(question.correctAnswer >= 0 && question.correctAnswer < question.options.length)
      assert.ok(question.explanation.length >= 60, `${lesson.title}: feedback is too thin`)
      assert.ok(!question.question.includes('(True/False)'), `${lesson.title}: recognition-only question`)
    }
  }
})

test('quiz feedback waits for the patient and does not auto-advance', () => {
  const component = fs.readFileSync(path.join(root, 'components/InsightDialog.tsx'), 'utf8')
  assert.ok(component.includes('handleCorrectContinue'))
  assert.ok(component.includes('Finish knowledge check'))
  assert.ok(!component.includes('setTimeout(() => {\n        if (quizState.currentQuestionIndex'))
})

test('production insight completion distinguishes a redo from newly earned points', () => {
  const insightDialog = fs.readFileSync(path.join(root, 'components/InsightDialog.tsx'), 'utf8')
  const recoveryDialog = fs.readFileSync(path.join(root, 'components/RecoveryInsightDialog.tsx'), 'utf8')

  assert.ok(insightDialog.includes('Lesson reviewed — no additional points.'))
  assert.ok(!insightDialog.includes('Test Popup'))
  assert.ok(!recoveryDialog.includes('unlockInsights'))
  assert.ok(!recoveryDialog.includes('BETA PREVIEW: All Unlocked'))
})

test('legacy quiz fallbacks are synchronized from structured questions', () => {
  assert.ok(source.includes('insight.quizQ = firstQuestion.question'))
  assert.ok(source.includes('insight.quizA = firstQuestion.options[firstQuestion.correctAnswer]'))
})

test('guided reflection styling preserves labelled response payloads', () => {
  const component = fs.readFileSync(path.join(root, 'components/JsonFormRenderer.tsx'), 'utf8')
  assert.ok(component.includes('kind: "guided-form"'))
  assert.ok(component.includes('title: formData.title'))
  assert.ok(component.includes('label: field.label'))
  assert.ok(component.includes('value: formValues'))
  assert.ok(component.includes('Guided reflection'))
})
