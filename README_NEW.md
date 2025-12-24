# Style Stack

Style Stack — AI fashion stylist

Style Stack is an AI-assisted personal fashion stylist that helps users discover outfit combinations from their own wardrobe. Add photos of clothing items, pick moods and occasions, and get AI-generated outfit suggestions that you can save, rate, and refine.

---

## ✨ Key Features

- **🌓 Premium Dual-Theme UI**: Seamlessly switches between a stunning Neon Dark Mode and a clean, professional Light Mode.
- **🧚‍♂️ AI-Powered Styling**: Smart outfit generation based on occasion, mood, weather, and your specific wardrobe items.
- **👗 Visual Wardrobe**: Digital closet management with category filtering, color tagging, and stats.
- **🧠 Style Profile**: Customizes results based on body type, skin tone, and aesthetic preferences (e.g., Streetwear, Minimalist).
- **📊 Insights Dashboard**: Analytics on your most worn items, color palette distribution, and style streaks.

---

## 📱 App Screens

### 1️⃣ Style Lab (AI Stylist)
- Interactive 3-step flow: Occasion → Vibe → Custom Input.
- Generates "Outfit Situations" with match scores and explanations.
- Features a "Collage Mode" for result visualization.

### 2️⃣ Profile & Settings
- **New!** Appearance settings to toggle Light/Dark/System themes.
- Skin tone and body type management.

### 3️⃣ Home Dashboard
- Daily "Weather Fit" recommendations.
- Quick actions and wardrobe summary.

---


## Screenshots

Below are key screens from the app (images are in `assets/Screen-shots`):

| Screen | Preview |
|---|---:|
| Start / Welcome | ![Start](/assets/Screen-shots/style-stack-start.png)
| Home | ![Home](/assets/Screen-shots/style-stack-home.png)
| Wardrobe | ![Wardrobe](/assets/Screen-shots/style-stack-wardrobe.png)
| Style Output | ![Style Output](/assets/Screen-shots/style-stack-style-output.png)
| Your Vibe | ![Your Vibe](/assets/Screen-shots/style-stack-your-vibe.png)
| Display Name | ![Display Name](/assets/Screen-shots/style-stack-display-name.png)
| Skin Tone Selector | ![Skin Tone](/assets/Screen-shots/style-stack-skin-tone.png)
| Insights | ![Insights](/assets/Screen-shots/style-stack-insights.png)
| Profile | ![Profile](/assets/Screen-shots/style-stack-profile.png)

> Note: If the images don't render on GitHub, they will still be available in the `assets/Screen-shots` folder of the repo.

---

## What is this project about?

Style Stack is a lightweight web app that helps users manage their wardrobe and receive outfit suggestions powered by simple heuristics. It focuses on usability on mobile and desktop, with a modern, accessible UI.

## Technical details

- Framework: Vite + React (TypeScript)
- Styling: Tailwind CSS + shadcn-ui components
- State management: Zustand (persisted to localStorage)
- Routing: react-router-dom
- Key libraries: framer-motion, lucide-react, recharts, sonner
- Build tools: Vite (esbuild)
- UI/UX: Google Stich
  

---

## How to install locally

1. Clone the repo:

```bash
https://github.com/Sohith-Pothula/Style-Stack.git
cd <YOUR_PROJECT_DIRECTORY>
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

Open the Local URL shown in the terminal (e.g., `http://127.0.0.1:5174/`) in your browser.

To make the dev server accessible on your LAN (so others on the same Wi‑Fi can open it):

```bash
npm run dev -- --host
```

4. Build and preview production:

```bash
npm run build
npm run preview
```

---

## Step-by-step guide (commands)

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Start dev server on LAN: `npm run dev -- --host`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

---

## How to use the app (user guide)

1. Open the app in your browser and complete onboarding (name, body type, skin tone, style prefs).
2. Add clothing items:
   - Go to **Wardrobe** → tap the **+** button → upload photos.
   - Edit each item’s name, type, color, fit, occasions, and seasons.
   - Save items to add them to your closet.
3. Generate outfit suggestions:
   - Go to **Style** → choose an occasion and mood → generate outfits.
   - Save and rate the outfits you like.
4. View analytics in **Insights** and edit profile information in **Profile**.

---

## Project structure

- `src/`
  - `components/` — shared UI components (BottomNav, Onboarding, ui/)
  - `pages/` — top-level pages (HomePage, WardrobePage, StylePage, InsightsPage, ProfilePage)
  - `store/` — Zustand store and persistence
  - `lib/` — utils (`cn`, `generateId`)
  - `hooks/` — custom React hooks
  - `types/` — TypeScript types
- `assets/Screen-shots` — screenshots used in the README
- `public/` — static files
- `vite.config.ts`, `tailwind.config.ts`, `package.json`, `tsconfig.json`

---

