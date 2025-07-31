// content/assessmentResponses.ts

export const tierContent = {
  1: {
    message: "You’re making steady progress. Take a moment to notice what’s working for you today. Small wins matter.",
    cta: { label: "Quick Gratitude Check-in", route: "/recovery-tools/gratitude" }
  },
  2: {
    message: "Recovery can have ups and downs. If you’re feeling tense, a few minutes of slow breathing or gentle movement may help. Remember, it’s okay to take things one step at a time.",
    cta: { label: "4-7-8 Breathing Exercise", route: "/recovery-tools/478" }
  },
  3: {
    message: "It’s understandable to feel this way when pain and stress are high. If you’d like, you can try a short mindfulness or breathing exercise to help your body and mind reset.",
    cta: { label: "Mindfulness Reset", route: "/recovery-tools/mindfulness" }
  },
  4: {
    message: "You’re not alone in this. When pain and stress are intense, it’s important to pause and care for yourself. If you need more support, booking a check-in with your clinician is always an option.",
    cta: { label: "Book a Check-in", route: "https://kineticliving.janeapp.com/" },
    secondaryCta: { label: "Talk to your provider", route: "/messages" }
  }
} as const; 