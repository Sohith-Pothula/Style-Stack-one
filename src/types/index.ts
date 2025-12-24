export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bodyType: 'slim' | 'athletic' | 'average' | 'muscular' | 'curvy';
  skinTone: 'fair' | 'light' | 'medium' | 'olive' | 'tan' | 'dark';
  stylePreference: StylePreference[];
  colorPalette: string[];
  createdAt: Date;
}

export type StylePreference = 
  | 'oversized' 
  | 'streetwear' 
  | 'formal' 
  | 'minimal' 
  | 'sporty' 
  | 'vintage' 
  | 'bohemian' 
  | 'preppy';

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  type: ClothingType;
  color: string;
  colorName: string;
  fit: 'oversized' | 'regular' | 'fitted';
  material?: string;
  occasions: Occasion[];
  season: Season[];
  condition: 'new' | 'good' | 'worn' | 'retired';
  imageUrl: string;
  lastWorn?: Date;
  wearCount: number;
  createdAt: Date;
}

export type ClothingType = 
  | 'top' 
  | 'bottom' 
  | 'outerwear' 
  | 'shoes' 
  | 'accessory' 
  | 'dress' 
  | 'activewear';

export type Occasion = 
  | 'casual' 
  | 'work' 
  | 'party' 
  | 'date' 
  | 'gym' 
  | 'formal' 
  | 'beach' 
  | 'travel';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface Outfit {
  id: string;
  userId: string;
  items: ClothingItem[];
  occasion: Occasion;
  matchScore: number;
  explanation: string;
  weather?: WeatherCondition;
  mood?: string;
  liked?: boolean;
  rating?: number;
  createdAt: Date;
  wornAt?: Date;
}

export interface WeatherCondition {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
}

export interface StyleTip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface WardrobeStats {
  totalItems: number;
  mostWornItem?: ClothingItem;
  leastWornItem?: ClothingItem;
  colorDistribution: { color: string; count: number }[];
  occasionDistribution: { occasion: Occasion; count: number }[];
  avgCostPerWear?: number;
}
