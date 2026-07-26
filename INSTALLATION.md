# Step-by-Step Installation & Setup Guide

This document provides complete step-by-step instructions for installing, running, and deploying the **Magic 8 Ball** web application.

---

## 1. Is this application built with Node.js?

**Yes.** This application is structured as a **Node.js / Vite web application**. 

- **Development Runtime:** Node.js (v18.0.0 or higher recommended) with `npm`.
- **Bundler / Dev Server:** Vite.
- **Frontend Core:** Standard HTML5, CSS3, JavaScript (ES6+), and Web Audio API.
- **Static Hosting Friendly:** Because the compiled frontend runs directly in the browser, you can host the output static files (`index.html`, `script.js`, `style.css`) on any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, Apache, or Nginx) without needing a active Node.js backend server in production.

---

## 2. Prerequisites

Before installing, ensure you have the following installed on your machine:
- **Node.js** (version 18+ or 20+ recommended) — [Download Node.js](https://nodejs.org/)
- **npm** (comes bundled with Node.js) or **pnpm** / **yarn** / **bun**

To verify installation, open your terminal / command prompt and run:
```bash
node -v
npm -v
```

---

## 3. Step-by-Step Installation

### Step 1: Extract / Download Project Files
Extract the provided project ZIP file into your desired directory, or navigate into the root directory of the project:
```bash
cd magic-8-ball
```

### Step 2: Install Dependencies
Run the following command in the terminal to install all required dependencies (Vite, Tailwind CSS, TypeScript tooling, etc.):
```bash
npm install
```

---

## 4. Running the Application Locally (Development Mode)

To start the local development server with hot-reload enabled:

```bash
npm run dev
```

After running this command, open your web browser and navigate to:
```
http://localhost:3000
```
*(or the local URL printed in your terminal window)*.

---

## 5. Building for Production

To compile and bundle the application into optimized static assets for deployment:

```bash
npm run build
```

This will generate a `dist/` folder containing the compiled production build:
- `dist/index.html`
- `dist/assets/...`

---

## 6. Previewing the Production Build Locally

To test the production build on your local machine before deploying:

```bash
npm run preview
```

---

## 7. Deployment Options

### Option A: Cloudflare Pages via GitHub (Recommended)
1. Push your repository code to GitHub.
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository.
4. Set build configuration:
   - **Framework Preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**. (See `CLOUDFLARE_DEPLOYMENT.md` for full detailed guide).

### Option B: Other Static Web Hosting (Vercel, Netlify)
1. Run `npm run build` to generate the `dist` folder.
2. Upload the project repository or `dist/` directory to your hosting provider.
3. Set the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Option C: GitHub Pages
1. Push your repository to GitHub.
2. Go to **Repository Settings** > **Pages**.
3. Select **GitHub Actions** or serve from the `dist` branch.

### Option D: Traditional Web Server (Nginx / Apache / cPanel)
Upload the contents of the `dist/` directory (or `index.html`, `script.js`, `style.css`) directly to your web root (`public_html` or `/var/www/html`).

---

## 8. Troubleshooting & Tips

- **Audio Playback:** Modern web browsers require a user gesture (like a tap or click) before Web Audio API sound effects can play. The app automatically handles unlocking audio context on the first user interaction.
- **Port Conflict:** If port `3000` is in use by another service, Vite will automatically select another available port or you can specify `--port` in `package.json`.
