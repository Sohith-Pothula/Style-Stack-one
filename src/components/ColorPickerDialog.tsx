import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pipette } from 'lucide-react';

interface ColorPickerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialColor: string;
    onSave: (color: string) => void;
}

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

export function ColorPickerDialog({ open, onOpenChange, initialColor, onSave }: ColorPickerDialogProps) {
    const [color, setColor] = useState(initialColor || '#000000');
    const [rgb, setRgb] = useState(hexToRgb(initialColor || '#000000'));

    useEffect(() => {
        if (open) {
            setColor(initialColor || '#000000');
            setRgb(hexToRgb(initialColor || '#000000'));
        }
    }, [open, initialColor]);

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        setRgb(hexToRgb(newColor));
    };

    const handleRgbChange = (key: 'r' | 'g' | 'b', value: string) => {
        const num = parseInt(value);
        if (isNaN(num)) return;

        const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, num)) };
        setRgb(newRgb);
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    const handleHexChange = (value: string) => {
        if (value.startsWith('#')) {
            if (/^#[0-9A-F]{6}$/i.test(value)) {
                setColor(value);
                setRgb(hexToRgb(value));
            }
        } else {
            // Handle without hash just in case, or enforce hash user side
        }
    };

    const handleEyeDropper = async () => {
        if ('EyeDropper' in window) {
            try {
                // @ts-ignore
                const eyeDropper = new window.EyeDropper();
                const result = await eyeDropper.open();
                handleColorChange(result.sRGBHex);
            } catch (e) {
                console.log('EyeDropper failed/cancelled', e);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle>Select Color</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="custom-color-picker [&_.react-colorful]:w-full [&_.react-colorful]:h-48 [&_.react-colorful__saturation]:rounded-lg [&_.react-colorful__hue]:rounded-lg [&_.react-colorful__hue]:mt-4">
                        <HexColorPicker color={color} onChange={handleColorChange} />
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
                            style={{ backgroundColor: color }}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={handleEyeDropper}
                            type="button"
                        >
                            <Pipette className="h-4 w-4" />
                        </Button>

                        {/* If we want the slider here separate, react-colorful separates them too but HexColorPicker combines. The screenshot shows hueslider separate. 
                HexColorPicker has it at bottom. That's fine.
            */}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">Hex</Label>
                            <Input
                                value={color}
                                onChange={(e) => handleHexChange(e.target.value)}
                                className="h-9 font-mono text-xs uppercase"
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">R</Label>
                            <Input
                                type="number"
                                value={rgb.r}
                                onChange={(e) => handleRgbChange('r', e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>
                        <div className="col-span-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">G</Label>
                            <Input
                                type="number"
                                value={rgb.g}
                                onChange={(e) => handleRgbChange('g', e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>
                        <div className="col-span-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">B</Label>
                            <Input
                                type="number"
                                value={rgb.b}
                                onChange={(e) => handleRgbChange('b', e.target.value)}
                                className="h-9 text-xs"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="default" onClick={() => {
                        onSave(color);
                        onOpenChange(false);
                    }}>
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
