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
  Zap,
  Calendar
} from 'lucide-react';

const quickActions = [
  { icon: CloudSun, label: 'Weather Fit', color: 'from-blue-500 to-cyan-400', path: '/style' },
  { icon: TrendingUp, label: 'Trends', color: 'from-orange-500 to-pink-500', path: '/style' },
  { icon: Calendar, label: 'Planner', color: 'from-purple-500 to-indigo-500', path: '/style' },
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
      className="min-h-screen pb-28 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Header */}
      <motion.div variants={item} className="px-6 pt-12 pb-6 relative z-10 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium tracking-wide">{greeting()}</p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hey, <span className="gradient-text">{user?.name || 'Create Profile'}</span> ✨
          </h1>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary">
          {/* Placeholder Avatar */}
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-lg">😎</span>
          </div>
        </div>
      </motion.div>

      {/* Hero / OOTD Card */}
      <motion.div variants={item} className="px-6 mb-8 relative z-10">
        <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-primary via-accent to-purple-600 shadow-glow">
          <div className="bg-card/90 backdrop-blur-xl rounded-[23px] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Daily Pick</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">Ready to slay?</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Get your perfect outfit tailored for today.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => navigate('/style')}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                Generate Today's Look
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={item} className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/30 hover:bg-secondary transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Wardrobe Preview */}
      <motion.div variants={item} className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold">Wardrobe</h3>
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {wardrobe.length} items
            </span>
          </div>
          <button
            onClick={() => navigate('/wardrobe')}
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {wardrobe.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl border-dashed border-2 border-border/50">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 animate-float">
              <Shirt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold mb-2">Closet is empty</h4>
            <p className="text-muted-foreground text-sm mb-6 max-w-[200px] mx-auto">
              Add photos of your clothes to start mixing matches.
            </p>
            <Button onClick={() => navigate('/wardrobe')} variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10">
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {recentItems.map((clothing) => (
              <div
                key={clothing.id}
                className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border/50 relative group"
              >
                <img
                  src={clothing.imageUrl}
                  alt={clothing.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            {/* Add Button as the last item if standard overflow layout, but here we just show recent 4. 
                If < 4 items, let's show an 'Add' slot. 
            */}
            {wardrobe.length < 4 && (
              <button
                onClick={() => navigate('/wardrobe')}
                className="aspect-square rounded-2xl bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">Add</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
