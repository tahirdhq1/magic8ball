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
| **Deploy command** | *(Leave empty)* or `npx wrangler@3.106.0 deploy` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave blank) |

#### ⚠️ How to Fix "Deploy command failed" or Node Version Warning
In Cloudflare Workers Assets / Pages:
1. Go to **Workers & Pages** > **magic8ball** > **Settings**.
2. Under **Build settings**:
   - If **Deploy command** says `npx wrangler deploy`, edit build settings and clear the Deploy command (leave it blank) OR change it to `npx wrangler@3.106.0 deploy`.
   - Cloudflare Pages / Workers Assets automatically deploys the contents of `dist` after `npm run build` completes.
3. Save settings and go to **Deployments** > **Retry build**.

#### 🖼️ Fixed Banner Image Visibility
1. Base path in `vite.config.ts` has been set to `/` (root-relative).
2. The `<picture>` element in `index.html` references `/psychic_banner.webp` and `/psychic_banner.jpg` directly from the `public` asset root.
3. Both WebP and JPG optimized images are included in `public/` and built cleanly into `dist/`.

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
