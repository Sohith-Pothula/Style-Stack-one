import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { StylePreference } from '@/types';
import { 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  User,
  Palette,
  Shirt
} from 'lucide-react';

const bodyTypes = [
  { value: 'slim', label: 'Slim', emoji: '🧍' },
  { value: 'athletic', label: 'Athletic', emoji: '💪' },
  { value: 'average', label: 'Average', emoji: '👤' },
  { value: 'muscular', label: 'Muscular', emoji: '🏋️' },
  { value: 'curvy', label: 'Curvy', emoji: '✨' },
] as const;

const skinTones = [
  { value: 'fair', label: 'Fair', color: '#FFE4C4' },
  { value: 'light', label: 'Light', color: '#F5DEB3' },
  { value: 'medium', label: 'Medium', color: '#DEB887' },
  { value: 'olive', label: 'Olive', color: '#C4A35A' },
  { value: 'tan', label: 'Tan', color: '#A67B5B' },
  { value: 'dark', label: 'Dark', color: '#8B5A2B' },
] as const;

const stylePreferences: { value: StylePreference; label: string; emoji: string }[] = [
  { value: 'streetwear', label: 'Streetwear', emoji: '🛹' },
  { value: 'minimal', label: 'Minimal', emoji: '⚪' },
  { value: 'oversized', label: 'Oversized', emoji: '👕' },
  { value: 'formal', label: 'Formal', emoji: '👔' },
  { value: 'sporty', label: 'Sporty', emoji: '🏃' },
  { value: 'vintage', label: 'Vintage', emoji: '📷' },
  { value: 'bohemian', label: 'Bohemian', emoji: '🌻' },
  { value: 'preppy', label: 'Preppy', emoji: '🎓' },
];

const steps = [
  { title: 'Welcome', icon: Sparkles },
  { title: 'About You', icon: User },
  { title: 'Skin Tone', icon: Palette },
  { title: 'Your Style', icon: Shirt },
];

export const Onboarding = () => {
  const { 
    onboarding, 
    setOnboardingStep, 
    setOnboardingName,
    setOnboardingBodyType,
    setOnboardingSkinTone,
    toggleStylePreference,
    completeOnboarding 
  } = useStore();
  
  const [localName, setLocalName] = useState(onboarding.name);

  const canProceed = () => {
    switch (onboarding.step) {
      case 0: return true;
      case 1: return localName.trim().length > 0 && onboarding.bodyType !== null;
      case 2: return onboarding.skinTone !== null;
      case 3: return onboarding.stylePreferences.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (onboarding.step === 1) {
      setOnboardingName(localName.trim());
    }
    if (onboarding.step === 3) {
      completeOnboarding();
    } else {
      setOnboardingStep(onboarding.step + 1);
    }
  };

  const handleBack = () => {
    setOnboardingStep(onboarding.step - 1);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress indicator */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                index <= onboarding.step 
                  ? 'bg-gradient-to-r from-primary to-accent' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={1}>
          {onboarding.step === 0 && (
            <motion.div
              key="welcome"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full flex flex-col justify-center items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-glow"
              >
                <Sparkles className="w-16 h-16 text-primary-foreground" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Style Stack</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Your AI-powered fashion bestie ✨
              </p>
              <p className="text-muted-foreground max-w-xs">
                Discover killer outfit combos from your own wardrobe. No judgment, just vibes.
              </p>
            </motion.div>
          )}

          {onboarding.step === 1 && (
            <motion.div
              key="about"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="py-8"
            >
              <h2 className="text-2xl font-bold mb-2">Let's get to know you 👋</h2>
              <p className="text-muted-foreground mb-8">
                This helps us give you personalized style advice
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-14 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">
                    Body type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {bodyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setOnboardingBodyType(type.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          onboarding.bodyType === type.value
                            ? 'border-primary bg-primary/10 shadow-glow'
                            : 'border-border bg-secondary hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{type.emoji}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {onboarding.step === 2 && (
            <motion.div
              key="skin"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="py-8"
            >
              <h2 className="text-2xl font-bold mb-2">Your skin tone 🎨</h2>
              <p className="text-muted-foreground mb-8">
                This helps us suggest colors that make you glow
              </p>

              <div className="grid grid-cols-3 gap-4">
                {skinTones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setOnboardingSkinTone(tone.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      onboarding.skinTone === tone.value
                        ? 'border-primary shadow-glow'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-border/50"
                      style={{ backgroundColor: tone.color }}
                    />
                    <span className="text-sm font-medium">{tone.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {onboarding.step === 3 && (
            <motion.div
              key="style"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={1}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="py-8"
            >
              <h2 className="text-2xl font-bold mb-2">Your vibe ✨</h2>
              <p className="text-muted-foreground mb-8">
                Pick all that feel like you (at least one)
              </p>

              <div className="grid grid-cols-2 gap-3">
                {stylePreferences.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => toggleStylePreference(style.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      onboarding.stylePreferences.includes(style.value)
                        ? 'border-primary bg-primary/10 shadow-glow'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{style.emoji}</span>
                    <span className="font-medium">{style.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 py-8 flex gap-3">
        {onboarding.step > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
        )}
        <Button
          variant="gradient"
          size="lg"
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1"
        >
          {onboarding.step === 3 ? "Let's go!" : 'Continue'}
          {onboarding.step < 3 && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};
