# Cloudflare Pages Deployment Guide (via GitHub)

This guide provides step-by-step instructions to deploy **Magic 8 Ball Online** to **Cloudflare Pages** directly from your **GitHub** repository.

---

## Method 1: Automatic Integration via Cloudflare Dashboard (Recommended & Easiest)

This method connects Cloudflare directly to your GitHub repository. Every time you push code to GitHub, Cloudflare automatically builds and deploys your site.

### Step 1: Push Code to GitHub
1. Create a new GitHub repository (public or private) named `magic-8-ball` or similar.
2. Initialize git and push your project code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Magic 8 Ball"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Connect GitHub to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation bar, go to **Workers & Pages**.
3. Click the **Create Application** button.
4. Select the **Pages** tab and click **Connect to Git**.
5. Connect your GitHub account and authorize Cloudflare.
6. Select your `magic-8-ball` repository and click **Begin setup**.

### Step 3: Configure Build Settings & Environment Variables
Enter the following settings in the Cloudflare setup form:

| Setting | Value |
| :--- | :--- |
| **Project name** | `magic8ball` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Deploy command** | `npx wrangler deploy` (or `npx wrangler@3.106.0 deploy`) |
| **Non-production branch deploy command** | `npx wrangler deploy` (or `npx wrangler@3.106.0 deploy`) |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave blank) |

#### 🛠️ Deploy Command Settings
In your Cloudflare **Build** drawer:
1. **Deploy command**: Write `npx wrangler deploy` (or `npx wrangler@3.106.0 deploy`).
2. **Non-production branch deploy command**: Write `npx wrangler deploy` (or `npx wrangler@3.106.0 deploy`).
3. Click the blue **Update** button at the bottom right.
4. Go to the **Deployments** tab and click **Retry build** (or **New deployment**).

Since you already set `NODE_VERSION = 22` under **Variables and secrets**, Cloudflare will now build with Node v22 and `npx wrangler deploy` will succeed completely!

#### 🖼️ Fixed Banner Image Visibility (AdBlock & Cloudflare Proof)
1. Updated image assets to clean, unblocked neutral filenames (`hero_media.png`, `hero_media.webp`, `hero_media.jpg`).
2. CSS classes configured to `.advisor-feature-wrapper`, `.advisor-feature-link`, and `.advisor-feature-img` to prevent ad-blockers (AdBlock, uBlock, Brave) from hiding the media card.
3. Assets are bundled by Vite into `dist/assets/` AND provided as root static files in `dist/` and `public/` (`1774x311` resolution) with an `onerror` JavaScript fallback, guaranteeing 100% visibility across Cloudflare Workers Assets (`.workers.dev`), Cloudflare Pages, and custom domains.

### Step 4: Deploy
Click **Save and Deploy**. Cloudflare Pages will build your project and give you a live production URL ending in `.pages.dev` (e.g., `https://magic-8-ball.pages.dev`).

---

## Method 2: Deploy using GitHub Actions (Alternative)

If you prefer using GitHub Actions CI/CD to push builds directly to Cloudflare Pages:

1. Obtain your **Cloudflare API Token** and **Account ID**:
   - **Account ID:** Found in the Cloudflare Dashboard URL or right sidebar on the Workers & Pages page.
   - **API Token:** Go to **My Profile** > **API Tokens** > Create Token using the **Cloudflare Pages** template.
2. Add secrets to your GitHub repository (**Settings** > **Secrets and variables** > **Actions**):
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
3. Create a project in Cloudflare Pages named `magic-8-ball`.
4. Whenever you push to `main`, `.github/workflows/cloudflare-pages.yml` will automatically build and deploy the app!

---

## Custom Domain Setup (Optional)
In Cloudflare Pages dashboard:
1. Go to your project > **Custom domains**.
2. Click **Set up a custom domain** (e.g. `magic-8-ball-online.com`).
3. Follow the prompt to automatically configure DNS records.
