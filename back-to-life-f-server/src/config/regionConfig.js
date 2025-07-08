// Comprehensive Pain Region and Disability Index Configuration
// This configuration maps pain regions to their appropriate disability indices

const PAIN_REGIONS = [
  {
    "regionLabel": "Neck",
    "mappedCategory": "Neck",
    "disabilityIndex": "NDI",            // Neck Disability Index
    "indexWeight": 0.20,                 // full weight
    "description": "Cervical spine and neck-related pain"
  },
  {
    "regionLabel": "Mid-Back / Thoracic",
    "mappedCategory": "Back",
    "disabilityIndex": "TDI",            // Thoracic Disability Index (clinic-developed)
    "indexWeight": 0.15,                 // provisional weight until validated
    "description": "Thoracic spine and mid-back pain"
  },
  {
    "regionLabel": "Low Back / SI Joint",
    "mappedCategory": "Back",
    "disabilityIndex": "ODI",            // Oswestry Disability Index
    "indexWeight": 0.20,
    "description": "Lumbar spine and sacroiliac joint pain"
  },
  {
    "regionLabel": "Shoulder",
    "mappedCategory": "Upper Limb",
    "disabilityIndex": "ULFI",           // Upper Limb Functional Index
    "indexWeight": 0.20,
    "description": "Shoulder joint and surrounding structures"
  },
  {
    "regionLabel": "Elbow / Forearm",
    "mappedCategory": "Upper Limb",
    "disabilityIndex": "ULFI",
    "indexWeight": 0.20,
    "description": "Elbow joint and forearm pain"
  },
  {
    "regionLabel": "Wrist / Hand",
    "mappedCategory": "Upper Limb",
    "disabilityIndex": "ULFI",
    "indexWeight": 0.20,
    "description": "Wrist, hand, and finger pain"
  },
  {
    "regionLabel": "Hip / Groin",
    "mappedCategory": "Lower Limb",
    "disabilityIndex": "LEFS",           // Lower Extremity Functional Scale
    "indexWeight": 0.20,
    "description": "Hip joint and groin area pain"
  },
  {
    "regionLabel": "Knee",
    "mappedCategory": "Lower Limb",
    "disabilityIndex": "LEFS",
    "indexWeight": 0.20,
    "description": "Knee joint and surrounding structures"
  },
  {
    "regionLabel": "Ankle / Foot",
    "mappedCategory": "Lower Limb",
    "disabilityIndex": "LEFS",
    "indexWeight": 0.20,
    "description": "Ankle, foot, and toe pain"
  }
];

// Disability Index Configurations
const DISABILITY_INDICES = {
  NDI: {
    name: "Neck Disability Index",
    abbreviation: "NDI",
    maxScore: 50,
    sections: 10,
    description: "Measures neck-specific disability",
    validated: true
  },
  TDI: {
    name: "Thoracic Disability Index",
    abbreviation: "TDI",
    maxScore: 50,
    sections: 10,
    description: "Measures thoracic spine-specific disability",
    validated: false, // Clinic-developed, provisional
    note: "Clinic-developed index, validation in progress"
  },
  ODI: {
    name: "Oswestry Disability Index",
    abbreviation: "ODI",
    maxScore: 50,
    sections: 10,
    description: "Measures low back-specific disability",
    validated: true
  },
  ULFI: {
    name: "Upper Limb Functional Index",
    abbreviation: "ULFI",
    maxScore: 80,
    sections: 20,
    description: "Measures upper extremity functional limitations",
    validated: true
  },
  LEFS: {
    name: "Lower Extremity Functional Scale",
    abbreviation: "LEFS",
    maxScore: 80,
    sections: 20,
    description: "Measures lower extremity functional limitations",
    validated: true
  }
};

// Helper functions
const getRegionByLabel = (label) => {
  return PAIN_REGIONS.find(region => region.regionLabel === label);
};

const getDisabilityIndexForRegion = (regionLabel) => {
  const region = getRegionByLabel(regionLabel);
  return region ? region.disabilityIndex : null;
};

const getIndexWeightForRegion = (regionLabel) => {
  const region = getRegionByLabel(regionLabel);
  return region ? region.indexWeight : 0;
};

const getRegionsByCategory = (category) => {
  return PAIN_REGIONS.filter(region => region.mappedCategory === category);
};

const getRegionsByIndex = (indexType) => {
  return PAIN_REGIONS.filter(region => region.disabilityIndex === indexType);
};

const calculateDisabilityPercentage = (score, indexType) => {
  const indexConfig = DISABILITY_INDICES[indexType];
  if (!indexConfig) return 0;
  
  return Math.round((score / indexConfig.maxScore) * 100);
};

module.exports = {
  PAIN_REGIONS,
  DISABILITY_INDICES,
  getRegionByLabel,
  getDisabilityIndexForRegion,
  getIndexWeightForRegion,
  getRegionsByCategory,
  getRegionsByIndex,
  calculateDisabilityPercentage
}; 