# Insight Content Library

This directory contains all media assets and interactive content for the Back to Life patient portal insights system.

## Week 1 Complete Insights

### Monday - PainScience
- **File**: `ps-danger.mp4`
- **Title**: "Danger vs. safety signals"
- **Subtitle**: "How your brain turns pain up or down"
- **Source**: Moseley L 2019 SR
- **Format**: MP4 video
- **Status**: ✅ Complete

### Tuesday - StressMood
- **File**: `cortisol.json`
- **Title**: "How cortisol slows healing"
- **Subtitle**: "The science behind stress and recovery"
- **Source**: Walburn 2019 SR
- **Format**: Lottie animation (JSON)
- **Status**: ✅ Complete

### Wednesday - Lifestyle
- **File**: `sleep-carousel.json`
- **Title**: "Sleep debt + pain sensitivity"
- **Subtitle**: "Why less sleep makes pain louder"
- **Source**: Finan 2013 SMR
- **Format**: Interactive carousel (JSON)
- **Status**: ✅ Complete

### Thursday - SuccessStory
- **File**: `jess-success.mp4`
- **Title**: "Jess's 2-week back-to-running win"
- **Subtitle**: "Real-patient motivation clip"
- **Source**: Jess consent
- **Format**: MP4 video
- **Status**: ⚠️ Placeholder (needs real content)

### Friday - PainScience
- **File**: `motion-lotion.mp4`
- **Title**: "Motion is Lotion"
- **Subtitle**: "Gentle movement can quiet pain"
- **Source**: Louw 2020 meta-analysis
- **Format**: MP4 video
- **Status**: ⚠️ Placeholder (needs real content)

### Saturday - SelfEfficacy
- **File**: `flare-up-plan.json`
- **Title**: "Flare Up Plan"
- **Subtitle**: "Build your calm-down plan"
- **Source**: Vlaeyen 2022 CBT RCT
- **Format**: Interactive form (JSON)
- **Status**: ✅ Complete

### Sunday - Recap
- **File**: `weekly-recap.json`
- **Title**: "Weekly Insight Recap & reflection"
- **Subtitle**: "Review your week's learning and progress"
- **Source**: —
- **Format**: Interactive form (JSON)
- **Status**: ✅ Complete

## Content Types

### Video Files (.mp4)
- **Purpose**: Educational videos, patient stories, demonstrations
- **Requirements**: MP4 format, optimized for web streaming
- **Placeholder**: Text file with "placeholder for [filename] video"

### Lottie Animations (.json)
- **Purpose**: Interactive animations for complex concepts
- **Implementation**: JSON files with Lottie animation data
- **Examples**: Cortisol hormone animation, sleep carousel

### Interactive Forms (.json)
- **Purpose**: Patient engagement, data collection, self-assessment
- **Features**: Multiple field types (text, textarea, checkbox, rating)
- **Implementation**: JSON schema with form structure and validation

## Technical Implementation

### Form Schema
Interactive forms use a JSON schema with the following structure:
```json
{
  "type": "form",
  "title": "Form Title",
  "subtitle": "Form Subtitle", 
  "description": "Form description",
  "sections": [
    {
      "title": "Section Title",
      "description": "Section description",
      "fields": [
        {
          "type": "text|textarea|checkbox|rating",
          "label": "Field Label",
          "placeholder": "Placeholder text",
          "options": ["option1", "option2"], // for checkboxes
          "rows": 3, // for textarea
          "scale": 10, // for rating
          "labels": {"1": "Poor", "10": "Excellent"} // for rating
        }
      ]
    }
  ],
  "submitText": "Submit Button Text",
  "successMessage": "Success message"
}
```

### Component Integration
- **InsightDialog**: Main dialog component that renders different content types
- **JsonFormRenderer**: Handles interactive form rendering and submission
- **FlarePlan**: Legacy form component (being replaced by JsonFormRenderer)

## Next Steps

### Content Creation
1. **Video Content**: Source and create real video content for:
   - `jess-success.mp4` - Patient success story
   - `motion-lotion.mp4` - Movement education video

2. **Animation Enhancement**: Consider adding more Lottie animations for:
   - Pain science concepts
   - Movement demonstrations
   - Progress visualization

### Technical Enhancements
1. **Form Persistence**: Save form responses to localStorage or backend
2. **Progress Tracking**: Enhanced analytics for form completion rates
3. **Accessibility**: Improve screen reader support and keyboard navigation
4. **Mobile Optimization**: Ensure forms work well on mobile devices

### Content Expansion
1. **Week 2+ Insights**: Plan and create content for subsequent weeks
2. **Personalization**: Adapt content based on patient progress and preferences
3. **Multilingual Support**: Consider translations for diverse patient populations

## Licensing & Attribution

All content should be properly licensed and attributed:
- **Videos**: Ensure proper licensing for educational use
- **Animations**: Use royalty-free Lottie animations or create custom ones
- **Forms**: Original content, no licensing required
- **Patient Stories**: Require explicit consent and proper anonymization

## File Structure
```
/public/insight/
├── README.md                 # This documentation
├── ps-danger.mp4            # Monday - Pain science video
├── cortisol.json            # Tuesday - Stress/mood animation
├── sleep-carousel.json      # Wednesday - Lifestyle carousel
├── jess-success.mp4         # Thursday - Success story (placeholder)
├── motion-lotion.mp4        # Friday - Movement video (placeholder)
├── flare-up-plan.json       # Saturday - Interactive form
└── weekly-recap.json        # Sunday - Weekly reflection form
``` 