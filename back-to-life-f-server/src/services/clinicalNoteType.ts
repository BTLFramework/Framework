export const CLINICAL_NOTE_TYPES = [
  'general',
  'assessment',
  'treatment',
  'progress',
  'concern',
  'recommendation',
] as const;

export type ClinicalNoteType = typeof CLINICAL_NOTE_TYPES[number];

export function normalizeClinicalNoteType(value: unknown): ClinicalNoteType {
  return typeof value === 'string' && CLINICAL_NOTE_TYPES.includes(value as ClinicalNoteType)
    ? value as ClinicalNoteType
    : 'general';
}

const NOTE_TYPE_PREFIX = '[[BTL_NOTE_TYPE:';
const NOTE_TYPE_SUFFIX = ']]\n';

export function encodeClinicalNote(text: string, type: unknown): string {
  const normalizedType = normalizeClinicalNoteType(type);
  return `${NOTE_TYPE_PREFIX}${normalizedType}${NOTE_TYPE_SUFFIX}${text}`;
}

export function decodeClinicalNote(storedText: string): { text: string; type: ClinicalNoteType } {
  if (!storedText.startsWith(NOTE_TYPE_PREFIX)) {
    return { text: storedText, type: 'general' };
  }

  const markerEnd = storedText.indexOf(NOTE_TYPE_SUFFIX);
  if (markerEnd === -1) {
    return { text: storedText, type: 'general' };
  }

  const rawType = storedText.slice(NOTE_TYPE_PREFIX.length, markerEnd);
  return {
    text: storedText.slice(markerEnd + NOTE_TYPE_SUFFIX.length),
    type: normalizeClinicalNoteType(rawType),
  };
}
