# ⚜️ VELLURE Luxury Fragrance — Haute Attar E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

**VELLURE Luxury Fragrance** is a modern, high-conversion, ultra-luxurious e-commerce web application crafted specifically for artisanal attar and perfume connoisseurs in Bangladesh and worldwide. Built with a bespoke dark-gold aesthetic, seamless bilingual localization (English & Bengali), and lightning-fast checkout flows.

---

## ✨ Key Features & Architecture

### 🛍️ Client-Facing Experience
* **High-Res Hero Cover Slider:** Auto-rotating luxury banner showcasing custom visual campaigns with responsive touch controls.
* **Best Selling Showcase:** Top-ranked attars with live 3ml / 6ml bottle toggles, star ratings, and real-time discount calculations.
* **Exclusive Combo Packs (Combo & Gift Sets):** Dedicated section featuring curated gift boxes (*Signature Trio Pack*, *Gentleman's Edit*, *Elegant Aura*, and *Custom 6-Piece Discovery Coffret*).
* **Mobile Sticky "Add to Cart" Bar:** Floats smoothly at the bottom on mobile devices when users scroll, enabling friction-free single-tap ordering.
* **3D Coverflow Carousel:** Interactive rotating card showcase for New Arrivals.
* **Interactive Scent Finder Quiz:** Virtual fragrance concierge recommending personalized scents based on occasion, personality, and preferred notes.
* **Instant Header Search & Modal:** Real-time search by notes, perfume name, or category with instant keyword highlighting.
* **Bilingual Localization (EN / BN):** Full English and Bengali language support across all products, specs, and checkout forms.
* **Streamlined Checkout:**
  - Nationwide **Cash on Delivery (COD)** across Bangladesh (Dhaka: ৳60, Outside Dhaka: ৳120).
  - Digital payments (**bKash**, **Nagad**, **Rocket**).
  - Floating WhatsApp concierge for direct conversational ordering.

### ⚙️ Merchant & Admin Features
* **Admin Dashboard:** Order tracking, inventory management, status updates (Pending, Processing, Delivered, Cancelled).
* **Google Sheets 2-Way Inventory Sync:** Sync product catalog and stock levels directly with Google Sheets.
* **Automated Telegram Order Alerts:** Instant notifications sent to your private Telegram channel/chat upon new customer orders.
* **Meta Pixel & Google Analytics 4 (GA4):** Pre-wired conversion event tracking (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`).

---

## 🛠️ Tech Stack

* **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animation:** [Motion (Framer Motion)](https://motion.dev/)
* **Backend:** [Express.js](https://expressjs.com/) via `tsx`
* **Storage:** Local file system JSON storage with Google Sheets OAuth integration

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js (version 18 or higher) installed:
```bash
node -v
npm -v
```

### 2. Clone the Repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/vellure-luxury-fragrance.git
cd vellure-luxury-fragrance
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
Copy the `.env.example` file to create your `.env`:
```bash
cp .env.example .env
```
Open `.env` and configure optional variables (Telegram bot, Meta Pixel, Admin password, etc.).

### 5. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:3000`

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📦 How to Publish to GitHub (Step-by-Step)

Follow these steps to publish this codebase to your own GitHub account:

### Step 1: Initialize Git in your project
```bash
git init
git branch -M main
```

### Step 2: Stage and Commit the Files
```bash
git add .
git commit -m "feat: initial commit - VELLURE luxury fragrance platform"
```

### Step 3: Create a new repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter Repository name (e.g., `vellure-luxury-fragrance`).
3. Set visibility to **Public** or **Private**.
4. **Do NOT** initialize with README, .gitignore, or license (we already created them).
5. Click **Create repository**.

### Step 4: Link your local repository to GitHub & Push
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/vellure-luxury-fragrance.git
git push -u origin main
```

---

## 🌐 Deployment Options

### Deploying to Vercel
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `vellure-luxury-fragrance` repository.
4. Set Build Command: `npm run build`
5. Set Output Directory: `dist`
6. Add your environment variables from `.env.example`.
7. Click **Deploy**.

### Deploying to Netlify
1. Sign in to [Netlify](https://netlify.com) and click **Add new site** > **Import an existing project**.
2. Connect your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy Site**.

### Deploying Full-Stack (Render / Railway / VPS)
For full backend functionality (`server.ts` with API routes):
- Build command: `npm run build`
- Start command: `npm start` (or `node server.ts` / `npx tsx server.ts`)

---

## 📁 Project Structure

```text
├── data/
│   └── vellure_store.json        # Persistent JSON data store
├── src/
│   ├── assets/                   # High-resolution flacon images & logos
│   ├── components/               # Reusable UI components
│   │   ├── BestSellingShowcase.tsx
│   │   ├── ExclusiveComboSection.tsx
│   │   ├── StickyAddToCartBar.tsx
│   │   ├── CoverflowCarousel.tsx
│   │   ├── ScentFinderQuiz.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── context/                  # App state (Cart, Language, Route)
│   ├── data/                     # Initial product seed data
│   ├── pages/                    # Home, Shop, Product Details, Checkout, Admin
│   ├── types/                    # TypeScript interfaces & types
│   ├── utils/                    # Translations & formatting utilities
│   ├── App.tsx                   # Main layout container
│   └── main.tsx                  # Application entry point
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore file
├── index.html                    # HTML entry point with SEO & fonts
├── package.json                  # Dependencies and scripts
├── server.ts                     # Express production & API server
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build configuration
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---

Crafted with 🖤 for **VELLURE Luxury Fragrance**.
