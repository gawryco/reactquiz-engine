# ReactQuiz Engine (use-quiz)

> ⚠️ **WARNING: This is a Proof of Concept (POC) library and is not production-ready. It has not been thoroughly tested and may contain bugs or breaking changes. Use at your own risk.**

[![Live Docs](https://img.shields.io/badge/🚀_Live_Docs-GitHub_Pages-blue?style=for-the-badge)](https://gawryco.github.io/reactquiz-engine/)
[![CI](https://github.com/gawryco/reactquiz-engine/workflows/CI/badge.svg)](https://github.com/gawryco/reactquiz-engine/actions/workflows/ci.yml)
[![Deploy Docs](https://github.com/gawryco/reactquiz-engine/workflows/Deploy%20Docs%20to%20GitHub%20Pages/badge.svg)](https://github.com/gawryco/reactquiz-engine/actions/workflows/deploy-docs.yml)
[![npm version](https://img.shields.io/npm/v/@gawryco/reactquiz-engine.svg)](https://www.npmjs.com/package/@gawryco/reactquiz-engine)
[![npm downloads](https://img.shields.io/npm/dm/@gawryco/reactquiz-engine.svg)](https://www.npmjs.com/package/@gawryco/reactquiz-engine)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@gawryco/reactquiz-engine)](https://bundlephobia.com/package/@gawryco/reactquiz-engine)
[![Size Limit](https://img.shields.io/badge/size-32.22%20KB-green)](https://github.com/gawryco/reactquiz-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/gawryco/reactquiz-engine)
[![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)](https://github.com/gawryco/reactquiz-engine)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gawryco/reactquiz-engine/pulls)

ReactQuiz Engine is a comprehensive React quiz component library with TypeScript support, multiple question types, and advanced features. Perfect for creating interactive surveys, assessments, lead generation forms, and onboarding flows.

## Features

- 🎯 **9 Question Types**: Single choice, multiple choice, scale, slider, text input, image selection, date picker, matrix, and ranking
- 📱 **Mobile Optimized**: Touch gestures, responsive design, and mobile-first approach
- 🎨 **Customizable**: Full control over branding, colors, styling, and button text with Tailwind CSS
- 🔄 **Progress Persistence**: Save and restore quiz progress with localStorage
- 🧠 **Conditional Logic**: Show/hide questions based on previous answers
- 📊 **Result Strategies**: Scoring, weighted, conditional, and custom calculation
- 📝 **Lead Capture**: Built-in form with validation for collecting user information
- 🌍 **i18n-ready**: Pluggable translation layer with language switch support
- ♿ **Accessible**: WCAG-compliant semantics and keyboard navigation
- 🎭 **Animations**: Smooth transitions and micro-interactions (slide, fade, scale, bounce)
- 📦 **TypeScript**: Full type safety and IntelliSense support
- 🎛️ **Grid Layouts**: BuzzFeed-style grid layouts for question options
- 🔤 **Custom Button Text**: Customize all button labels for better UX
- 📸 **Shareable Results**: Generate beautiful result images with html-to-image (lazy loaded) for social sharing

## Table of Contents

- [Installation](#installation)
- [Documentation](#documentation)
- [Quick Start](#quick-start)
- [Question Types](#question-types)
- [Advanced Features](#advanced-features)
  - [Conditional Logic](#conditional-logic)
  - [Weighted Scoring](#weighted-scoring)
  - [Custom Result Calculation](#custom-result-calculation)
  - [Progress Persistence](#progress-persistence)
  - [Timers](#timers)
  - [Animations](#animations)
  - [Internationalization (i18n)](#internationalization-i18n)
- [Styling and Branding](#styling-and-branding)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Requirements](#requirements)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install @gawryco/reactquiz-engine
# or
yarn add @gawryco/reactquiz-engine 
# or
pnpm add @gawryco/reactquiz-engine 
```

## Documentation

🚀 **[Live Documentation on GitHub Pages](https://gawryco.github.io/reactquiz-engine/)**

To see ReactQuiz Engine in action, you can either:

### Option 1: View Live Documentation
Visit the **[live documentation](https://gawryco.github.io/reactquiz-engine/)** hosted on GitHub Pages to see all features in action.

### Option 2: Run Locally
Clone and run the documentation locally:

```bash
# Clone the repository
git clone https://github.com/gawryco/reactquiz-engine.git
cd reactquiz-engine

# Install dependencies
pnpm install

# Run the documentation
pnpm dev
```

The documentation includes five examples:
- **Simple Quiz**: Love language assessment with basic question types
- **Advanced Quiz**: Calculator finder with image selection, sliders, matrix, weighted scoring
- **Timer Quiz**: Quiz-level and question-level timers with warning thresholds and auto-advance
- **Animation Showcase**: Demonstrates all transition types, timings, and effects
- **Conditional Logic Demo**: Questions appear dynamically based on previous answers

Open [http://localhost:5173](http://localhost:5173) to view the local documentation.

## Quick Start

```tsx
import React from 'react';
import { Quiz } from '@gawryco/reactquiz-engine';
import { Heart, User, Mail, Phone } from 'lucide-react';

const MyQuiz = () => {
  const quizConfig = {
    title: "What's Your Love Language? 💕",
    subtitle: "Discover how you express and receive love",

    branding: {
      colors: {
        primary: "from-pink-500 to-rose-600",
        secondary: "from-purple-500 to-pink-600",
        accent: "pink-500"
      },
      icon: Heart
    },

    behavior: {
      autoAdvance: true,
      showProgress: true,
      allowBack: true,
      saveProgress: false
    },

    questions: [
      {
        id: 1,
        question: "How do you prefer to show affection?",
        type: "single-choice",
        required: true,
        options: [
          { value: "words", label: "Saying 'I love you' and compliments" },
          { value: "touch", label: "Hugs, kisses, and physical contact" },
          { value: "time", label: "Spending quality time together" },
          { value: "gifts", label: "Giving thoughtful presents" },
          { value: "acts", label: "Doing helpful things for them" }
        ]
      }
    ],

    resultLogic: { type: "scoring" },
    results: {
      words: {
        title: "Words of Affirmation 💬",
        description: "You feel most loved when people express their feelings for you through words.",
        color: "from-blue-400 to-indigo-600"
      }
    },

    leadCapture: {
      enabled: true,
      title: "Get Your Results!",
      subtitle: "Enter your details to receive personalized insights",
      fields: [
        {
          key: 'name',
          label: 'Your Name',
          type: 'text',
          required: true,
          icon: User,
          placeholder: 'Enter your full name',
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: '^[a-zA-Z\\s\'-]+$',
            message: 'Please enter a valid name'
          }
        },
        {
          key: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          icon: Mail,
          placeholder: 'your.email@example.com'
        },
        {
          key: 'phone',
          label: 'Phone Number (Optional)',
          type: 'tel',
          required: false,
          icon: Phone,
          placeholder: '(555) 123-4567',
          validation: {
            pattern: '^(\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4}))$',
            message: 'Please enter a valid US phone number'
          }
        }
      ],
      privacyText: "🔒 We respect your privacy and won't spam you."
    },

    onSubmit: (leadData, answers, result) => {
      console.log('Quiz completed!', { leadData, answers, result });
    }
  };

  return <Quiz quizConfig={quizConfig} quizId="love-language-quiz" />;
};

export default MyQuiz;
```

## Question Types

### Single Choice
```tsx
{
  id: 1,
  question: "What's your favorite color?",
  type: "single-choice",
  required: true,
  options: [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" }
  ]
}
```

### Slider
```tsx
{
  id: 2,
  question: "Rate your satisfaction",
  type: "slider",
  min: 0,
  max: 10,
  step: 1,
  unit: "points"
}
```
**Note**: Slider questions always show a continue button for better UX.

### Multiple Choice
```tsx
{
  id: 2,
  question: "Which activities do you enjoy?",
  type: "multi-choice",
  description: "Select all that apply",
  options: [
    { value: "reading", label: "Reading" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" }
  ]
}
```

### Scale (1-5 Rating)
```tsx
{
  id: 3,
  question: "How satisfied are you?",
  type: "scale",
  scaleMax: 5,
  scaleLabels: { min: "Not satisfied", max: "Very satisfied" },
  required: true
}
```

### Slider
```tsx
{
  id: 4,
  question: "What's your budget range?",
  type: "slider",
  min: 1000,
  max: 10000,
  step: 500,
  unit: "USD"
}
```

### Text Input
```tsx
{
  id: 5,
  question: "Tell us about yourself",
  type: "text-input",
  placeholder: "Share your thoughts...",
  maxLength: 500,
  required: true
}
```

### Image Selection
```tsx
{
  id: 6,
  question: "Which style appeals to you?",
  type: "image-selection",
  options: [
    { 
      value: "modern", 
      label: "Modern", 
      image: "https://example.com/modern.jpg" 
    },
    { 
      value: "classic", 
      label: "Classic", 
      image: "https://example.com/classic.jpg" 
    }
  ]
}
```

### Date Picker
```tsx
{
  id: 7,
  question: "When is your event?",
  type: "date-picker",
  minDate: "2024-01-01",
  maxDate: "2024-12-31",
  required: true
}
```

### Matrix (Grid)
```tsx
{
  id: 8,
  question: "Rate each feature",
  type: "matrix",
  columns: ["Poor", "Fair", "Good", "Excellent"],
  rows: ["Ease of use", "Performance", "Design", "Support"]
}
```

## Advanced Features

### Conditional Logic
Show questions based on previous answers:

```tsx
{
  conditionalLogic: [
    {
      questionId: 5, // Show this question only if...
      dependsOn: 1,  // ...answer to question 1...
      operator: 'equals', // ...equals...
      value: 'yes' // ...'yes'
    }
  ]
}
```

### Weighted Scoring
Assign different weights to questions and answers:

```tsx
{
  resultLogic: {
    type: "weighted",
    weights: {
      1: 3, // Question 1 has 3x weight
      2: 1, // Question 2 has normal weight
      3: 2  // Question 3 has 2x weight
    }
  }
}
```

### Custom Result Calculation
```tsx
{
  resultLogic: {
    type: "custom",
    calculation: (answers) => {
      // Your custom logic here
      const score = calculateCustomScore(answers);
      return score > 80 ? 'expert' : 'beginner';
    }
  }
}
```

### Progress Persistence
```tsx
{
  behavior: {
    saveProgress: true, // Automatically save progress
    allowBack: true,    // Allow users to go back
    autoAdvance: false, // Manual navigation
    showProgress: true  // Show progress bar
  }
}
```

### Timers
Support quiz-level and question-level timers with warning thresholds and callbacks.

```tsx
{
  behavior: {
    timer: {
      enabled: true,
      duration: 120,
      showDisplay: true,
      autoAdvanceOnExpiry: true,
      warningThreshold: 30,
      onExpiry: () => console.log('Quiz timer expired')
    }
  }
}
```

Question-level timer example:

```tsx
{
  id: 2,
  question: 'Rate your programming experience',
  type: 'slider',
  timer: {
    enabled: true,
    duration: 30,
    showDisplay: true,
    autoAdvanceOnExpiry: true,
    warningThreshold: 10
  }
}
```

### Animations
Fine-tune transitions, timings, and interactive effects.

```tsx
{
  behavior: {
    animations: {
      transitions: { slideLeft: true, fadeIn: true, bounce: false, scale: true, slideUp: true },
      timing: { questionTransition: 350, optionHover: 150, buttonHover: 200, progressUpdate: 300 },
      effects: { pulseOnSelect: true, shakeOnError: true, glowOnFocus: true }
    }
  }
}
```

### Shareable Results
Generate beautiful result images for social sharing using html-to-image (lazy loaded):

```tsx
{
  onExportImage: (blob: Blob, options: { aspect: 'square' | 'story' | 'tweet' }) => {
    // Handle the generated image blob
    const url = URL.createObjectURL(blob);
    // Share or download the image
  }
}
```

The library automatically generates high-quality PNG images with customizable aspect ratios:
- **Square** (1080x1080): Perfect for Instagram posts
- **Story** (1080x1920): Ideal for Instagram/Snapchat stories  
- **Tweet** (1600x900): Optimized for Twitter/X sharing

The html-to-image library is lazy loaded to keep the initial bundle size small.

### Internationalization (i18n)
Import the i18n instance and switch languages dynamically. See the documentation for a full example.

```tsx
import i18n from '@gawryco/reactquiz-engine/i18n';

i18n.changeLanguage('fr');
```
```tsx
{
  behavior: {
    saveProgress: true, // Automatically save progress
    allowBack: true,    // Allow users to go back
    autoAdvance: false, // Manual navigation
    showProgress: true  // Show progress bar
  }
}
```

## Lead Capture Validation

The library includes comprehensive validation for lead capture forms with built-in validation rules and custom validation support.

### Built-in Validation

The library automatically applies validation rules based on field type:

- **Email fields**: Validates email format using RFC-compliant regex
- **Phone fields**: Validates phone number format (supports international and US formats)
- **Text fields**: Applies name validation for fields with "name" in the key

### Custom Validation

You can define custom validation rules for any field:

```tsx
{
  key: 'name',
  label: 'Full Name',
  type: 'text',
  required: true,
  icon: User,
  placeholder: 'Enter your full name',
  validation: {
    minLength: 2,
    maxLength: 50,
    pattern: '^[a-zA-Z\\s\'-]+$',
    message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
  }
}
```

### Validation Rules

| Rule | Type | Description |
|------|------|-------------|
| `minLength` | number | Minimum character length |
| `maxLength` | number | Maximum character length |
| `pattern` | string | Regex pattern for validation |
| `message` | string | Custom error message |
| `custom` | function | Custom validation function that returns error message or null |

### Custom Validation Function

```tsx
{
  key: 'website',
  label: 'Website',
  type: 'text',
  required: false,
  icon: Globe,
  validation: {
    custom: (value) => {
      if (value && !value.startsWith('http')) {
        return 'Website must start with http:// or https://';
      }
      return null; // Valid
    }
  }
}
```

### Visual Feedback

The library provides real-time visual feedback for validation errors:

- Red border and background for invalid fields
- Error icons next to invalid inputs
- Detailed error messages below each field
- Form submission is disabled until all validation passes

## Styling and Branding

### Custom Colors
```tsx
{
  branding: {
    colors: {
      primary: "from-blue-500 to-purple-600",    // Gradient for buttons
      secondary: "from-green-500 to-emerald-600", // Secondary actions
      accent: "blue-500"                          // Accent color for selections
    },
    icon: YourIcon // Lucide React icon
  }
}
```

### Custom Button Text
```tsx
{
  behavior: {
    buttonText: {
      next: 'Next Question',
      back: 'Previous',
      continue: 'Continue',
      submit: 'Get My Results',
      start: 'Start Quiz'
    }
  }
}
```

### Grid Layouts
```tsx
{
  id: 1,
  question: "What's your favorite color?",
  type: "single-choice",
  layout: {
    type: 'grid',        // 'list' or 'grid'
    columns: 2,          // 2, 3, or 4 columns
    gap: 'md'            // 'sm', 'md', or 'lg'
  },
  options: [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" }
  ]
}
```

### Custom CSS Classes
```tsx
<Quiz 
  quizConfig={config} 
  className="my-custom-quiz" 
/>
```

## API Reference

### Quiz Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `quizConfig` | `Partial<QuizConfig>` | ✅ | Quiz configuration object |
| `quizId` | `string` | ❌ | Unique identifier for progress persistence |
| `className` | `string` | ❌ | Additional CSS classes |

### QuizConfig Interface

```tsx
interface QuizConfig {
  title: string;
  subtitle: string;
  startButtonText?: string;
  welcomeFooter?: string;
  branding: QuizBranding;
  behavior: QuizBehavior;
  questions: QuizQuestion[];
  conditionalLogic?: ConditionalLogic[];
  resultLogic: ResultLogic;
  results: Record<string, QuizResult>;
  leadCapture: LeadCapture;
  thankYouMessage?: string;
  onSubmit: (
    leadData: Record<string, string>,
    answers: Record<string, QuizAnswer>,
    result: string
  ) => void;
}
```

### useQuiz Hook

For advanced usage, you can use the `useQuiz` hook directly:

```tsx
import { useQuiz } from '@gawryco/reactquiz-engine';

const MyCustomQuiz = () => {
  const {
    config,
    state,
    visibleQuestions,
    totalSteps,
    progress,
    handleAnswerSelect,
    handleNext,
    handleBack,
    handleSubmit,
    resetQuiz
  } = useQuiz(quizConfig, 'my-quiz');

  // Your custom implementation
  return <div>...</div>;
};
```


## Requirements

- React 16.8+ (hooks support)
- Lucide React for icons
- Tailwind CSS for styling

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
MIT © [Gawry&Co](https://github.com/gawryco)

## Support

- 📖 [Documentation](https://github.com/gawryco/reactquiz-engine#readme)
- 🐛 [Report Issues](https://github.com/gawryco/reactquiz-engine/issues)
- 💬 [Discussions](https://github.com/gawryco/reactquiz-engine/discussions)
