import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import {
  User,
  Settings,
  Bell,
  Palette,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Camera,
  Moon,
  Sun,
  Monitor
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

const menuItems = [
  { icon: Bell, label: 'Notifications', description: 'Manage your alerts' },
  { icon: Palette, label: 'Style Preferences', description: 'Update your fashion taste' },
  { icon: Shield, label: 'Privacy', description: 'Control your data' },
  { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
];

export const ProfilePage = () => {
  const { user, wardrobe, savedOutfits, logout, theme, setTheme } = useStore();

  const skinToneColors: Record<string, string> = {
    fair: '#FFE4C4',
    light: '#F5DEB3',
    medium: '#DEB887',
    olive: '#C4A35A',
    tan: '#A67B5B',
    dark: '#8B5A2B',
  };

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
          <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-muted-foreground">
          Your style identity
        </p>
      </div>

      {/* Profile Card */}
      <motion.div variants={item} className="px-6 mb-6">
        <div className="gradient-border p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.name || 'Style Stack User'}</h2>
              <p className="text-muted-foreground text-sm">Fashion Explorer ✨</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{wardrobe.length}</p>
              <p className="text-xs text-muted-foreground">Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{savedOutfits.length}</p>
              <p className="text-xs text-muted-foreground">Outfits</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Theme Switching */}
      <motion.div variants={item} className="px-6 mb-6">
        <h3 className="font-semibold mb-4">Appearance</h3>
        <div className="glass-card p-2 rounded-2xl flex">
          {[
            { name: 'light', icon: Sun, label: 'Light' },
            { name: 'dark', icon: Moon, label: 'Dark' },
            { name: 'system', icon: Monitor, label: 'System' }
          ].map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name as any)}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${theme === t.name
                ? 'bg-secondary text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/50'}`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Style Profile */}
      <motion.div variants={item} className="px-6 mb-6">
        <h3 className="font-semibold mb-4">Your Style DNA</h3>
        <div className="glass-card p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Body Type</span>
            <span className="font-medium capitalize">{user?.bodyType || 'Not set'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Skin Tone</span>
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: skinToneColors[user?.skinTone || 'medium'] }}
              />
              <span className="font-medium capitalize">{user?.skinTone || 'Not set'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Style Vibes</span>
            <div className="flex gap-1">
              {user?.stylePreference?.slice(0, 3).map((style) => (
                <span key={style} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full capitalize">
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div variants={item} className="px-6 mb-6">
        <h3 className="font-semibold mb-4">Settings</h3>
        <div className="glass-card rounded-2xl overflow-hidden">
          {menuItems.map((menuItem, index) => (
            <button
              key={menuItem.label}
              className={`w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors ${index < menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <menuItem.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{menuItem.label}</p>
                <p className="text-sm text-muted-foreground">{menuItem.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={item} className="px-6">
        <Button
          variant="outline"
          size="lg"
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </motion.div>
    </motion.div>
  );
};
