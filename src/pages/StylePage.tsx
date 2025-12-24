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
  CloudRain,
  Snowflake,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Info
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
    const explanations = [
      `This combo hits different for ${occasion}! The colors complement each other perfectly.`,
      `Going for that ${mood} vibe? This outfit's got you covered.`,
      `These pieces create a cohesive look that's perfect for any ${occasion} situation.`,
      `Love how these colors work together! Great choice for a ${mood} aesthetic.`,
    ];
    explanation = explanations[Math.floor(Math.random() * explanations.length)];
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
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-1">
          <span className="gradient-text">Style Lab</span>
        </h1>
        <p className="text-muted-foreground">
          Your AI styling assistant
        </p>
      </div>

      {/* Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 mb-6"
      >
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Sun className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Today's weather</p>
            <p className="font-semibold">24°C, Sunny</p>
          </div>
          <span className="text-sm text-muted-foreground">Perfect for light layers</span>
        </div>
      </motion.div>

      {/* Occasion Selector */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">What's the occasion?</h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
          {occasions.map((occasion) => (
            <button
              key={occasion.value}
              onClick={() => setSelectedOccasion(occasion.value)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${selectedOccasion === occasion.value
                ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
            >
              <span>{occasion.emoji}</span>
              {occasion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selector */}
      <div className="px-6 mb-8">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">What's your vibe?</h3>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${selectedMood === mood.value
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary'
                }`}
            >
              <span className="text-xl block mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {!showOutfit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 mb-8"
        >
          <div className="mb-4">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              Custom Input (Optional)
            </Label>
            <Input
              placeholder="E.g., I want a blue outfit..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="bg-secondary/50 border-input focus:border-primary"
            />
          </div>

          <Button
            variant="gradient"
            size="xl"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating || wardrobe.length < 2}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Creating magic...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Outfit
              </>
            )}
          </Button>
          {wardrobe.length < 2 && (
            <p className="text-sm text-muted-foreground text-center mt-3">
              Add at least 2 items to your wardrobe to get recommendations
            </p>
          )}
        </motion.div>
      )}

      {/* Outfit Result */}
      <AnimatePresence>
        {showOutfit && currentOutfit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="px-6"
          >
            {/* Match Score */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-bold gradient-text">{currentOutfit.matchScore}% Match</span>
              </motion.div>
            </div>

            {/* Outfit Items Grid */}
            <div className="glass-card rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {currentOutfit.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="aspect-square rounded-xl overflow-hidden bg-secondary relative"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80 to-transparent">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Explanation */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {currentOutfit.explanation}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDislike}
                className="w-16 h-16 rounded-full bg-secondary border-2 border-border flex items-center justify-center"
              >
                <ThumbsDown className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleGenerate}
                className="w-16 h-16 rounded-full bg-secondary border-2 border-border flex items-center justify-center"
              >
                <RefreshCw className="w-6 h-6 text-muted-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-glow"
              >
                <Heart className="w-6 h-6 text-primary-foreground" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Outfits Preview */}
      {savedOutfits.length > 0 && !showOutfit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Saved Outfits</h3>
            <button className="text-primary text-sm font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
            {savedOutfits.slice(0, 5).map((outfit) => (
              <div key={outfit.id} className="flex-shrink-0 w-24">
                <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-2 grid grid-cols-2 gap-0.5 p-0.5">
                  {outfit.items.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center capitalize">{outfit.occasion}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
