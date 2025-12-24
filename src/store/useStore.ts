import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ClothingItem, Outfit, StylePreference } from '@/types';
import { generateId } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

interface OnboardingState {
  step: number;
  name: string;
  bodyType: User['bodyType'] | null;
  skinTone: User['skinTone'] | null;
  stylePreferences: StylePreference[];
}

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // User
  user: User | null;
  isOnboarded: boolean;
  onboarding: OnboardingState;

  // Wardrobe
  wardrobe: ClothingItem[];

  // Outfits
  savedOutfits: Outfit[];
  currentRecommendations: Outfit[];

  // Actions - Onboarding
  setOnboardingStep: (step: number) => void;
  setOnboardingName: (name: string) => void;
  setOnboardingBodyType: (type: User['bodyType']) => void;
  setOnboardingSkinTone: (tone: User['skinTone']) => void;
  toggleStylePreference: (style: StylePreference) => void;
  completeOnboarding: () => void;

  // Actions - Wardrobe
  addClothingItem: (item: ClothingItem) => void;
  updateClothingItem: (id: string, updates: Partial<ClothingItem>) => void;
  removeClothingItem: (id: string) => void;

  // Actions - Outfits
  addOutfit: (outfit: Outfit) => void;
  rateOutfit: (id: string, rating: number, liked: boolean) => void;
  setRecommendations: (outfits: Outfit[]) => void;

  // Actions - User
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const initialOnboarding: OnboardingState = {
  step: 0,
  name: '',
  bodyType: null,
  skinTone: null,
  stylePreferences: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      user: null,
      isOnboarded: false,
      onboarding: initialOnboarding,
      wardrobe: [],
      savedOutfits: [],
      currentRecommendations: [],

      // Theme Action
      setTheme: (theme) => set({ theme }),

      // Onboarding actions
      setOnboardingStep: (step) =>
        set((state) => ({ onboarding: { ...state.onboarding, step } })),

      setOnboardingName: (name) =>
        set((state) => ({ onboarding: { ...state.onboarding, name } })),

      setOnboardingBodyType: (bodyType) =>
        set((state) => ({ onboarding: { ...state.onboarding, bodyType } })),

      setOnboardingSkinTone: (skinTone) =>
        set((state) => ({ onboarding: { ...state.onboarding, skinTone } })),

      toggleStylePreference: (style) =>
        set((state) => {
          const prefs = state.onboarding.stylePreferences;
          const newPrefs = prefs.includes(style)
            ? prefs.filter((s) => s !== style)
            : [...prefs, style];
          return { onboarding: { ...state.onboarding, stylePreferences: newPrefs } };
        }),

      completeOnboarding: () => {
        const { onboarding } = get();
        const user: User = {
          id: generateId(),
          name: onboarding.name,
          email: '',
          bodyType: onboarding.bodyType!,
          skinTone: onboarding.skinTone!,
          stylePreference: onboarding.stylePreferences,
          colorPalette: [],
          createdAt: new Date(),
        };
        set({ user, isOnboarded: true, onboarding: initialOnboarding });
      },

      // Wardrobe actions
      addClothingItem: (item) =>
        set((state) => ({ wardrobe: [...state.wardrobe, item] })),

      updateClothingItem: (id, updates) =>
        set((state) => ({
          wardrobe: state.wardrobe.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      removeClothingItem: (id) =>
        set((state) => ({
          wardrobe: state.wardrobe.filter((item) => item.id !== id),
        })),

      // Outfit actions
      addOutfit: (outfit) =>
        set((state) => ({ savedOutfits: [...state.savedOutfits, outfit] })),

      rateOutfit: (id, rating, liked) =>
        set((state) => ({
          savedOutfits: state.savedOutfits.map((outfit) =>
            outfit.id === id ? { ...outfit, rating, liked } : outfit
          ),
        })),

      setRecommendations: (outfits) =>
        set({ currentRecommendations: outfits }),

      // User actions
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () =>
        set({
          theme: 'system', // Reset theme optional but safer
          user: null,
          isOnboarded: false,
          onboarding: initialOnboarding,
          wardrobe: [],
          savedOutfits: [],
          currentRecommendations: [],
        }),
    }),
    {
      name: 'style-stack-storage',
    }
  )
);
