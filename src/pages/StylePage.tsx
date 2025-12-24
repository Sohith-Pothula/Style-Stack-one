import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/useStore';
import { Occasion, ClothingItem, Outfit } from '@/types';
import { generateId } from '@/lib/utils';
import {
  Sparkles,
  RefreshCw,
  Heart,
  X,
  Sun,
  Cloud,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Info,
  Thermometer,
  Wind
} from 'lucide-react';

const occasions: { value: Occasion; label: string; emoji: string }[] = [
  { value: 'casual', label: 'Casual', emoji: '😎' },
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'party', label: 'Party', emoji: '🎉' },
  { value: 'date', label: 'Date', emoji: '❤️' },
  { value: 'gym', label: 'Gym', emoji: '💪' },
  { value: 'formal', label: 'Formal', emoji: '🎩' },
];

const moods = [
  { value: 'bold', label: 'Bold', emoji: '🔥' },
  { value: 'minimal', label: 'Minimal', emoji: '✨' },
  { value: 'classic', label: 'Classic', emoji: '👔' },
  { value: 'sporty', label: 'Sporty', emoji: '🏃' },
];

const matchExplanation = [
  "This combo hits different! The colors align perfectly.",
  "Going for that vibe? This outfit has you covered.",
  "These pieces create a cohesive look for the occasion.",
  "Love how these styles blend together. A solid choice.",
];

// Simple outfit matching algorithm
const generateOutfit = (wardrobe: ClothingItem[], occasion: Occasion, mood: string, customInput: string = ''): Outfit | null => {
  if (wardrobe.length < 2) return null;

  const tops = wardrobe.filter(item => item.type === 'top' || item.type === 'outerwear');
  const bottoms = wardrobe.filter(item => item.type === 'bottom');
  const shoes = wardrobe.filter(item => item.type === 'shoes');
  const accessories = wardrobe.filter(item => item.type === 'accessory');

  // Filter based on custom input
  let preferredItems: Set<string> = new Set();
  if (customInput.trim()) {
    const tokens = customInput.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    wardrobe.forEach(item => {
      if (tokens.some(t =>
        item.name.toLowerCase().includes(t) ||
        item.color.toLowerCase().includes(t) ||
        item.colorName.toLowerCase().includes(t) ||
        item.type.toLowerCase().includes(t)
      )) {
        preferredItems.add(item.id);
      }
    });
  }

  const selectedItems: ClothingItem[] = [];

  const pickItem = (items: ClothingItem[]) => {
    // Try to find one from preferredItems that also matches occasion
    const preferred = items.filter(i => preferredItems.has(i.id));
    const occasionItems = items.filter(i => i.occasions.includes(occasion));

    // Valid pool: preferred items that match occasion (Best), preferred items (Good), occasion items (Ok), any items (Fallback)
    const best = preferred.filter(i => i.occasions.includes(occasion));

    if (best.length > 0 && Math.random() > 0.1) return best[Math.floor(Math.random() * best.length)];
    if (preferred.length > 0 && Math.random() > 0.3) return preferred[Math.floor(Math.random() * preferred.length)];
    if (occasionItems.length > 0) return occasionItems[Math.floor(Math.random() * occasionItems.length)];
    return items[Math.floor(Math.random() * items.length)];
  };

  // Pick a top
  if (tops.length > 0) {
    selectedItems.push(pickItem(tops));
  }

  // Pick a bottom
  if (bottoms.length > 0) {
    selectedItems.push(pickItem(bottoms));
  }

  // Pick shoes
  if (shoes.length > 0) {
    selectedItems.push(pickItem(shoes));
  }

  // Maybe add accessory
  if (accessories.length > 0 && (Math.random() > 0.5 || accessories.some(a => preferredItems.has(a.id)))) {
    // If we have a preferred accessory, boost chance to pick it
    const preferredAcc = accessories.filter(a => preferredItems.has(a.id));
    selectedItems.push(preferredAcc.length > 0 ? preferredAcc[Math.floor(Math.random() * preferredAcc.length)] : accessories[Math.floor(Math.random() * accessories.length)]);
  }

  if (selectedItems.length < 2) return null;

  let explanation = '';
  if (customInput.trim() && selectedItems.some(i => preferredItems.has(i.id))) {
    explanation = `Curated this look based on your request: "${customInput}". It fits the ${occasion} vibe perfectly!`;
  } else {
    explanation = matchExplanation[Math.floor(Math.random() * matchExplanation.length)];
  }

  return {
    id: generateId(),
    userId: '',
    items: selectedItems,
    occasion,
    matchScore: Math.floor(Math.random() * 20) + 80,
    explanation,
    mood,
    createdAt: new Date(),
  };
};

export const StylePage = () => {
  const { wardrobe, addOutfit, savedOutfits } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('casual');
  const [selectedMood, setSelectedMood] = useState('minimal');
  const [customInput, setCustomInput] = useState('');
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutfit, setShowOutfit] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowOutfit(false);

    setTimeout(() => {
      const outfit = generateOutfit(wardrobe, selectedOccasion, selectedMood, customInput);
      setCurrentOutfit(outfit);
      setIsGenerating(false);
      setShowOutfit(true);
    }, 1500);
  };

  const handleLike = () => {
    if (currentOutfit) {
      addOutfit({ ...currentOutfit, liked: true, rating: 5 });
      // Generate new outfit
      handleGenerate();
    }
  };

  const handleDislike = () => {
    // Generate new outfit
    handleGenerate();
  };

  return (
    <div className="min-h-screen pb-28 relative">
      {/* Ambient Backlight */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Style <span className="gradient-text">Lab</span>
          </h1>
          <p className="text-muted-foreground font-medium">Create your look</p>
        </div>

        {/* Compact Weather Badge */}
        <div className="rounded-2xl bg-secondary/50 border border-border/50 p-2 flex items-center gap-3 backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Sun className="w-4 h-4 text-white" />
          </div>
          <div className="pr-1">
            <p className="text-xs font-bold leading-none">24°</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Sunny</p>
          </div>
        </div>
      </div>

      {/* Main Flow */}
      {!showOutfit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10"
        >
          {/* Step 1: Occasion */}
          <div className="px-6 mb-8 text-center sm:text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">1. Select Occasion</h3>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
              {occasions.map((occasion) => (
                <button
                  key={occasion.value}
                  onClick={() => setSelectedOccasion(occasion.value)}
                  className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-semibold transition-all flex flex-col items-center gap-1 min-w-[70px] border-2 ${selectedOccasion === occasion.value
                    ? 'border-primary bg-primary/10 text-primary shadow-glow'
                    : 'border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }`}
                >
                  <span className="text-2xl">{occasion.emoji}</span>
                  <span>{occasion.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Vibe */}
          <div className="px-6 mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">2. Choose Vibe</h3>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedMood === mood.value
                    ? 'border-accent bg-accent/10 shadow-glow'
                    : 'border-border bg-secondary/30 hover:bg-secondary'
                    }`}
                >
                  <span className="text-sm font-semibold">{mood.label}</span>
                  <span className="text-xl group-hover:scale-110 transition-transform">{mood.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Custom Input */}
          <div className="px-6 mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">3. Add Detail (Optional)</h3>
            <Input
              placeholder="E.g., I want to wear my blue jeans..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="h-14 rounded-2xl bg-secondary/50 border-input focus:border-primary px-4 text-base"
            />
          </div>

          {/* CTA */}
          <div className="px-6 pb-8">
            <Button
              variant="gradient"
              size="xl"
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
              onClick={handleGenerate}
              disabled={isGenerating || wardrobe.length < 2}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                  Cooking up a fit...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-2 animate-pulse" />
                  Generate Outfit
                </>
              )}
            </Button>

            {wardrobe.length < 2 && (
              <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
                <p className="text-sm text-destructive font-medium">
                  Your wardrobe is too empty! Add at least 2 items to start using the Style Lab.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Outfit Result */}
      <AnimatePresence>
        {showOutfit && currentOutfit && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="px-6 flex flex-col h-full"
          >
            {/* Match Score */}
            <div className="flex justify-center mb-6">
              <div className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-500/30 flex items-center gap-2 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400">{currentOutfit.matchScore}% Match</span>
              </div>
            </div>

            {/* Collage */}
            <div className="glass-card rounded-[32px] p-2 mb-6 shadow-elevated">
              <div className="grid grid-cols-2 gap-2">
                {/* Main Items Larger */}
                {currentOutfit.items.slice(0, 2).map((item, idx) => (
                  <div key={item.id} className="aspect-[4/5] rounded-[24px] overflow-hidden bg-secondary relative">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-semibold truncate w-full">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              {currentOutfit.items.length > 2 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {currentOutfit.items.slice(2).map((item) => (
                    <div key={item.id} className="aspect-square rounded-[24px] overflow-hidden bg-secondary relative">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Explanation Bubble */}
            <div className="mb-8 relative">
              <div className="absolute top-0 left-6 -translate-y-1/2 w-4 h-4 bg-secondary rotate-45 border-l border-t border-border z-0"></div>
              <div className="bg-secondary rounded-2xl p-4 border border-border relative z-10 shadow-sm">
                <p className="text-sm font-medium leading-relaxed">
                  "{currentOutfit.explanation}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-6 pb-8">
              <button
                onClick={handleDislike}
                className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-soft flex items-center justify-center text-muted-foreground hover:border-destructive hover:text-destructive transition-colors group"
              >
                <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={handleGenerate}
                className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:rotate-180 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent shadow-glow flex items-center justify-center text-white hover:scale-105 transition-transform"
              >
                <Heart className="w-8 h-8 fill-current" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
