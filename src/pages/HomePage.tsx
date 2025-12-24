import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Plus, 
  TrendingUp, 
  CloudSun,
  Shirt,
  ChevronRight,
  Zap
} from 'lucide-react';

const quickActions = [
  { icon: Sparkles, label: 'Outfit of the Day', color: 'from-primary to-accent', path: '/style' },
  { icon: CloudSun, label: 'Weather Style', color: 'from-blue-500 to-cyan-400', path: '/style' },
  { icon: TrendingUp, label: 'Trending Looks', color: 'from-orange-500 to-pink-500', path: '/style' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const HomePage = () => {
  const { user, wardrobe } = useStore();
  const navigate = useNavigate();
  
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentItems = wardrobe.slice(-4).reverse();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen pb-24"
    >
      {/* Header */}
      <motion.div variants={item} className="px-6 pt-12 pb-6">
        <p className="text-muted-foreground text-sm">{greeting()}</p>
        <h1 className="text-3xl font-bold">
          Hey, <span className="gradient-text">{user?.name || 'Fashionista'}</span> ✨
        </h1>
      </motion.div>

      {/* OOTD Card */}
      <motion.div variants={item} className="px-6 mb-6">
        <div className="gradient-border p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Ready to slay today?</h2>
              <p className="text-muted-foreground text-sm">
                Get your perfect outfit in seconds
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <Button 
            variant="gradient" 
            className="w-full"
            onClick={() => navigate('/style')}
          >
            <Sparkles className="w-5 h-5" />
            Get Today's Outfit
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="px-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-6 px-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary border border-border hover:border-primary/50 transition-all duration-300 min-w-[100px]"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Wardrobe Preview */}
      <motion.div variants={item} className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Wardrobe</h3>
          <button 
            onClick={() => navigate('/wardrobe')}
            className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {wardrobe.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Shirt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold mb-2">Your wardrobe is empty</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Add your first items to get personalized outfit recommendations
            </p>
            <Button onClick={() => navigate('/wardrobe')}>
              <Plus className="w-5 h-5" />
              Add Items
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {recentItems.map((clothing) => (
              <div
                key={clothing.id}
                className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border"
              >
                <img
                  src={clothing.imageUrl}
                  alt={clothing.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {wardrobe.length < 4 && (
              <button
                onClick={() => navigate('/wardrobe')}
                className="aspect-square rounded-xl bg-secondary border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center transition-all duration-300"
              >
                <Plus className="w-6 h-6 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Stats Preview */}
      <motion.div variants={item} className="px-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 rounded-xl text-center">
            <p className="text-2xl font-bold gradient-text">{wardrobe.length}</p>
            <p className="text-xs text-muted-foreground">Items</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <p className="text-2xl font-bold gradient-text">0</p>
            <p className="text-xs text-muted-foreground">Outfits</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <p className="text-2xl font-bold gradient-text">0</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
