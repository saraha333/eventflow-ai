# EventFlow AI

Frontend-only prototype for small organisations, charities and university clubs: create an event, generate a preparation plan, track readiness, simulate reminders, compare targets with results, and produce a printable report / CSV.

**Demo notice:** all data is sample data stored in your browser's `localStorage`. Reminders and alerts are **simulated** in the interface. No emails, WhatsApp messages or any other notifications are sent. No backend, API keys or accounts are needed.

## Tech
React 18 · Vite 5 · JavaScript · plain CSS · Recharts · Lucide React

## 1. Run locally
Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
cd eventflow-ai
npm install
npm run dev
```
Open the URL shown in the terminal (normally http://localhost:5173).

Production build check:
```bash
npm run build
npm run preview
```

## 2. Pages
- **Dashboard**: statistics, readiness and task-status charts, deadlines, simulated alerts
- **New event**: form plus automatic plan generator (tasks, deadlines, resource checklist by event type)
- **Event details**: edit details/targets, task status/due dates, resources, actual results
- **Automation**: reminder and alert rules, queue preview, simulated log
- **Analytics**: target vs actual attendance, spending, beneficiaries
- **Reports**: print-friendly report (use Print, then "Save as PDF") and CSV download

"Reset demo data" in the sidebar restores the original sample events.

## 3. Upload to GitHub
1. Create an empty repository on https://github.com/new (no README, no .gitignore).
2. In the project folder:
```bash
git init
git add .
git commit -m "Initial commit: EventFlow AI"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## 4a. Deploy on Vercel (simplest)
1. Sign in at https://vercel.com with GitHub.
2. **Add New → Project**, import your repository.
3. Vercel detects Vite automatically (Build command `npm run build`, Output directory `dist`). Click **Deploy**.
4. Your public URL looks like `https://your-repo.vercel.app`. Every `git push` redeploys.

## 4b. Deploy on GitHub Pages
The repo includes `.github/workflows/deploy.yml`.
1. Push the project to GitHub (step 3).
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish.
4. Your URL is `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

`vite.config.js` uses `base: "./"` and the app uses hash routing (`#/...`), so both hosts work without extra configuration.

## Project structure
```
src/
  App.jsx, main.jsx, router.jsx, store.jsx, styles.css
  components/  Layout.jsx, ui.jsx
  pages/       Dashboard, NewEvent, EventDetails, Automation, Analytics, Reports
  lib/         calc.js, plan.js (plan generator), checks.js (simulated alerts), report.js (recommendations, CSV)
  data/        seed.js (demo events)
```

## Limitations
Data lives only in each visitor's browser. Automation is simulated. A real version would need a backend and a notification service.
