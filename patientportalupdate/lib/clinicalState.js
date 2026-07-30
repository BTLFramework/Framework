export const phaseForSrs = (score) => {
  const numericScore = Number(score)
  if (!Number.isFinite(numericScore)) return null
  if (numericScore <= 3) return "RESET"
  if (numericScore <= 7) return "EDUCATE"
  return "REBUILD"
}

export const latestSrsRecord = (scores) => {
  if (!Array.isArray(scores) || scores.length === 0) return null

  return scores.reduce((latest, candidate) => {
    if (!latest) return candidate

    const latestTime = new Date(latest.date || latest.createdAt || 0).getTime()
    const candidateTime = new Date(candidate.date || candidate.createdAt || 0).getTime()

    if (!Number.isFinite(candidateTime)) return latest
    if (!Number.isFinite(latestTime)) return candidate
    return candidateTime > latestTime ? candidate : latest
  }, null)
}

export const normalizeClinicalProfile = (profile) => {
  if (!profile) return profile

  const latest = latestSrsRecord(profile.srsScores)
  const scoreCandidate = profile.srsScore ?? latest?.srsScore
  const score = Number(scoreCandidate)

  if (!Number.isFinite(score)) {
    return {
      ...profile,
      score: null,
      srsScore: null,
      phase: null,
    }
  }

  return {
    ...profile,
    score,
    srsScore: score,
    // SRS is the phase authority until a clinician override is explicitly
    // represented in the data model.
    phase: phaseForSrs(score),
    region: profile.region ?? latest?.region ?? null,
    clinicalSnapshotUpdatedAt:
      profile.clinicalSnapshotUpdatedAt ??
      latest?.date ??
      latest?.createdAt ??
      profile.updatedAt ??
      null,
  }
}
