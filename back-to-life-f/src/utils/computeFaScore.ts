/**
 * TSK-11 Fear-Avoidance Score Computation
 * Converts TSK-11 raw scores to normalized fear-avoidance scores
 */

/**
 * Convert TSK-11 raw score to normalized fear-avoidance score
 * @param tskRaw - Raw TSK-11 score (11-44)
 * @returns Normalized fear-avoidance score (0-100)
 */
export function tskRawToFa(tskRaw: number): number {
  // Validate input range
  if (tskRaw < 11 || tskRaw > 44) {
    throw new Error(`Invalid TSK-11 raw score: ${tskRaw}. Must be between 11-44.`);
  }
  
  // 11–44 → 0–100
  return Math.round(((tskRaw - 11) / 33) * 100);
}

/**
 * Calculate TSK-11 raw score from individual responses
 * @param responses - Object with item responses {1: 1-4, 2: 1-4, ...}
 * @returns Raw TSK-11 score (11-44)
 */
export function calculateTSK11Raw(responses: Record<number, number>): number {
  // Validate all 11 items are present
  const requiredItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const missingItems = requiredItems.filter(item => !(item in responses));
  
  if (missingItems.length > 0) {
    throw new Error(`Missing TSK-11 responses for items: ${missingItems.join(', ')}`);
  }
  
  // Validate response values are 1-4
  const invalidResponses = Object.entries(responses).filter(([item, response]) => {
    const responseNum = Number(response);
    return responseNum < 1 || responseNum > 4 || !Number.isInteger(responseNum);
  });
  
  if (invalidResponses.length > 0) {
    throw new Error(`Invalid TSK-11 responses: ${invalidResponses.map(([item, response]) => `Item ${item}: ${response}`).join(', ')}`);
  }
  
  let rawScore = 0;
  
  // TSK-11 items with reverse-scored items (4, 8, 9)
  const reverseScoredItems = [4, 8, 9];
  
  for (let i = 1; i <= 11; i++) {
    const response = responses[i];
    if (reverseScoredItems.includes(i)) {
      rawScore += (5 - response); // Reverse score: 1→4, 2→3, 3→2, 4→1
    } else {
      rawScore += response;
    }
  }
  
  return rawScore;
}

/**
 * Calculate normalized fear-avoidance score from TSK-11 responses
 * @param responses - Object with item responses {1: 1-4, 2: 1-4, ...}
 * @returns Normalized fear-avoidance score (0-100)
 */
export function calculateFearAvoidanceScore(responses: Record<number, number>): number {
  const rawScore = calculateTSK11Raw(responses);
  return tskRawToFa(rawScore);
}

/**
 * Get fear-avoidance level description
 * @param faScore - Normalized fear-avoidance score (0-100)
 * @returns Fear level description
 */
export function getFearAvoidanceLevel(faScore: number): {
  level: 'Low' | 'Moderate' | 'High';
  color: string;
  description: string;
} {
  if (faScore <= 33) {
    return {
      level: 'Low',
      color: 'text-green-600',
      description: 'Minimal fear of movement and reinjury'
    };
  } else if (faScore <= 50) {
    return {
      level: 'Moderate',
      color: 'text-yellow-600',
      description: 'Some fear of movement that may benefit from education'
    };
  } else {
    return {
      level: 'High',
      color: 'text-red-600',
      description: 'Significant fear of movement requiring targeted intervention'
    };
  }
}

/**
 * Check if TSK-11 score indicates low fear-avoidance for intake SRS
 * @param tskRaw - Raw TSK-11 score (11-44)
 * @returns True if score indicates low fear-avoidance (≤22)
 */
export function isLowFearAvoidance(tskRaw: number): boolean {
  return tskRaw <= 22;
}

/**
 * Get TSK-11 item text for display
 * @param itemNumber - Item number (1-11)
 * @returns Item text and scoring direction
 */
export function getTSK11Item(itemNumber: number): {
  text: string;
  reverseScored: boolean;
} {
  const items: Record<number, { text: string; reverseScored: boolean }> = {
    1: { text: "I'm afraid I might injure myself if I exercise", reverseScored: false },
    2: { text: "If I tried to overcome it, my pain would increase", reverseScored: false },
    3: { text: "My body is telling me something dangerously wrong", reverseScored: false },
    4: { text: "Pain would probably be relieved if I exercised", reverseScored: true },
    5: { text: "I'm afraid that I might injure myself accidentally", reverseScored: false },
    6: { text: "If I exercise, it's probably unsafe for my body", reverseScored: false },
    7: { text: "My pain would increase if I became active", reverseScored: false },
    8: { text: "I can't do physical activities which (don't) make my pain worse", reverseScored: true },
    9: { text: "I'm confident I can do physical activities despite pain", reverseScored: true },
    10: { text: "It's not really safe for a person with a condition like mine to be physically active", reverseScored: false },
    11: { text: "I'm afraid that I might injure myself if I became active", reverseScored: false }
  };
  
  if (!(itemNumber in items)) {
    throw new Error(`Invalid TSK-11 item number: ${itemNumber}. Must be 1-11.`);
  }
  
  return items[itemNumber];
}

/**
 * Get all TSK-11 items for form rendering
 * @returns Array of all TSK-11 items
 */
export function getAllTSK11Items(): Array<{
  id: number;
  text: string;
  reverseScored: boolean;
}> {
  return Array.from({ length: 11 }, (_, i) => {
    const itemNumber = i + 1;
    const item = getTSK11Item(itemNumber);
    return {
      id: itemNumber,
      text: item.text,
      reverseScored: item.reverseScored
    };
  });
} 