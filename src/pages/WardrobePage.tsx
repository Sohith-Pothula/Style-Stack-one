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
  Palette,
  PackageOpen
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
    <div className="min-h-screen pb-28 relative">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-80 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Your <span className="gradient-text">Wardrobe</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage your digital closet ({wardrobe.length} items)
        </p>
      </div>

      {/* Search */}
      <div className="px-6 mb-6 relative z-10 sticky top-0 bg-background/80 backdrop-blur-md py-4 -my-4 transition-all">
        <div className="relative shadow-lg rounded-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clothes..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card/80 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-8 relative z-10">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${activeFilter === 'all'
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
          >
            All Items
          </button>
          {clothingTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveFilter(type.value)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${activeFilter === type.value
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
            >
              <span>{type.emoji}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 relative z-10">
        {filteredWardrobe.length === 0 ? (
          <div className="glass-card p-10 text-center rounded-3xl border-dashed border-2 border-border/50 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 animate-pulse-glow">
              {wardrobe.length === 0 ? (
                <PackageOpen className="w-10 h-10 text-primary" />
              ) : (
                <Search className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <h4 className="text-xl font-bold mb-2">
              {wardrobe.length === 0 ? 'Closet Empty' : 'No items found'}
            </h4>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              {wardrobe.length === 0
                ? 'Upload photos of your clothes to start generating outfits.'
                : 'Try clearing your search filters to see more things.'
              }
            </p>
            {wardrobe.length === 0 && (
              <Button onClick={() => setShowAddModal(true)} variant="gradient" className="shadow-glow">
                Add Items Now
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-4 pb-20"
          >
            <AnimatePresence mode="popLayout">
              {filteredWardrobe.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="glass-card rounded-2xl overflow-hidden group hover:shadow-glow transition-all duration-300 border-border/50"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-secondary/50">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeClothingItem(item.id); }}
                        className="w-8 h-8 rounded-full bg-destructive/90 text-white flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Color dot */}
                    <div
                      className="absolute bottom-2 left-2 w-5 h-5 rounded-full border border-white/20 shadow-sm ring-1 ring-black/10"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                  <div className="p-3 bg-card/50 backdrop-blur-sm">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 mt-1">
                      {clothingTypes.find(t => t.value === item.type)?.emoji} {item.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent shadow-glow flex items-center justify-center z-40 border-4 border-background"
      >
        <Plus className="w-8 h-8 text-primary-foreground" />
      </motion.button>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-card rounded-t-3xl sm:rounded-3xl p-6 pb-12 sm:pb-6 max-h-[90vh] overflow-y-auto relative gradient-border-container ring-1 ring-white/10"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8 sm:hidden" />

              {!isEditingMode ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Add Clothes</h2>
                      <p className="text-muted-foreground text-sm">Fill your digital closet</p>
                    </div>
                    <div className="bg-secondary px-3 py-1 rounded-full text-xs font-medium">
                      {uploadedImages.length}/{MAX_PHOTOS}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {uploadedImages.length < MAX_PHOTOS && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-3 p-8 mb-6 rounded-2xl bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold block text-foreground">Tap to upload photos</span>
                        <span className="text-xs text-muted-foreground">Support JPG, PNG</span>
                      </div>
                    </button>
                  )}

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group bg-secondary">
                          <img
                            src={imageUrl}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeUploadedImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 rounded-xl h-12"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="gradient"
                      size="lg"
                      className="flex-[2] rounded-xl h-12 shadow-glow"
                      onClick={startEditingItems}
                      disabled={!canProceedToEdit}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold">Edit Details</h2>
                      <p className="text-xs text-muted-foreground">Item {currentEditIndex + 1} of {bulkItems.length}</p>
                    </div>

                    <div className="flex gap-1">
                      {bulkItems.map((item, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentEditIndex ? 'bg-primary w-4' : 'bg-muted'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-6 mb-6">
                    <div className="w-1/3 flex-shrink-0">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border sticky top-0">
                        <img
                          src={currentItem?.imageUrl}
                          alt="Current item"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto max-h-[60vh] pr-1">
                      {/* Name */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                        <input
                          type="text"
                          value={currentItem?.name || ''}
                          onChange={(e) => updateCurrentItem('name', e.target.value)}
                          placeholder="e.g. Vintage Denim Jacket"
                          className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:bg-secondary outline-none transition-all text-foreground"
                          autoFocus
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Category</label>
                        <div className="grid grid-cols-2 gap-2">
                          {clothingTypes.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => updateCurrentItem('type', type.value)}
                              className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${currentItem?.type === type.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-secondary/30 hover:border-primary/50'
                                }`}
                            >
                              <span className="text-lg">{type.emoji}</span>
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Color</label>
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30">
                          <div
                            className="w-10 h-10 rounded-full border-2 border-white/20 shadow-sm cursor-pointer"
                            style={{ backgroundColor: currentItem?.color }}
                            onClick={() => setShowColorPicker(true)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{currentItem?.color}</p>
                            <p className="text-xs text-muted-foreground">Tap circle to change</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setShowColorPicker(true)}>
                            <Palette className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Occasions */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Occasions</label>
                        <div className="flex gap-2 flex-wrap">
                          {occasions.map((occasion) => (
                            <button
                              key={occasion.value}
                              onClick={() => toggleOccasion(occasion.value)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${currentItem?.occasions.includes(occasion.value)
                                ? 'bg-primary border-primary text-white'
                                : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                              {occasion.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Seasons */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Seasons</label>
                        <div className="flex gap-2 flex-wrap">
                          {seasons.map((season) => (
                            <button
                              key={season.value}
                              onClick={() => toggleSeason(season.value)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${currentItem?.season.includes(season.value)
                                ? 'bg-accent border-accent text-white'
                                : 'bg-transparent border-border text-muted-foreground hover:border-accent/50'
                                }`}
                            >
                              {season.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border mt-auto">
                    {currentEditIndex > 0 && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentEditIndex(currentEditIndex - 1)}
                        className="rounded-xl h-12"
                      >
                        Back
                      </Button>
                    )}

                    {currentEditIndex < bulkItems.length - 1 ? (
                      <Button
                        variant="gradient"
                        size="lg"
                        className="flex-1 rounded-xl h-12 shadow-glow"
                        onClick={() => setCurrentEditIndex(currentEditIndex + 1)}
                        disabled={!canSaveCurrentItem}
                      >
                        Next Item
                      </Button>
                    ) : (
                      <Button
                        variant="gradient"
                        size="lg"
                        className="flex-1 rounded-xl h-12 shadow-glow"
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
