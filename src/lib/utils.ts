import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Robust ID generator with fallbacks for browsers/environments that may not support crypto.randomUUID()
export function generateId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // @ts-ignore
      return (crypto as any).randomUUID();
    }

    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const bytes = new Uint8Array(16);
      (crypto as any).getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      return ([...bytes]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'));
    }
  } catch (e) {
    // ignore and fallback
  }

  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}
