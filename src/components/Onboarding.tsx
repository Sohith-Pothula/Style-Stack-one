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
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Progress */}
      <div className="px-6 pt-12 pb-4 z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  width: index === onboarding.step ? 24 : 8,
                  backgroundColor: index <= onboarding.step ? 'hsl(270 100% 60%)' : 'hsl(260 20% 20%)'
                }}
                className="h-2 rounded-full transition-all duration-300"
              />
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Step {onboarding.step + 1}/{steps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 relative z-10 flex flex-col">
        <AnimatePresence mode="wait" custom={1}>
          {onboarding.step === 0 && (
            <motion.div
              key="welcome"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-1 flex flex-col justify-center items-center text-center pb-20"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-10 shadow-glow relative group"
              >
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <Sparkles className="w-20 h-20 text-white relative z-10" />
              </motion.div>

              <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
                Style <span className="gradient-text">Stack</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Your personal AI stylist. <br />
                Elevate your look, everyday.
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
              className="py-4"
            >
              <h2 className="text-3xl font-bold mb-3">About You</h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Let's customize your profile.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="What should we call you?"
                    className="w-full h-16 px-6 rounded-2xl bg-secondary/50 border border-border focus:border-primary focus:bg-secondary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-4 block uppercase tracking-wider">
                    Body Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {bodyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setOnboardingBodyType(type.value)}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group ${onboarding.bodyType === type.value
                            ? 'border-primary bg-primary/10 shadow-glow ring-1 ring-primary'
                            : 'border-border bg-secondary/30 hover:bg-secondary hover:border-primary/30'
                          }`}
                      >
                        <span className="text-3xl bg-background rounded-xl p-2 shadow-sm">{type.emoji}</span>
                        <span className={`font-semibold ${onboarding.bodyType === type.value ? 'text-primary' : 'text-foreground'}`}>
                          {type.label}
                        </span>
                        {onboarding.bodyType === type.value && (
                          <motion.div layoutId="check" className="absolute right-4 text-primary">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </motion.div>
                        )}
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
              className="py-4"
            >
              <h2 className="text-3xl font-bold mb-3">Skin Tone</h2>
              <p className="text-muted-foreground mb-10 text-lg">
                For better color recommendations.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {skinTones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => setOnboardingSkinTone(tone.value)}
                    className={`relative overflow-hidden p-1 rounded-2xl border-2 transition-all duration-300 card-hover ${onboarding.skinTone === tone.value
                        ? 'border-primary ring-2 ring-primary/20 shadow-glow'
                        : 'border-transparent bg-secondary/30 hover:border-border'
                      }`}
                  >
                    <div className="relative z-10 bg-card rounded-xl p-4 flex items-center gap-4 h-full">
                      <div
                        className="w-12 h-12 rounded-full shadow-inner ring-2 ring-white/10"
                        style={{ backgroundColor: tone.color }}
                      />
                      <span className="font-semibold">{tone.label}</span>
                    </div>
                    {/* Gradient background for selected state */}
                    {onboarding.skinTone === tone.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 z-0" />
                    )}
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
              className="py-4"
            >
              <h2 className="text-3xl font-bold mb-3">Your Vibe</h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Select styles you relate to.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {stylePreferences.map((style) => {
                  const isSelected = onboarding.stylePreferences.includes(style.value);
                  return (
                    <button
                      key={style.value}
                      onClick={() => toggleStylePreference(style.value)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${isSelected
                          ? 'border-primary bg-primary/10 shadow-glow'
                          : 'border-border bg-secondary/30 hover:bg-secondary hover:border-primary/30'
                        }`}
                    >
                      <div className="flex flex-col gap-2 relative z-10">
                        <span className="text-3xl">{style.emoji}</span>
                        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {style.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-0 right-0 p-3">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8 z-10 bg-background/80 backdrop-blur-lg border-t border-border/50">
        <div className="flex gap-4">
          {onboarding.step > 0 && (
            <Button
              variant="outline"
              size="xl"
              onClick={handleBack}
              className="flex-1 rounded-2xl border-2 hover:bg-secondary"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}
          <Button
            variant="gradient"
            size="xl"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-[2] rounded-2xl shadow-glow font-semibold text-lg"
          >
            {onboarding.step === 3 ? "Start Styling" : 'Continue'}
            {onboarding.step < 3 && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
