import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { 
  TrendingUp, 
  Shirt, 
  Palette, 
  Calendar,
  Award,
  ArrowRight,
  Star
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const InsightsPage = () => {
  const { wardrobe, savedOutfits, user } = useStore();

  // Calculate stats
  const colorCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  
  wardrobe.forEach((clothing) => {
    colorCounts[clothing.colorName] = (colorCounts[clothing.colorName] || 0) + 1;
    typeCounts[clothing.type] = (typeCounts[clothing.type] || 0) + 1;
  });

  const topColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const totalWearCount = wardrobe.reduce((sum, item) => sum + item.wearCount, 0);
  const avgWears = wardrobe.length > 0 ? Math.round(totalWearCount / wardrobe.length) : 0;

  const insights = [
    {
      type: 'tip',
      message: wardrobe.length < 5 
        ? "Add more items to unlock personalized style insights!"
        : `You've got ${wardrobe.length} items — that's a solid foundation for mixing and matching!`,
    },
    {
      type: 'suggestion',
      message: topColors.length > 0 
        ? `You love ${topColors[0]?.[0] || 'neutral'} tones! Try adding some complementary colors for variety.`
        : "Start building your wardrobe to see your color preferences!",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen pb-24"
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-1">
          <span className="gradient-text">Insights</span>
        </h1>
        <p className="text-muted-foreground">
          Your style analytics
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div variants={item} className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shirt className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Total Items</span>
            </div>
            <p className="text-3xl font-bold">{wardrobe.length}</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Saved Outfits</span>
            </div>
            <p className="text-3xl font-bold">{savedOutfits.length}</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Colors</span>
            </div>
            <p className="text-3xl font-bold">{Object.keys(colorCounts).length}</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Avg. Wears</span>
            </div>
            <p className="text-3xl font-bold">{avgWears}</p>
          </div>
        </div>
      </motion.div>

      {/* Color Distribution */}
      {topColors.length > 0 && (
        <motion.div variants={item} className="px-6 mb-6">
          <h3 className="font-semibold mb-4">Your Color Palette</h3>
          <div className="glass-card p-4 rounded-2xl">
            <div className="space-y-3">
              {topColors.map(([color, count], index) => {
                const colorItem = wardrobe.find(item => item.colorName === color);
                return (
                  <div key={color} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-border"
                      style={{ backgroundColor: colorItem?.color || '#888' }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{color}</span>
                        <span className="text-sm text-muted-foreground">{count} items</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / wardrobe.length) * 100}%` }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Breakdown */}
      {topTypes.length > 0 && (
        <motion.div variants={item} className="px-6 mb-6">
          <h3 className="font-semibold mb-4">Wardrobe Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {topTypes.map(([type, count]) => (
              <div key={type} className="glass-card p-4 rounded-xl text-center">
                <p className="text-2xl font-bold gradient-text">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{type}s</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Insights */}
      <motion.div variants={item} className="px-6 mb-6">
        <h3 className="font-semibold mb-4">Style Insights</h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="glass-card p-4 rounded-xl flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges Preview */}
      <motion.div variants={item} className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Achievements</h3>
          <button className="text-primary text-sm font-medium flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex-shrink-0 w-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-2 border-2 border-primary/30">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">First Outfit</p>
          </div>
          <div className="flex-shrink-0 w-20 text-center opacity-50">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2 border-2 border-border">
              <Palette className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Color Explorer</p>
          </div>
          <div className="flex-shrink-0 w-20 text-center opacity-50">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2 border-2 border-border">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">7 Day Streak</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
