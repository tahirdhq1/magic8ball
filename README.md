# Magic 8 Ball Online

A premium, interactive web application featuring a 3D-styled Magic 8 Ball, custom synthesized audio, question history, saved favorites, quick question chips, and responsive glassmorphism dark-mode aesthetic.

## Features

- **Interactive 3D Magic 8 Ball**: Realistic lighting, glossy specular reflections, liquid viewport portal, floating triangular die answer reveal, and multi-axis shake physics.
- **Classic 20 Magic 8 Ball Responses**: Categorized into Affirmative, Non-committal, and Negative predictions.
- **Web Audio API Sound Synthesizer**: Custom mystical rumble sound effect during shakes, crystal chime chord on answer reveal, and UI click feedback.
- **Particle System**: Interactive background canvas with floating ambient dust stars and explosive glowing particle bursts on fortune reveals.
- **Question History & Favorites**: Persisted in `localStorage` with options to bookmark, search/filter, and manage previous queries.
- **Social Sharing & Copying**: Built-in support for standard Web Share API and Clipboard copying.
- **Editable Configuration Objects**:
  - `SITE_CONFIG`: Easily update SEO metadata, title, description, and OpenGraph settings.
  - `UI_CONFIG`: Customize colors, border-radii, animation speeds, particle counts, and ball size.
- **Mobile-First & Accessible**: Fully keyboard accessible (`tabindex`, visible focus states, ARIA roles/live-regions) with touch-friendly controls.
- **SEO & Expansion Ready**: Clean `<section id="article">` and `<section id="faq">` placeholders designed for future long-form guide content and FAQ schema markup.

## Project Structure

```
├── index.html        # Semantic HTML5 document structure
├── style.css         # Modern CSS3 with glassmorphism, 3D transformations, & keyframe animations
├── script.js         # Vanilla JS (ES6+) core logic, Web Audio API, particle canvas, & storage
└── README.md         # Project documentation
```

## Getting Started & Deployment

1. **Local Development:** Run `npm install` and `npm run dev`.
2. **Build for Production:** Run `npm run build` (outputs to `dist/`).
3. **Deploy to Cloudflare Pages via GitHub:**
   - Push your code to GitHub.
   - Go to [Cloudflare Pages](https://dash.cloudflare.com/) > **Create Application** > **Pages** > **Connect to Git**.
   - Select your repo, set Framework to `Vite`, Build Command to `npm run build`, and Output Directory to `dist`.
   - Click **Save and Deploy**. See `CLOUDFLARE_DEPLOYMENT.md` for full step-by-step guidance!

