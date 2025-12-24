import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { ClothingItem, ClothingType, Occasion, Season } from '@/types';
import { generateId } from '@/lib/utils';
import { ColorPickerDialog } from '@/components/ColorPickerDialog';
import {
  Plus,
  Camera,
  Image as ImageIcon,
  X,
  Check,
  Shirt,
  Search,
  Filter,
  Palette
} from 'lucide-react';

const clothingTypes: { value: ClothingType; label: string; emoji: string }[] = [
  { value: 'top', label: 'Top', emoji: '👕' },
  { value: 'bottom', label: 'Bottom', emoji: '👖' },
  { value: 'outerwear', label: 'Outerwear', emoji: '🧥' },
  { value: 'dress', label: 'Dress', emoji: '👗' },
  { value: 'shoes', label: 'Shoes', emoji: '👟' },
  { value: 'accessory', label: 'Accessory', emoji: '🧢' },
  { value: 'activewear', label: 'Activewear', emoji: '🏃' },
];

const occasions: { value: Occasion; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'work', label: 'Work' },
  { value: 'party', label: 'Party' },
  { value: 'date', label: 'Date' },
  { value: 'gym', label: 'Gym' },
  { value: 'formal', label: 'Formal' },
];

const seasons: { value: Season; label: string }[] = [
  { value: 'spring', label: '🌸 Spring' },
  { value: 'summer', label: '☀️ Summer' },
  { value: 'fall', label: '🍂 Fall' },
  { value: 'winter', label: '❄️ Winter' },
];

export const WardrobePage = () => {
  const { wardrobe, addClothingItem, removeClothingItem } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ClothingType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [currentEditIndex, setCurrentEditIndex] = useState(0);
  const [bulkItems, setBulkItems] = useState<Array<{
    name: string;
    type: ClothingType | '';
    color: string;
    colorName: string;
    fit: 'oversized' | 'regular' | 'fitted';
    occasions: Occasion[];
    season: Season[];
    imageUrl: string;
  }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_PHOTOS = 12;

  const filteredWardrobe = wardrobe.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = MAX_PHOTOS - uploadedImages.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages((prev) => {
            if (prev.length >= MAX_PHOTOS) return prev;
            return [...prev, reader.result as string];
          });
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const startEditingItems = () => {
    if (uploadedImages.length === 0) return;

    const items = uploadedImages.map((imageUrl) => ({
      name: '',
      type: '' as ClothingType | '',
      color: '#000000',
      colorName: 'Custom',
      fit: 'regular' as const,
      occasions: [] as Occasion[],
      season: [] as Season[],
      imageUrl,
    }));

    setBulkItems(items);
    setCurrentEditIndex(0);
  };

  const updateCurrentItem = (field: string, value: any) => {
    setBulkItems((prev) => {
      const updated = [...prev];
      updated[currentEditIndex] = { ...updated[currentEditIndex], [field]: value };
      return updated;
    });
  };

  const toggleOccasion = (occasion: Occasion) => {
    const current = bulkItems[currentEditIndex];
    const newOccasions = current.occasions.includes(occasion)
      ? current.occasions.filter((o) => o !== occasion)
      : [...current.occasions, occasion];
    updateCurrentItem('occasions', newOccasions);
  };

  const toggleSeason = (season: Season) => {
    const current = bulkItems[currentEditIndex];
    const newSeasons = current.season.includes(season)
      ? current.season.filter((s) => s !== season)
      : [...current.season, season];
    updateCurrentItem('season', newSeasons);
  };

  const handleSaveAll = () => {
    bulkItems.forEach((item) => {
      if (!item.name || !item.type || !item.color) return;

      const clothingItem: ClothingItem = {
        id: generateId(),
        userId: '',
        name: item.name,
        type: item.type as ClothingType,
        color: item.color,
        colorName: item.colorName,
        fit: item.fit,
        occasions: item.occasions,
        season: item.season,
        condition: 'new',
        imageUrl: item.imageUrl,
        wearCount: 0,
        createdAt: new Date(),
      };
      addClothingItem(clothingItem);
    });

    // Reset everything
    setShowAddModal(false);
    setUploadedImages([]);
    setBulkItems([]);
    setCurrentEditIndex(0);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setUploadedImages([]);
    setBulkItems([]);
    setCurrentEditIndex(0);
  };

  const currentItem = bulkItems[currentEditIndex];
  const isEditingMode = bulkItems.length > 0;
  const canProceedToEdit = uploadedImages.length > 0;
  const canSaveCurrentItem = currentItem?.name && currentItem?.type && currentItem?.color;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-3xl font-bold mb-1">
          <span className="gradient-text">Wardrobe</span>
        </h1>
        <p className="text-muted-foreground">
          {wardrobe.length} items in your closet
        </p>
      </div>

      {/* Search */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
          >
            All
          </button>
          {clothingTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveFilter(type.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${activeFilter === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
            >
              <span>{type.emoji}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6">
        {filteredWardrobe.length === 0 ? (
          <div className="glass-card p-8 text-center rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Shirt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold mb-2">
              {wardrobe.length === 0 ? 'Start building your wardrobe' : 'No items found'}
            </h4>
            <p className="text-muted-foreground text-sm mb-4">
              {wardrobe.length === 0
                ? 'Add your first clothing item to get started'
                : 'Try adjusting your search or filter'
              }
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-4"
          >
            <AnimatePresence>
              {filteredWardrobe.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeClothingItem(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div
                      className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-background"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-glow flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-card rounded-t-3xl p-6 pb-24 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />

              {!isEditingMode ? (
                <>
                  {/* Photo Selection Mode */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Select Photos</h2>
                    <span className="text-sm text-muted-foreground">
                      {uploadedImages.length}/{MAX_PHOTOS}
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Upload Button */}
                  {uploadedImages.length < MAX_PHOTOS && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-3 p-4 mb-4 rounded-2xl bg-secondary border-2 border-dashed border-border hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-muted-foreground" />
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Tap to add up to {MAX_PHOTOS - uploadedImages.length} more photos
                      </span>
                    </button>
                  )}

                  {/* Selected Photos Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeUploadedImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      className="flex-1"
                      onClick={startEditingItems}
                      disabled={!canProceedToEdit}
                    >
                      Continue ({uploadedImages.length})
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Item Editing Mode */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      Item {currentEditIndex + 1} of {bulkItems.length}
                    </h2>
                    <div className="flex gap-1">
                      {bulkItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentEditIndex(index)}
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${index === currentEditIndex
                              ? 'border-primary scale-110'
                              : item.name && item.type && item.color
                                ? 'border-accent'
                                : 'border-border opacity-50'
                            }`}
                        >
                          <img
                            src={item.imageUrl}
                            alt={`Item ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Image Preview */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden max-w-[150px] mx-auto mb-4">
                    <img
                      src={currentItem?.imageUrl}
                      alt="Current item"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Name *</label>
                    <input
                      type="text"
                      value={currentItem?.name || ''}
                      onChange={(e) => updateCurrentItem('name', e.target.value)}
                      placeholder="e.g., Blue Denim Jacket"
                      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Type */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Type *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {clothingTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateCurrentItem('type', type.value)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${currentItem?.type === type.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-secondary'
                            }`}
                        >
                          <span className="text-xl block">{type.emoji}</span>
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Color *</label>
                    <div className="flex gap-4 items-center">
                      <div
                        className="w-16 h-16 rounded-full border-4 border-secondary shadow-lg transition-all hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: currentItem?.color || '#000000' }}
                        onClick={() => setShowColorPicker(true)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShowColorPicker(true)}
                        className="gap-2"
                      >
                        <Palette className="w-4 h-4" />
                        {currentItem?.color || 'Select Color'}
                      </Button>
                    </div>
                  </div>

                  {/* Fit */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Fit</label>
                    <div className="flex gap-2">
                      {(['oversized', 'regular', 'fitted'] as const).map((fit) => (
                        <button
                          key={fit}
                          onClick={() => updateCurrentItem('fit', fit)}
                          className={`flex-1 py-3 rounded-xl border-2 capitalize transition-all ${currentItem?.fit === fit
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-secondary'
                            }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Occasions */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Occasions</label>
                    <div className="flex gap-2 flex-wrap">
                      {occasions.map((occasion) => (
                        <button
                          key={occasion.value}
                          onClick={() => toggleOccasion(occasion.value)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${currentItem?.occasions.includes(occasion.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground'
                            }`}
                        >
                          {occasion.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seasons */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Seasons</label>
                    <div className="flex gap-2 flex-wrap">
                      {seasons.map((season) => (
                        <button
                          key={season.value}
                          onClick={() => toggleSeason(season.value)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${currentItem?.season.includes(season.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground'
                            }`}
                        >
                          {season.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation & Save */}
                  <div className="flex gap-3">
                    {currentEditIndex > 0 && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentEditIndex(currentEditIndex - 1)}
                      >
                        Prev
                      </Button>
                    )}

                    {currentEditIndex < bulkItems.length - 1 ? (
                      <Button
                        variant="gradient"
                        size="lg"
                        className="flex-1"
                        onClick={() => setCurrentEditIndex(currentEditIndex + 1)}
                        disabled={!canSaveCurrentItem}
                      >
                        Next Item
                      </Button>
                    ) : (
                      <Button
                        variant="gradient"
                        size="lg"
                        className="flex-1"
                        onClick={handleSaveAll}
                        disabled={!bulkItems.every(item => item.name && item.type && item.color)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save All ({bulkItems.filter(item => item.name && item.type && item.color).length})
                      </Button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ColorPickerDialog
        open={showColorPicker}
        onOpenChange={setShowColorPicker}
        initialColor={currentItem?.color || '#000000'}
        onSave={(color) => {
          updateCurrentItem('color', color);
          updateCurrentItem('colorName', color); // Using hex as name since we don't have a name generator
        }}
      />
    </div>
  );
};
