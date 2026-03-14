# ideaSTORAGE — AI Workflow Vault

A futuristic Progressive Web App (PWA) for saving, organizing, and copying AI prompts. Works offline and can be installed directly on your phone or desktop home screen.

## 🌐 Live Site

**https://CHARLESWILLIAMMM.github.io/ideaSTORAGE/**

---

## ⚡ Enable GitHub Pages (one-time setup — owner only)

The GitHub Actions deployment workflow is already committed. To activate the live URL:

1. Go to **https://github.com/CHARLESWILLIAMMM/ideaSTORAGE/settings/pages**
2. Under **"Build and deployment"**, set **Source → GitHub Actions**
3. Click **Save**
4. Go to **https://github.com/CHARLESWILLIAMMM/ideaSTORAGE/actions** and click the latest **"Deploy to GitHub Pages"** run
5. Click **"Review deployments"**, tick **github-pages**, then **"Approve and deploy"**

After that, every push to `main` deploys automatically — no approval needed again.

---

## 📱 Install as a PWA

### On Android (Chrome / Edge)
1. Open **https://CHARLESWILLIAMMM.github.io/ideaSTORAGE/**
2. Tap the browser menu (⋮) → **"Add to Home screen"** or **"Install app"**

### On iPhone / iPad (Safari)
1. Open **https://CHARLESWILLIAMMM.github.io/ideaSTORAGE/**
2. Tap the **Share** button (□↑) → **"Add to Home Screen"**

### On Desktop (Chrome / Edge)
1. Open **https://CHARLESWILLIAMMM.github.io/ideaSTORAGE/**
2. Click the **install icon** (⊕) in the address bar → **"Install"**

---

## ✨ Features

| Feature | Details |
|---|---|
| 💾 Save prompts | Title + Category + full prompt body stored in Local Storage |
| 📂 Category folders | Coding · Writing · Games · School — filter with one click |
| 📋 Copy to clipboard | One tap copies the prompt, ready to paste into any AI tool |
| 🗑️ Delete | Remove prompts you no longer need |
| 📴 Offline support | Service Worker caches the full app — works with no internet |
| 📲 Installable | Full PWA with manifest + icons for home-screen install |

---

## 🗂️ File Structure

```
index.html      — App shell & layout
styles.css      — Futuristic dark theme (glassmorphism)
app.js          — Local Storage logic, filtering, clipboard
manifest.json   — PWA manifest (name, icons, theme)
sw.js           — Service Worker (cache-first, offline support)
icons/          — 192 × 192 and 512 × 512 PNG app icons
.github/workflows/deploy.yml — GitHub Pages CI/CD
```
