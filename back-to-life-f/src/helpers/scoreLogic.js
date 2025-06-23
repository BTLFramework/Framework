export function getPhaseByScore(score) {
  if (score <= 3) return { label: "RESET", color: "bg-green-400" };
  if (score <= 6) return { label: "EDUCATE", color: "bg-yellow-400" };
  return { label: "REBUILD", color: "bg-blue-400" };
}

// For demonstration purposes, “previousValues” are hard‐coded. In a real app, you’d fetch them from an API or props.
const previousValues = {
  vas: 7,
  psfs: [2, 3, 4], // sum = 9
  confidence: 4,
  disabilityIndex: 50, // %
};

export function calculateSRS(data) {
  let score = 0;

  // VAS reduction ≥ 2
  if (previousValues.vas - Number(data.vas) >= 2) {
    score += 1;
  }

  // PSFS improvement ≥ 4 (combined)
  const prevPSFSSum = previousValues.psfs.reduce((a, b) => a + b, 0);
  const currPSFSSum =
    Number(data.psfs1) + Number(data.psfs2) + Number(data.psfs3);
  if (currPSFSSum - prevPSFSSum >= 4) {
    score += 2;
  }

  // Disability Index improvement ≥ 10%
  if (previousValues.disabilityIndex - data.disabilityPercentage >= 10) {
    score += 1;
  }

  // Confidence increase ≥ 3
  if (Number(data.confidence) - previousValues.confidence >= 3) {
    score += 2;
  }

  // Beliefs resolved (“None of these apply”)
  if (data.beliefs.includes("None of these apply")) {
    score += 1;
  }

  // GROC ≥ +5 (only if Follow-Up)
  if (data.formType === "Follow-Up" && Number(data.groc) >= 5) {
    score += 1;
  }

  // Recovery Milestone (manual)
  if (data.recoveryMilestone) {
    score += 1;
  }

  // Clinical Progress Verified
  if (data.clinicalProgressVerified) {
    score += 1;
  }

  // Cap at 11
  return Math.min(score, 11);
}
