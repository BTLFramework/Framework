const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register');
const { decodeClinicalNote, encodeClinicalNote, normalizeClinicalNoteType } = require('../src/services/clinicalNoteType');

test('preserves every supported clinical note category', () => {
  for (const type of ['general', 'assessment', 'treatment', 'progress', 'concern', 'recommendation']) {
    assert.equal(normalizeClinicalNoteType(type), type);
  }
});

test('round-trips note text and its category without exposing metadata', () => {
  const stored = encodeClinicalNote('Patient is progressing well.', 'progress');
  assert.deepEqual(decodeClinicalNote(stored), {
    text: 'Patient is progressing well.',
    type: 'progress',
  });
});

test('reads existing untyped notes as general notes without changing their text', () => {
  assert.deepEqual(decodeClinicalNote('Existing clinical note'), {
    text: 'Existing clinical note',
    type: 'general',
  });
});

test('falls back safely for missing or unsupported categories', () => {
  assert.equal(normalizeClinicalNoteType(undefined), 'general');
  assert.equal(normalizeClinicalNoteType('unexpected'), 'general');
  assert.equal(normalizeClinicalNoteType(42), 'general');
});
