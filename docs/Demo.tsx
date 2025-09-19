import React, { useState, useEffect } from 'react';
import { Quiz, QuizConfig } from '../src';
import { Heart, User, Mail, Phone, Award, ChevronRight, Clock, Timer, Globe, Github, Rocket, BookOpen, Layers, ShieldCheck, Languages, Zap, Share2 } from 'lucide-react';

// Import i18n after other imports to avoid circular dependencies
let i18n: any = null;
import('../src/i18n').then(module => {
  i18n = module.default;
});


const Demo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<'simple' | 'advanced' | 'timer' | 'animations' | 'conditional'>('simple');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [pkgMgr, setPkgMgr] = useState<'npm' | 'yarn' | 'pnpm'>('pnpm');
  const [copied, setCopied] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' }
  ];

  const installCommand = pkgMgr === 'npm'
    ? 'npm install @gawryco/reactquiz-engine'
    : pkgMgr === 'yarn'
    ? 'yarn add @gawryco/reactquiz-engine'
    : 'pnpm add @gawryco/reactquiz-engine ';

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    if (i18n) {
      i18n.changeLanguage(languageCode);
    }
  };

  // Initialize i18n when it's loaded
  useEffect(() => {
    if (i18n) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  const simpleConfig = {
    title: "What's Your Love Language? 💕",
    subtitle: "Discover how you express and receive love",
    startButtonText: "Find Out Now",
    
    branding: {
      colors: {
        primary: "from-pink-500 to-rose-600",
        secondary: "from-purple-500 to-pink-600",
        accent: "pink-500"
      },
      icon: Heart
    },
    
    behavior: {
      autoAdvance: autoAdvance,
      showProgress: true,
      allowBack: true,
      saveProgress: false,
      animations: {
        transitions: {
          slideLeft: false,
          fadeIn: true,
          bounce: true,
          scale: true,
          slideUp: true
        },
        timing: {
          questionTransition: 350,
          optionHover: 150,
          buttonHover: 200,
          progressUpdate: 400
        },
        effects: {
          pulseOnSelect: true,
          shakeOnError: true,
          glowOnFocus: false
        }
      },
      buttonText: {
        next: 'Next Question',
        back: 'Previous',
        continue: 'Continue',
        submit: 'Get My Results',
        start: 'Find My Love Language'
      }
    },

    questions: [
      {
        id: 1,
        question: "How do you prefer to show affection?",
        type: "single-choice" as const,
        required: true,
        layout: {
          type: 'grid' as const,
          columns: 2,
          gap: 'md' as const
        },
        options: [
          { value: "words", label: "Saying 'I love you' and compliments", weight: { words: 3, touch: 0, time: 1, gifts: 0, acts: 1 } },
          { value: "touch", label: "Hugs, kisses, and physical contact", weight: { words: 0, touch: 3, time: 1, gifts: 0, acts: 1 } },
          { value: "time", label: "Spending quality time together", weight: { words: 1, touch: 1, time: 3, gifts: 0, acts: 1 } },
          { value: "gifts", label: "Giving thoughtful presents", weight: { words: 0, touch: 0, time: 1, gifts: 3, acts: 1 } },
          { value: "acts", label: "Doing helpful things for them", weight: { words: 1, touch: 1, time: 1, gifts: 0, acts: 3 } }
        ]
      },
      {
        id: 2,
        question: "What makes you feel most loved?",
        type: "single-choice" as const,
        required: true,
        layout: {
          type: 'grid' as const,
          columns: 2,
          gap: 'md' as const
        },
        options: [
          { value: "words", label: "Hearing words of affirmation", weight: { words: 3, touch: 0, time: 1, gifts: 0, acts: 1 } },
          { value: "touch", label: "Physical affection and closeness", weight: { words: 0, touch: 3, time: 1, gifts: 0, acts: 1 } },
          { value: "time", label: "Undivided attention and time", weight: { words: 1, touch: 1, time: 3, gifts: 0, acts: 1 } },
          { value: "gifts", label: "Receiving meaningful gifts", weight: { words: 0, touch: 0, time: 1, gifts: 3, acts: 1 } },
          { value: "acts", label: "When they help or do things for me", weight: { words: 1, touch: 1, time: 1, gifts: 0, acts: 3 } }
        ]
      },
      {
        id: 3,
        question: "Rate how important physical touch is to you",
        type: "scale" as const,
        scaleMax: 5,
        scaleLabels: { min: "Not important", max: "Very important" },
        required: true,
        scaleWeights: {
          1: { words: 0, touch: 0, time: 0, gifts: 0, acts: 0 },
          2: { words: 0, touch: 1, time: 0, gifts: 0, acts: 0 },
          3: { words: 0, touch: 2, time: 0, gifts: 0, acts: 0 },
          4: { words: 0, touch: 3, time: 0, gifts: 0, acts: 0 },
          5: { words: 0, touch: 4, time: 0, gifts: 0, acts: 0 }
        }
      },
      {
        id: 4,
        question: "When did you first realize your love language?",
        type: "date-picker" as const,
        required: false
      }
    ],

    resultLogic: { type: "scoring" as const },

    results: {
      words: {
        title: "Words of Affirmation 💬",
        description: "You feel most loved when people express their feelings for you through words. Compliments, encouragement, and verbal expressions of love mean the world to you.",
        recommendations: [
          "Ask your partner to tell you what they appreciate about you",
          "Keep a journal of positive things people say about you",
          "Practice expressing gratitude verbally to others"
        ],
        color: "from-blue-400 to-indigo-600",
        cta: "Learn More About Words of Affirmation"
      },
      touch: {
        title: "Physical Touch 🤗",
        description: "Physical affection is your primary love language. Hugs, kisses, holding hands, and other forms of physical contact make you feel most loved and secure.",
        recommendations: [
          "Ask for more hugs and physical affection",
          "Try massage or other forms of therapeutic touch",
          "Create opportunities for physical closeness"
        ],
        color: "from-pink-400 to-red-500",
        cta: "Discover Touch-Based Love"
      },
      time: {
        title: "Quality Time ⏰",
        description: "You feel most loved when someone gives you their undivided attention and spends quality time with you. It's not about the activity, but the focused presence.",
        recommendations: [
          "Schedule regular one-on-one time with loved ones",
          "Practice active listening during conversations",
          "Create meaningful rituals and traditions"
        ],
        color: "from-green-400 to-emerald-600",
        cta: "Plan Quality Time Activities"
      },
      gifts: {
        title: "Receiving Gifts 🎁",
        description: "Thoughtful gifts make you feel loved and appreciated. It's not about the monetary value, but the thought and effort behind the gift that matters most.",
        recommendations: [
          "Express appreciation for gifts you receive",
          "Give thoughtful gifts to show you care",
          "Keep a collection of meaningful items from loved ones"
        ],
        color: "from-yellow-400 to-orange-500",
        cta: "Explore Gift Ideas"
      },
      acts: {
        title: "Acts of Service 🛠️",
        description: "You feel most loved when people do things for you or help you out. Actions speak louder than words for you, and you appreciate when someone goes out of their way to help.",
        recommendations: [
          "Ask for help when you need it",
          "Do helpful things for others without being asked",
          "Express gratitude for acts of service you receive"
        ],
        color: "from-purple-400 to-pink-600",
        cta: "Practice Acts of Service"
      }
    },

    leadCapture: {
      enabled: false,
      title: "Get Your Love Language Guide! 📖",
      subtitle: "Receive personalized tips and insights based on your love language",
      fields: [
        { 
          key: 'name', 
          label: 'Your Name', 
          type: 'text' as const, 
          required: true, 
          icon: User,
          placeholder: 'Enter your full name',
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: '^[a-zA-Z\\s\'-]+$',
            message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
          }
        },
        { 
          key: 'email', 
          label: 'Email Address', 
          type: 'email' as const, 
          required: true, 
          icon: Mail,
          placeholder: 'your.email@example.com'
        }
      ],
      submitText: "Get My Guide",
      privacyText: "🔒 We respect your privacy and won't spam you."
    },

    thankYouMessage: "Check your email for your personalized love language guide!",

    onSubmit: (leadData: any, answers: any, result: any) => {
      console.log('Love Language Quiz Results:', {
        lead: leadData,
        answers: answers,
        loveLanguage: result,
        timestamp: new Date().toISOString()
      });
    }
  };

  const advancedConfig = {
    title: "Advanced Calculator Finder 🎯",
    subtitle: "Let's find the perfect calculator tools for your specific needs",
    startButtonText: "Discover My Tools",
    welcomeFooter: "⏱️ 3 minutes • 🎯 AI-powered recommendations • 📱 Mobile optimized",
    
    branding: {
      colors: {
        primary: "from-purple-500 to-pink-600",
        secondary: "from-green-500 to-teal-600",
        accent: "purple-500"
      },
      icon: Award
    },
    
    behavior: {
      autoAdvance: autoAdvance,
      showProgress: true,
      allowBack: true,
      saveProgress: true,
      shuffleOptions: false,
      animations: {
        transitions: {
          slideLeft: false,
          fadeIn: false,
          bounce: false,
          scale: true,
          slideUp: true
        },
        timing: {
          questionTransition: 450,
          optionHover: 180,
          buttonHover: 220,
          progressUpdate: 350
        },
        effects: {
          pulseOnSelect: false,
          shakeOnError: true,
          glowOnFocus: true
        }
      },
      buttonText: {
        next: 'Next Step',
        back: 'Go Back',
        continue: 'Continue',
        submit: 'Get My Calculator Suite',
        start: 'Discover My Tools'
      }
    },

    questions: [
      {
        id: 1,
        question: "What's your primary area of focus?",
        description: "This helps us understand your main interests",
        type: "image-selection" as const,
        required: true,
        options: [
          { 
            value: "finance", 
            label: "Finance & Money", 
            image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=200&fit=crop",
            weight: { financial: 5, health: 0, academic: 1, business: 2 } 
          },
          { 
            value: "health", 
            label: "Health & Fitness", 
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
            weight: { financial: 0, health: 5, academic: 1, business: 0 } 
          },
          { 
            value: "education", 
            label: "Study & Research", 
            image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
            weight: { financial: 1, health: 0, academic: 5, business: 1 } 
          }
        ]
      },
      {
        id: 2,
        question: "How would you rate your comfort with numbers?",
        type: "scale" as const,
        scaleMax: 5,
        scaleLabels: { min: "Not comfortable", max: "Love numbers!" },
        required: true,
        scaleWeights: {
          1: { financial: 1, health: 2, academic: 0, business: 1 },
          2: { financial: 1, health: 2, academic: 1, business: 1 },
          3: { financial: 2, health: 1, academic: 2, business: 2 },
          4: { financial: 3, health: 1, academic: 3, business: 3 },
          5: { financial: 3, health: 0, academic: 5, business: 3 }
        }
      },
      {
        id: 3,
        question: "What's your typical monthly income range?",
        type: "slider" as const,
        min: 1000,
        max: 50000,
        step: 1000,
        unit: "USD",
        valueWeights: {
          5000: { financial: 2, health: 1, academic: 1, business: 1 },
          15000: { financial: 3, health: 2, academic: 2, business: 3 },
          30000: { financial: 5, health: 3, academic: 3, business: 5 }
        }
      },
      {
        id: 4,
        question: "Which calculation areas interest you most?",
        type: "multi-choice" as const,
        description: "Select all that apply",
        layout: {
          type: 'grid' as const,
          columns: 2,
          gap: 'md' as const
        },
        options: [
          { value: "loans", label: "Loans & Mortgages", weight: { financial: 3, health: 0, academic: 0, business: 0 } },
          { value: "investments", label: "Investment Returns", weight: { financial: 3, health: 0, academic: 0, business: 1 } },
          { value: "health-metrics", label: "Health Metrics", weight: { financial: 0, health: 3, academic: 0, business: 0 } },
          { value: "academic", label: "Math & Science", weight: { financial: 0, health: 0, academic: 3, business: 0 } },
          { value: "business", label: "Business Calculations", weight: { financial: 1, health: 0, academic: 0, business: 3 } }
        ]
      },
      {
        id: 5,
        question: "Rate these calculator features by importance:",
        type: "matrix" as const,
        rows: [
          "Basic Arithmetic",
          "Scientific Functions",
          "Graphing Capabilities", 
          "Programming Features",
          "Mobile App"
        ],
        columns: [
          "1 - Not Needed",
          "2",
          "3",
          "4", 
          "5 - Essential"
        ],
        required: true,
        matrixWeights: {
          basic: {
            1: { financial: 0, health: 0, academic: 0, business: 0 },
            2: { financial: 1, health: 1, academic: 0, business: 1 },
            3: { financial: 2, health: 2, academic: 1, business: 2 },
            4: { financial: 3, health: 3, academic: 2, business: 3 },
            5: { financial: 4, health: 4, academic: 3, business: 4 }
          },
          scientific: {
            1: { financial: 0, health: 0, academic: 0, business: 0 },
            2: { financial: 0, health: 0, academic: 1, business: 0 },
            3: { financial: 1, health: 1, academic: 2, business: 1 },
            4: { financial: 2, health: 2, academic: 3, business: 2 },
            5: { financial: 3, health: 3, academic: 4, business: 3 }
          },
          graphing: {
            1: { financial: 0, health: 0, academic: 0, business: 0 },
            2: { financial: 0, health: 0, academic: 1, business: 0 },
            3: { financial: 0, health: 0, academic: 2, business: 0 },
            4: { financial: 1, health: 1, academic: 3, business: 1 },
            5: { financial: 2, health: 2, academic: 4, business: 2 }
          },
          programming: {
            1: { financial: 0, health: 0, academic: 0, business: 0 },
            2: { financial: 0, health: 0, academic: 0, business: 0 },
            3: { financial: 0, health: 0, academic: 1, business: 0 },
            4: { financial: 0, health: 0, academic: 2, business: 1 },
            5: { financial: 1, health: 0, academic: 3, business: 2 }
          },
          mobile: {
            1: { financial: 0, health: 0, academic: 0, business: 0 },
            2: { financial: 1, health: 1, academic: 0, business: 1 },
            3: { financial: 2, health: 2, academic: 1, business: 2 },
            4: { financial: 3, health: 3, academic: 2, business: 3 },
            5: { financial: 4, health: 4, academic: 3, business: 4 }
          }
        }
      },
      {
        id: 6,
        question: "When did you start using calculators regularly?",
        type: "date-picker" as const,
        required: false
      }
    ],

    resultLogic: {
      type: "weighted" as const,
      weights: {
        1: 3,
        2: 2,
        3: 1,
        4: 2
      }
    },

    results: {
      financial: {
        title: "Financial Planning Pro! 💰",
        description: "You're ready for advanced financial calculations and planning tools. Our comprehensive financial suite will help optimize your money decisions.",
        recommendations: [
          "Compound Interest Calculator with Charts",
          "Advanced Loan Comparison Tool",
          "Investment Portfolio Analyzer",
          "Retirement Planning Dashboard",
          "Tax Optimization Calculator"
        ],
        color: "from-green-400 to-emerald-600",
        cta: "Explore Financial Suite"
      },
      health: {
        title: "Health Optimization Expert! 🏃‍♂️",
        description: "Perfect! You're focused on health metrics and wellness tracking. Our health calculator collection will support your fitness journey.",
        recommendations: [
          "Advanced BMI & Body Composition",
          "Nutrition & Macro Calculator",
          "Heart Rate Training Zones",
          "Calorie Burn Estimator",
          "Health Goal Progress Tracker"
        ],
        color: "from-pink-400 to-red-500",
        cta: "Start Health Tracking"
      },
      academic: {
        title: "Academic Excellence Seeker! 📚",
        description: "Great choice! You value precision and advanced calculations. Our academic tools will accelerate your studies and research.",
        recommendations: [
          "Scientific Calculator Pro",
          "Statistics & Probability Suite",
          "Unit Conversion Master",
          "Grade & GPA Calculator",
          "Research Data Analyzer"
        ],
        color: "from-purple-400 to-indigo-600",
        cta: "Access Academic Tools"
      },
      business: {
        title: "Business Strategy Master! 🏢",
        description: "Excellent! You're focused on business growth and optimization. Our business calculator suite will power your decisions.",
        recommendations: [
          "ROI & Profit Calculator",
          "Break-even Analysis Tool",
          "Cash Flow Projector",
          "Business Valuation Calculator",
          "Marketing Budget Optimizer"
        ],
        color: "from-orange-400 to-red-500",
        cta: "Launch Business Tools"
      }
    },

    leadCapture: {
      enabled: true,
      title: "Unlock Your Personalized Calculator Suite! 🎉",
      subtitle: "Get instant access to your recommended tools plus exclusive tips and updates",
      fields: [
        { 
          key: 'name', 
          label: 'Full Name', 
          type: 'text' as const, 
          required: true, 
          icon: User,
          placeholder: 'Enter your full name',
          validation: {
            minLength: 2,
            maxLength: 50,
            pattern: '^[a-zA-Z\\s\'-]+$',
            message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
          }
        },
        { 
          key: 'email', 
          label: 'Email Address', 
          type: 'email' as const, 
          required: true, 
          icon: Mail,
          placeholder: 'your.email@example.com'
        },
        { 
          key: 'phone', 
          label: 'Phone Number (Optional)', 
          type: 'tel' as const, 
          required: false, 
          icon: Phone,
          placeholder: '(555) 123-4567',
          validation: {
            pattern: '^(\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4}))$',
            message: 'Please enter a valid US phone number (e.g., (555) 123-4567)'
          }
        }
      ],
      submitText: "Get My Calculator Suite",
      privacyText: "🔒 Your data is secure. Unsubscribe anytime."
    },

    thankYouMessage: "We're preparing your personalized calculator dashboard and will send setup instructions shortly!",

    onSubmit: (leadData: any, answers: any, result: any) => {
      console.log('Advanced Quiz Results:', {
        lead: leadData,
        answers: answers,
        recommendedSuite: result,
        timestamp: new Date().toISOString()
      });
    }
  };

  const timerConfig: Partial<QuizConfig> = {
    title: "Timed Quiz Example",
    subtitle: "Test your knowledge with time pressure!",
    branding: {
      colors: {
        primary: "from-purple-500 to-pink-600",
        secondary: "from-blue-500 to-cyan-600",
        accent: "purple-500"
      },
      icon: Clock
    },
    behavior: {
      autoAdvance: false,
      showProgress: true,
      allowBack: true,
      saveProgress: false,
      shuffleOptions: false,
      // Quiz-level timer: 2 minutes total
      timer: {
        enabled: true,
        duration: 120, // 2 minutes
        showDisplay: true,
        autoAdvanceOnExpiry: true,
        warningThreshold: 30, // Show warning when 30 seconds left
        onExpiry: () => {
          console.log('Quiz timer expired!');
        }
      },
      // Animation system
      animations: {
        transitions: {
          slideLeft: true,
          fadeIn: false,
          bounce: false,
          scale: false,
          slideUp: false
        },
        timing: {
          questionTransition: 250,
          optionHover: 120,
          buttonHover: 150,
          progressUpdate: 250
        },
        effects: {
          pulseOnSelect: true,
          shakeOnError: true,
          glowOnFocus: true
        }
      },
      buttonText: {
        next: 'Next',
        back: 'Back',
        continue: 'Continue',
        submit: 'Submit Quiz',
        start: 'Start Timed Quiz'
      }
    },
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        type: "single-choice",
        required: true,
        options: [
          { value: "london", label: "London" },
          { value: "berlin", label: "Berlin" },
          { value: "paris", label: "Paris" },
          { value: "madrid", label: "Madrid" }
        ],
        weight: { "paris": 1 }
      },
      {
        id: 2,
        question: "Rate your programming experience",
        type: "slider",
        required: true,
        min: 0,
        max: 10,
        step: 1,
        unit: "years",
        // Question-level timer: 30 seconds for this question
        timer: {
          enabled: true,
          duration: 30,
          showDisplay: true,
          autoAdvanceOnExpiry: true,
          warningThreshold: 10,
          onExpiry: () => {
            console.log('Question timer expired!');
          }
        }
      },
      {
        id: 3,
        question: "Which programming languages do you know?",
        type: "multi-choice",
        required: true,
        options: [
          { value: "javascript", label: "JavaScript" },
          { value: "python", label: "Python" },
          { value: "java", label: "Java" },
          { value: "csharp", label: "C#" },
          { value: "go", label: "Go" },
          { value: "rust", label: "Rust" }
        ],
        // Question-level timer: 45 seconds for this question
        timer: {
          enabled: true,
          duration: 45,
          showDisplay: true,
          autoAdvanceOnExpiry: true,
          warningThreshold: 15,
          onExpiry: () => {
            console.log('Multi-choice question timer expired!');
          }
        }
      },
      {
        id: 4,
        question: "Describe your ideal work environment",
        type: "text-input",
        required: true,
        placeholder: "Tell us about your preferences...",
        maxLength: 200,
        // Question-level timer: 60 seconds for this question
        timer: {
          enabled: true,
          duration: 60,
          showDisplay: true,
          autoAdvanceOnExpiry: true,
          warningThreshold: 20,
          onExpiry: () => {
            console.log('Text input question timer expired!');
          }
        }
      },
      {
        id: 5,
        question: "Rate these skills by importance:",
        type: "matrix",
        required: true,
        rows: [
          "Problem Solving",
          "Communication",
          "Teamwork",
          "Leadership", 
          "Creativity"
        ],
        columns: [
          "1 - Not Important",
          "2",
          "3",
          "4",
          "5 - Critical"
        ],
        // Question-level timer: 90 seconds for this question
        timer: {
          enabled: true,
          duration: 90,
          showDisplay: true,
          autoAdvanceOnExpiry: true,
          warningThreshold: 30,
          onExpiry: () => {
            console.log('Matrix question timer expired!');
          }
        }
      },
      {
        id: 6,
        question: "When did you start your current career?",
        type: "date-picker",
        required: false,
        // Question-level timer: 30 seconds for this question
        timer: {
          enabled: true,
          duration: 30,
          showDisplay: true,
          autoAdvanceOnExpiry: true,
          warningThreshold: 10,
          onExpiry: () => {
            console.log('Date picker question timer expired!');
          }
        }
      }
    ],
    resultLogic: {
      type: "scoring"
    },
    results: {
      "beginner": {
        title: "Beginner Level",
        description: "You're just starting your programming journey! Keep learning and practicing.",
        color: "from-green-500 to-emerald-600",
        recommendations: [
          "Start with basic programming concepts",
          "Practice coding daily",
          "Join programming communities",
          "Build small projects"
        ],
        cta: "Start Learning"
      },
      "intermediate": {
        title: "Intermediate Level",
        description: "You have a solid foundation! Time to tackle more complex projects.",
        color: "from-blue-500 to-cyan-600",
        recommendations: [
          "Work on larger projects",
          "Learn new frameworks",
          "Contribute to open source",
          "Mentor beginners"
        ],
        cta: "Level Up"
      },
      "advanced": {
        title: "Advanced Level",
        description: "You're an experienced developer! Consider sharing your knowledge with others.",
        color: "from-purple-500 to-pink-600",
        recommendations: [
          "Lead technical projects",
          "Write technical articles",
          "Speak at conferences",
          "Mentor other developers"
        ],
        cta: "Share Knowledge"
      }
    },
    leadCapture: {
      enabled: true,
      title: "Get Your Results!",
      subtitle: "Enter your details to receive personalized recommendations",
      fields: [
        {
          key: "name",
          label: "Full Name",
          type: "text",
          required: true,
          icon: Clock
        },
        {
          key: "email",
          label: "Email Address",
          type: "email",
          required: true,
          icon: Timer
        }
      ],
      privacyText: "🔒 Your data is secure. We don't send spam.",
      submitText: "Get My Results"
    },
    onSubmit: (leadData, answers, result) => {
      console.log('Quiz submitted!', { leadData, answers, result });
      alert(`Quiz completed! Result: ${result}`);
    }
  };

  // Animation Showcase Configuration
  const animationConfig: Partial<QuizConfig> = {
    title: "Animation Showcase 🎬",
    subtitle: "Experience all the smooth transitions and effects",
    startButtonText: "Start Animation Demo",
    welcomeFooter: "✨ Multiple transition types • 🎯 Interactive effects • 📱 Smooth animations",
    
    branding: {
      colors: {
        primary: "from-indigo-500 to-purple-600",
        secondary: "from-pink-500 to-rose-600",
        accent: "indigo-500"
      },
      icon: Timer
    },
    
    behavior: {
      autoAdvance: false,
      showProgress: true,
      allowBack: true,
      saveProgress: false,
      shuffleOptions: false,
      animations: {
        transitions: {
          slideLeft: true,
          fadeIn: true,
          bounce: true,
          scale: true,
          slideUp: true
        },
        timing: {
          questionTransition: 500,
          optionHover: 150,
          buttonHover: 200,
          progressUpdate: 300
        },
        effects: {
          pulseOnSelect: true,
          shakeOnError: true,
          glowOnFocus: true
        }
      },
      buttonText: {
        next: 'Next Animation',
        back: 'Previous',
        continue: 'Continue',
        submit: 'See All Effects',
        start: 'Start Animation Demo'
      }
    },
    
    questions: [
      {
        id: 1,
        question: "Which transition effect do you prefer?",
        type: "single-choice",
        options: [
          { value: "slide", label: "Slide Left" },
          { value: "fade", label: "Fade In" },
          { value: "scale", label: "Scale" },
          { value: "slideup", label: "Slide Up" }
        ],
        required: true
      },
      {
        id: 2,
        question: "Rate the smoothness of transitions",
        type: "scale",
        min: 1,
        max: 10,
        scaleLabels: {
          min: "Not Smooth",
          max: "Very Smooth"
        },
        required: true
      },
      {
        id: 3,
        question: "How much do you like bounce effects?",
        type: "slider",
        min: 0,
        max: 100,
        step: 10,
        unit: "%",
        required: true
      },
      {
        id: 4,
        question: "Select your favorite animation timing",
        type: "multi-choice",
        options: [
          { value: "fast", label: "Fast (200ms)" },
          { value: "medium", label: "Medium (400ms)" },
          { value: "slow", label: "Slow (600ms)" },
          { value: "custom", label: "Custom timing" }
        ],
        required: true
      },
      {
        id: 5,
        question: "What's your favorite visual effect?",
        type: "single-choice",
        options: [
          { value: "pulse", label: "Pulse on selection" },
          { value: "glow", label: "Glow on focus" },
          { value: "shake", label: "Shake on error" },
          { value: "all", label: "All of them!" }
        ],
        required: true
      }
    ],
    
    results: {
      "slide": {
        title: "Slide Lover! 🏃‍♂️",
        description: "You prefer the classic slide transitions that feel natural and intuitive.",
        color: "blue"
      },
      "fade": {
        title: "Fade Enthusiast! ✨",
        description: "You love the elegant fade effects that create a smooth, professional feel.",
        color: "purple"
      },
      "scale": {
        title: "Scale Master! 📏",
        description: "You appreciate the dynamic scale animations that add depth and dimension.",
        color: "green"
      },
      "slideup": {
        title: "Slide Up Specialist! ⬆️",
        description: "You enjoy the upward slide animations that feel modern and fresh.",
        color: "orange"
      }
    },
    
    leadCapture: {
      enabled: false,
      title: "",
      subtitle: "",
      fields: [],
      privacyText: ""
    },
    
    thankYouMessage: "Thanks for exploring our animation system! 🎉",
    onSubmit: (leadData, answers, result) => {
      console.log('Animation Demo Results:', { leadData, answers, result });
    }
  };

  // Conditional Logic Showcase Configuration
  const conditionalConfig: Partial<QuizConfig> = {
    title: "Conditional Logic Demo 🧠",
    subtitle: "See how questions appear based on your previous answers",
    startButtonText: "Start Smart Quiz",
    welcomeFooter: "🎯 Dynamic questions • 🧠 Smart branching • 📊 Personalized flow",
    
    branding: {
      colors: {
        primary: "from-emerald-500 to-teal-600",
        secondary: "from-orange-500 to-red-600",
        accent: "emerald-500"
      },
      icon: Award
    },
    
    behavior: {
      autoAdvance: autoAdvance,
      showProgress: true,
      allowBack: true,
      saveProgress: false,
      shuffleOptions: false,
      animations: {
        transitions: {
          slideLeft: false,
          fadeIn: true,
          bounce: false,
          scale: true,
          slideUp: true
        },
        timing: {
          questionTransition: 400,
          optionHover: 150,
          buttonHover: 200,
          progressUpdate: 300
        },
        effects: {
          pulseOnSelect: true,
          shakeOnError: true,
          glowOnFocus: true
        }
      },
      buttonText: {
        next: 'Next Question',
        back: 'Previous',
        continue: 'Continue',
        submit: 'Get My Results',
        start: 'Start Smart Quiz'
      }
    },
    
    questions: [
      {
        id: 1,
        question: "What's your primary interest?",
        description: "This determines which questions you'll see next",
        type: "single-choice",
        required: true,
        options: [
          { value: "tech", label: "Technology & Programming" },
          { value: "design", label: "Design & Creativity" },
          { value: "business", label: "Business & Marketing" },
          { value: "health", label: "Health & Fitness" }
        ]
      },
      // Tech-specific questions (only shown if tech is selected)
      {
        id: 2,
        question: "What programming languages do you work with?",
        type: "multi-choice",
        required: true,
        options: [
          { value: "javascript", label: "JavaScript" },
          { value: "python", label: "Python" },
          { value: "java", label: "Java" },
          { value: "csharp", label: "C#" },
          { value: "go", label: "Go" },
          { value: "rust", label: "Rust" }
        ]
      },
      {
        id: 3,
        question: "How many years of programming experience do you have?",
        type: "slider",
        required: true,
        min: 0,
        max: 20,
        step: 1,
        unit: "years"
      },
      // Design-specific questions (only shown if design is selected)
      {
        id: 4,
        question: "What design tools do you use?",
        type: "multi-choice",
        required: true,
        options: [
          { value: "figma", label: "Figma" },
          { value: "sketch", label: "Sketch" },
          { value: "adobe", label: "Adobe Creative Suite" },
          { value: "canva", label: "Canva" },
          { value: "other", label: "Other tools" }
        ]
      },
      {
        id: 5,
        question: "What's your design specialty?",
        type: "single-choice",
        required: true,
        options: [
          { value: "ui", label: "UI Design" },
          { value: "ux", label: "UX Design" },
          { value: "graphic", label: "Graphic Design" },
          { value: "branding", label: "Branding" },
          { value: "web", label: "Web Design" }
        ]
      },
      // Business-specific questions (only shown if business is selected)
      {
        id: 6,
        question: "What's your business focus?",
        type: "single-choice",
        required: true,
        options: [
          { value: "startup", label: "Startup/Entrepreneurship" },
          { value: "marketing", label: "Digital Marketing" },
          { value: "sales", label: "Sales & Business Development" },
          { value: "consulting", label: "Business Consulting" }
        ]
      },
      {
        id: 7,
        question: "What's your company size?",
        type: "single-choice",
        required: true,
        options: [
          { value: "solo", label: "Solo entrepreneur" },
          { value: "small", label: "Small team (2-10)" },
          { value: "medium", label: "Medium company (11-50)" },
          { value: "large", label: "Large enterprise (50+)" }
        ]
      },
      // Health-specific questions (only shown if health is selected)
      {
        id: 8,
        question: "What's your fitness level?",
        type: "scale",
        required: true,
        scaleMax: 5,
        scaleLabels: { min: "Beginner", max: "Expert" }
      },
      {
        id: 9,
        question: "What are your health goals?",
        type: "multi-choice",
        required: true,
        options: [
          { value: "weight", label: "Weight management" },
          { value: "strength", label: "Build strength" },
          { value: "endurance", label: "Improve endurance" },
          { value: "flexibility", label: "Increase flexibility" },
          { value: "wellness", label: "General wellness" }
        ]
      },
      // Common follow-up question for all paths
      {
        id: 10,
        question: "How much time can you dedicate daily?",
        type: "single-choice",
        required: true,
        options: [
          { value: "15min", label: "15 minutes" },
          { value: "30min", label: "30 minutes" },
          { value: "1hour", label: "1 hour" },
          { value: "2hours", label: "2+ hours" }
        ]
      }
    ],

    // Conditional logic rules
    conditionalLogic: [
      // Show tech questions only if tech is selected
      { questionId: 2, dependsOn: 1, operator: 'equals', value: 'tech' },
      { questionId: 3, dependsOn: 1, operator: 'equals', value: 'tech' },
      
      // Show design questions only if design is selected
      { questionId: 4, dependsOn: 1, operator: 'equals', value: 'design' },
      { questionId: 5, dependsOn: 1, operator: 'equals', value: 'design' },
      
      // Show business questions only if business is selected
      { questionId: 6, dependsOn: 1, operator: 'equals', value: 'business' },
      { questionId: 7, dependsOn: 1, operator: 'equals', value: 'business' },
      
      // Show health questions only if health is selected
      { questionId: 8, dependsOn: 1, operator: 'equals', value: 'health' },
      { questionId: 9, dependsOn: 1, operator: 'equals', value: 'health' }
    ],

    resultLogic: {
      type: "scoring"
    },

    results: {
      "tech": {
        title: "Tech Professional! 💻",
        description: "You're focused on technology and programming. Here are some recommendations tailored to your tech interests.",
        color: "from-blue-500 to-cyan-600",
        recommendations: [
          "Join developer communities and forums",
          "Contribute to open source projects",
          "Attend tech conferences and meetups",
          "Build side projects to showcase your skills"
        ],
        cta: "Explore Tech Resources"
      },
      "design": {
        title: "Creative Designer! 🎨",
        description: "You have a passion for design and creativity. Here are some ways to grow in your design career.",
        color: "from-pink-500 to-purple-600",
        recommendations: [
          "Build a strong portfolio",
          "Learn new design tools and techniques",
          "Join design communities",
          "Take on freelance projects"
        ],
        cta: "Discover Design Tools"
      },
      "business": {
        title: "Business Leader! 📈",
        description: "You're focused on business growth and strategy. Here are some resources to accelerate your business success.",
        color: "from-green-500 to-emerald-600",
        recommendations: [
          "Network with other entrepreneurs",
          "Read business books and case studies",
          "Attend business conferences",
          "Find a business mentor"
        ],
        cta: "Grow Your Business"
      },
      "health": {
        title: "Health Enthusiast! 💪",
        description: "You're committed to health and fitness. Here are some ways to optimize your wellness journey.",
        color: "from-orange-500 to-red-600",
        recommendations: [
          "Find a workout buddy or group",
          "Track your progress with apps",
          "Try new fitness activities",
          "Focus on nutrition and recovery"
        ],
        cta: "Start Your Fitness Journey"
      }
    },

    leadCapture: {
      enabled: true,
      title: "Get Your Personalized Recommendations! 🎯",
      subtitle: "Receive tailored resources and insights based on your interests",
      fields: [
        {
          key: "name",
          label: "Full Name",
          type: "text",
          required: true,
          icon: User,
          placeholder: "Enter your full name"
        },
        {
          key: "email",
          label: "Email Address",
          type: "email",
          required: true,
          icon: Mail,
          placeholder: "your.email@example.com"
        }
      ],
      privacyText: "🔒 Your data is secure. We don't send spam.",
      submitText: "Get My Recommendations"
    },

    thankYouMessage: "Check your email for personalized recommendations based on your interests!",

    onSubmit: (leadData, answers, result) => {
      console.log('Conditional Logic Demo Results:', { 
        leadData, 
        answers, 
        result,
        conditionalQuestions: answers
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-900">ReactQuiz Engine</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#demos" className="hover:text-gray-900">Live Demos</a>
            <a href="#install" className="hover:text-gray-900">Install</a>
            <a href="#usage" className="hover:text-gray-900">Usage</a>
            <a href="https://github.com/gawryco/reactquiz-engine" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-gray-900">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </nav>
          <a href="#install" className="ml-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90">
            <Rocket className="w-4 h-4" /> Get Started
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          {/* POC Warning Banner */}
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-800">⚠️ Proof of Concept Warning</h3>
                <p className="mt-1 text-sm text-amber-700">
                  This is a POC library and is <strong>not production-ready</strong>. It has not been thoroughly tested and may contain bugs or breaking changes. Use at your own risk.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 mb-4">
                <Zap className="w-3.5 h-3.5" /> TypeScript • Tailwind • i18n • A11y
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Build interactive quizzes in minutes
              </h1>
              <p className="mt-4 text-gray-600 md:text-lg">
                ReactQuiz Engine is a flexible React library for surveys, assessments, and lead-gen. Multiple question types, conditional logic, timers, and beautiful animations.
              </p>
              
              {/* Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <a href="https://github.com/gawryco/reactquiz-engine/actions/workflows/ci.yml" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
                  <ShieldCheck className="w-3 h-3" />
                  CI Passing
                </a>
                <a href="https://www.npmjs.com/package/@gawryco/reactquiz-engine" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
                  <Layers className="w-3 h-3" />
                  npm Ready
                </a>
                <a href="https://bundlephobia.com/package/@gawryco/reactquiz-engine" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100">
                  <Zap className="w-3 h-3" />
                  Lightweight
                </a>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                  <Languages className="w-3 h-3" />
                  i18n Ready
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <BookOpen className="w-3 h-3" />
                  TypeScript
                </span>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <a href="#install" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow hover:opacity-90">
                  <Rocket className="w-5 h-5" /> Get Started
                </a>
                <a href="#demos" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                  <PlayIcon /> See Demos
                </a>
                <a href="https://github.com/gawryco/reactquiz-engine" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Github className="w-5 h-5" /> GitHub
                </a>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> MIT License</div>
                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600" /> 9+ Types</div>
                <div className="flex items-center gap-2"><Languages className="w-4 h-4 text-pink-600" /> i18n-ready</div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 shadow-sm p-4 bg-white">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="ml-auto inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> ReactQuiz Engine</span>
                </div>
                <pre className="mt-3 text-xs md:text-sm bg-gray-50 rounded-lg p-3 overflow-x-auto"><code>{`import { Quiz } from '@gawryco/reactquiz-engine';
<Quiz quizConfig={config} quizId="my-quiz" />`}</code></pre>
                <div className="mt-3 text-xs text-gray-600">Try the live demos below ↓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-2 text-gray-600">Quality interactions, flexible APIs, delightful UX.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">9 Question Types</h3>
              <p className="text-gray-600 text-sm">Single, multiple, scale, slider, text, image, date, matrix, ranking.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ChevronRight className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600 text-sm">Touch gestures, responsive design, and mobile-first approach.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Timers & Progress</h3>
              <p className="text-gray-600 text-sm">Quiz-level and per-question timers, progress, auto-advance.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Scoring</h3>
              <p className="text-gray-600 text-sm">Scoring, weighted, conditional, and custom calculation.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Shareable Results</h3>
              <p className="text-gray-600 text-sm">Generate beautiful result images with html-to-image (lazy loaded) for social sharing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demos */}
      <section id="demos" className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Live Demos</h2>
            <p className="mt-2 text-gray-600">Switch between demo configurations and explore the features.</p>
          </div>
          {/* Demo Selector */}
          <div className="mb-8">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button
              onClick={() => setCurrentDemo('simple')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentDemo === 'simple'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300'
              }`}
            >
              Simple Quiz (Love Language)
            </button>
            <button
              onClick={() => setCurrentDemo('advanced')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentDemo === 'advanced'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
              }`}
            >
              Advanced Quiz (Calculator Finder)
            </button>
                   <button
                     onClick={() => setCurrentDemo('timer')}
                     className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                       currentDemo === 'timer'
                         ? 'bg-orange-500 text-white shadow-lg'
                         : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
                     }`}
                   >
                     Timer Quiz (Time Pressure)
                   </button>
                   <button
                     onClick={() => setCurrentDemo('animations')}
                     className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                       currentDemo === 'animations'
                         ? 'bg-indigo-500 text-white shadow-lg'
                         : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300'
                     }`}
                   >
                     Animation Showcase 🎬
                   </button>
                   <button
                     onClick={() => setCurrentDemo('conditional')}
                     className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                       currentDemo === 'conditional'
                         ? 'bg-emerald-500 text-white shadow-lg'
                         : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-300'
                     }`}
                   >
                     Conditional Logic 🧠
                   </button>
              </div>
              
              <div className="flex items-center space-x-6 flex-wrap justify-center gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Navigation Mode:</span>
                  <button
                    onClick={() => setAutoAdvance(!autoAdvance)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      autoAdvance
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {autoAdvance ? 'Auto-Advance' : 'Manual (Next Button)'}
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Language:</span>
                  <select
                    value={currentLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="text-center">
                     <h3 className="text-xl font-bold text-gray-800 mb-2">
                       {currentDemo === 'simple' ? 'Simple Quiz Example' : 
                        currentDemo === 'advanced' ? 'Advanced Quiz Example' : 
                        currentDemo === 'timer' ? 'Timer Quiz Example' : 
                        currentDemo === 'animations' ? 'Animation Showcase' : 'Conditional Logic Demo'}
                     </h3>
                     <p className="text-gray-600">
                       {currentDemo === 'simple'
                         ? `A basic love language assessment with fade & slide-up transitions, bounce effects (${autoAdvance ? 'auto-advance' : 'manual navigation'})`
                         : currentDemo === 'advanced'
                         ? `A complex calculator finder with scale & slide-up transitions, glow effects (${autoAdvance ? 'auto-advance' : 'manual navigation'})`
                         : currentDemo === 'timer'
                         ? `A timed quiz with slide-left transitions, demonstrating time pressure and smooth animations`
                         : currentDemo === 'animations'
                         ? `An interactive showcase of all animation types: slide, fade, scale, bounce, and slide-up transitions with customizable timing`
                         : `A smart quiz that shows different questions based on your answers - demonstrating conditional logic and dynamic question flow (${autoAdvance ? 'auto-advance' : 'manual navigation'})`
                       }
                     </p>
            </div>
          </div>

          {/* Quiz Component */}
          <div className="mt-6">
            <Quiz 
              quizConfig={
                currentDemo === 'simple' ? simpleConfig : 
                currentDemo === 'advanced' ? advancedConfig : 
                currentDemo === 'timer' ? timerConfig : 
                currentDemo === 'animations' ? animationConfig :
                conditionalConfig
              }
              quizId={`demo-${currentDemo}`}
            />
          </div>
        </div>
      </section>

      {/* Install */}
      <section id="install" className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Install</h2>
            <p className="mt-2 text-gray-600">Choose your package manager and copy the command.</p>
          </div>
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => setPkgMgr('npm')} className={`px-3 py-1.5 rounded-md ${pkgMgr === 'npm' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>npm</button>
                <button onClick={() => setPkgMgr('yarn')} className={`px-3 py-1.5 rounded-md ${pkgMgr === 'yarn' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>yarn</button>
                <button onClick={() => setPkgMgr('pnpm')} className={`px-3 py-1.5 rounded-md ${pkgMgr === 'pnpm' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>pnpm</button>
              </div>
              <button onClick={copyInstallCommand} className="text-sm px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="px-4 py-4">
              <pre className="text-sm bg-gray-50 rounded-lg p-3 overflow-x-auto"><code>{installCommand}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section id="usage" className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Quick Usage</h2>
            <p className="mt-2 text-gray-600">Minimal setup to render your first quiz.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Start</h3>
              <pre className="text-xs md:text-sm bg-gray-50 rounded-lg p-3 overflow-x-auto"><code>{`import { Quiz } from '@gawryco/reactquiz-engine';
import { Heart } from 'lucide-react';

const config = {
  title: "What's Your Love Language?",
  subtitle: "Discover how you express and receive love",
  branding: { colors: { primary: 'from-pink-500 to-rose-600' }, icon: Heart },
  behavior: { autoAdvance: true, showProgress: true, allowBack: true },
  questions: [{ id: 1, type: 'single-choice', question: 'How do you prefer to show affection?', required: true, options: [
    { value: 'words', label: "Saying 'I love you'" }, { value: 'touch', label: 'Physical affection' }
  ]}],
  resultLogic: { type: 'scoring' },
  results: { words: { title: 'Words of Affirmation', color: 'from-blue-400 to-indigo-600' } },
  leadCapture: { enabled: false }
};

export default function App(){
  return <Quiz quizConfig={config} quizId="love-language-quiz" />
}`}</code></pre>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-2">i18n</h3>
              <pre className="text-xs md:text-sm bg-gray-50 rounded-lg p-3 overflow-x-auto"><code>{`import i18n from '@gawryco/reactquiz-engine/i18n';
i18n.changeLanguage('fr');`}</code></pre>
              <p className="mt-2 text-sm text-gray-600">Use the language switcher in the demos to see translations in action.</p>
              <a href="https://github.com/gawryco/reactquiz-engine#readme" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-700 hover:underline mt-3"><BookOpen className="w-4 h-4" /> Read full docs</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Award className="w-4 h-4 text-indigo-600" /> ReactQuiz Engine • MIT Licensed
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#demos" className="text-gray-600 hover:text-gray-900">Demos</a>
            <a href="#install" className="text-gray-600 hover:text-gray-900">Install</a>
            <a href="https://github.com/gawryco/reactquiz-engine" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"><Github className="w-4 h-4" /> GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Demo;

// Inline icon to keep dependencies minimal for a simple play symbol
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M8 5v14l11-7z"></path>
    </svg>
  );
}
