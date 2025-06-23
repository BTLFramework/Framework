// Disability‐index question sets
export const NDI_QUESTIONS = [
  {
    label: "Pain Intensity",
    options: [
      "I have no pain at the moment.",
      "The pain is very mild at the moment.",
      "The pain is moderate at the moment.",
      "The pain is fairly severe at the moment.",
      "The pain is very severe at the moment.",
      "The pain is the worst imaginable at the moment.",
    ],
  },
  {
    label: "Personal Care (Washing, Dressing, etc.)",
    options: [
      "I can look after myself normally without causing extra pain.",
      "I can look after myself normally but it causes extra pain.",
      "It is painful to look after myself and I am slow and careful.",
      "I need some help but can manage most of my personal care.",
      "I need help every day in most aspects of self-care.",
      "I do not get dressed; I wash with difficulty and stay in bed.",
    ],
  },
  {
    label: "Lifting",
    options: [
      "I can lift heavy weights without extra pain.",
      "I can lift heavy weights but it gives extra pain.",
      "Pain prevents me from lifting heavy weights off the floor, but I can manage if they are conveniently positioned (e.g., on a table).",
      "Pain prevents me from lifting heavy weights, but I can manage light to medium weights if they are conveniently positioned.",
      "I can lift only very light weights.",
      "I cannot lift or carry anything at all.",
    ],
  },
  {
    label: "Reading",
    options: [
      "I can read as much as I want with no pain in my neck.",
      "I can read as much as I want, but it gives me extra pain in my neck.",
      "I can read as much as I want, but it gives me extra pain in my neck.",
      "I cannot read as much as I want because it causes pain in my neck.",
      "I can hardly read at all because I suffer pain in my neck.",
      "I cannot read at all.",
    ],
  },
  {
    label: "Headaches",
    options: [
      "I have no headaches at all.",
      "I have mild headaches which come infrequently.",
      "I have moderate headaches which come infrequently.",
      "I have moderate headaches which come frequently.",
      "I have severe headaches which come frequently.",
      "I have severe headaches which come all the time.",
    ],
  },
  {
    label: "Concentration",
    options: [
      "I can concentrate fully when I want with no difficulty.",
      "I can concentrate fully when I want with slight difficulty.",
      "I have a fair degree of difficulty in concentrating when I want.",
      "I have a lot of difficulty in concentrating when I want.",
      "I cannot concentrate at all.",
      "I cannot concentrate at all, and I am focusing on nothing but my pain.",
    ],
  },
  {
    label: "Work",
    options: [
      "I can do as much work as I want.",
      "I can only do my usual work, but no more.",
      "I can do most of my usual work, but no more.",
      "I cannot do my usual work.",
      "I can hardly do any work at all.",
      "I cannot do any work at all.",
    ],
  },
  {
    label: "Driving",
    options: [
      "I can drive my car without any neck pain.",
      "I can drive my car as long as I want with slight pain in my neck.",
      "I can drive my car as long as I want with moderate pain in my neck.",
      "I cannot drive my car as long as I want because of moderate pain in my neck.",
      "I can hardly drive at all because of severe pain in my neck.",
      "I cannot drive my car at all.",
    ],
  },
  {
    label: "Sleeping",
    options: [
      "I have no trouble sleeping.",
      "My sleep is slightly disturbed (less than 1 hour sleepless).",
      "My sleep is mildly disturbed (1–2 hours sleepless).",
      "My sleep is moderately disturbed (2–3 hours sleepless).",
      "My sleep is greatly disturbed (3–5 hours sleepless).",
      "My sleep is completely disturbed (5–7 hours sleepless).",
    ],
  },
  {
    label: "Recreation",
    options: [
      "I am able to engage in all my recreation and leisure activities with no neck pain at all.",
      "I am able to engage in all my recreation and leisure activities with some pain in my neck.",
      "I am able to engage in most, but not all, of my usual recreation and leisure activities because of pain in my neck.",
      "I am able to engage in a few of my usual recreation and leisure activities because of pain in my neck.",
      "I can hardly do any recreation or leisure activities because of pain in my neck.",
      "I cannot do any recreation or leisure activities at all.",
    ],
  },
];

// ODI (10 items, each with 6 options) – same pattern
export const ODI_QUESTIONS = [
  { label: "Pain Intensity", options: [...NDI_QUESTIONS[0].options] },
  {
    label: "Personal Care (Washing, Dressing, etc.)",
    options: [...NDI_QUESTIONS[1].options],
  },
  { label: "Lifting", options: [...NDI_QUESTIONS[2].options] },
  {
    label: "Walking",
    options: [
      "Pain does not prevent me walking any distance.",
      "Pain prevents me walking more than 1 mile.",
      "Pain prevents me walking more than ½ mile.",
      "Pain prevents me walking more than ⅓ mile.",
      "Pain prevents me walking more than ⅙ mile.",
      "I cannot walk at all without causing increased pain.",
    ],
  },
  {
    label: "Sitting",
    options: [
      "I can sit in any chair as long as I like.",
      "I can sit only in my favorite chair as long as I like.",
      "Pain prevents me from sitting more than 1 hour.",
      "Pain prevents me from sitting more than ½ hour.",
      "Pain prevents me from sitting more than 10 minutes.",
      "I avoid sitting because it increases pain immediately.",
    ],
  },
  {
    label: "Standing",
    options: [
      "I can stand as long as I want without extra pain.",
      "I can stand as long as I want but it gives me extra pain.",
      "Pain prevents me from standing more than 1 hour.",
      "Pain prevents me from standing more than ½ hour.",
      "Pain prevents me from standing more than 10 minutes.",
      "I avoid standing because it increases pain immediately.",
    ],
  },
  { label: "Sleeping", options: [...NDI_QUESTIONS[8].options] },
  {
    label: "Sex Life (if applicable)",
    options: [
      "My sex life is normal and causes no extra pain.",
      "My sex life is normal but causes some extra pain.",
      "My sex life is nearly normal but is very painful.",
      "My sex life is severely restricted by pain.",
      "My sex life is nearly absent because of pain.",
      "My sex life is completely absent because of pain.",
    ],
  },
  {
    label: "Social Life",
    options: [
      "My social life is normal and gives me no extra pain.",
      "My social life is normal but increases the degree of pain.",
      "Pain has no significant effect on my social life apart from limiting my more energetic interests (e.g., dancing).",
      "Pain has restricted my social life and I do not go out as often.",
      "Pain has restricted my social life to my home.",
      "I have no social life because of pain.",
    ],
  },
  {
    label: "Traveling",
    options: [
      "I can travel anywhere without increased pain.",
      "I can travel anywhere but it gives me extra pain.",
      "Pain is bad but I manage journeys over two hours.",
      "Pain restricts me to journeys of less than one hour.",
      "Pain restricts me to short necessary journeys under 30 minutes.",
      "Pain prevents me from traveling except to receive treatment.",
    ],
  },
];

// ULFI (25 statements; 0–4)
export const ULFI_QUESTIONS = [
  "I have no difficulty with any of my usual work (e.g., job-related tasks).",
  "I have difficulty with my usual work (e.g., job-related tasks).",
  "I have no difficulty with any of my usual household chores (e.g., vacuuming, dusting).",
  "I have difficulty with my usual household chores.",
  "I have no difficulty with any of my usual gardening or yard-work activities (e.g., mowing, digging).",
  "I have difficulty with my usual gardening or yard-work activities.",
  "I have no difficulty with any of my usual recreational or sporting activities (e.g., golf, swimming).",
  "I have difficulty with my usual recreational or sporting activities.",
  "I have no difficulty sleeping because of pain in my arm/shoulder.",
  "I have difficulty sleeping because of pain in my arm/shoulder.",
  "I have no difficulty doing any of my usual activities that require reaching overhead (e.g., placing an object on a high shelf).",
  "I have difficulty doing my usual activities that require reaching overhead.",
  "I have no difficulty doing any of my usual activities that require reaching at waist level (e.g., picking up coins from a table).",
  "I have difficulty doing my usual activities that require reaching at waist level.",
  "I have no difficulty doing any of my usual activities that require reaching behind my back (e.g., fastening a bra).",
  "I have difficulty doing my usual activities that require reaching behind my back.",
  "I have no difficulty doing any of my usual activities that require grasping with my hand (e.g., holding a glass).",
  "I have difficulty doing my usual activities that require grasping with my hand.",
  "I have no difficulty doing any of my usual activities that require using a tool or utensil (e.g., hammering a nail, cutting food).",
  "I have difficulty doing my usual activities that require using a tool or utensil.",
  "I have no difficulty doing any of my usual activities that require carrying something at elbow level (e.g., carrying a small bag).",
  "I have difficulty doing my usual activities that require carrying something at elbow level.",
  "I have no difficulty doing any of my usual activities that require pushing or pulling something (e.g., pushing a vacuum, pulling a chair).",
  "I have difficulty doing my usual activities that require pushing or pulling something.",
  "I have no difficulty doing any of my usual activities that require using my arm/hand for fine motor tasks (e.g., buttoning clothes).",
  "I have difficulty doing my usual activities that require using my arm/hand for fine motor tasks.",
];

// LEFS (20 items; 0–4)
export const LEFS_QUESTIONS = [
  "Usual Work (including housework).",
  "Usual Hobbies, Recreational, or Sporting Activities.",
  "Getting into or out of a car.",
  "Walking between rooms.",
  "Walking several blocks.",
  "Walking a mile.",
  "Going up or down one flight of stairs.",
  "Standing for one hour.",
  "Sitting for one hour.",
  "Running on even ground.",
  "Running on uneven ground.",
  "Making sharp turns while running fast.",
  "Hopping (on the involved leg).",
  "Running while carrying an object.",
  "Squatting.",
  "Getting in or out of a low chair.",
  "Changing direction while walking fast.",
  "Walking fast on uneven ground.",
  "Going up or down three flights of stairs.",
  "Performing usual movements in sports that require agility (e.g., lunging, jumping).",
];
