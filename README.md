# AI Engineering Roadmap (Interactive Curriculum Tracker)

A fully interactive, warm-canvas editorial learning roadmap designed to track and organize your study path through Chip Huyen's book *AI Engineering* and Edward Donner's *LLM Engineering* Udemy course.

This application is built with React, Vite, and custom CSS variables, and is configured with automated local state synchronization and Obsidian Second Brain integrations.

---

## 🚀 Key Features

* **Warm-Canvas Editorial Design:** Implements a premium, readable typography scale using Cormorant Garamond (serif display) and Inter (body sans-serif), with alternating cream-to-dark step sections.
* **Synchronized Outline Progress:** Toggling checkable notebooks in a step automatically propagates progress up to the step milestone. Checking modules in the *Book Outline* tab updates the *Roadmap Steps* checklist in real-time.
* **Commitment-Based Pacing:** The *Timeline Planner* tab calculates calendar completion dates and track percentages dynamically based on your daily study commitment (1, 1.5, or 2 hours/day).
* **Dual-Mode State Sync:**
  * **Local Dev Mode:** Automatically writes your checked progress to `roadmap-state.json` on your disk via Vite server middleware.
  * **Cloud Mode:** If deployed, the app switches to `☁ Cloud Mode` using browser `localStorage` and disables server endpoints. Click the **Export Progress** button in the header to copy your progress JSON string and paste it to your Gemini CLI agent.

---

## 🛠️ Getting Started

### 1. Run the App Locally
Clone the project, install packages, and launch the Vite development server:
```bash
npm install
npm run dev
```
Open [http://localhost:5173/ai-roadmap/](http://localhost:5173/ai-roadmap/) in your browser. The app displays `● Disk Synced` to confirm connection to your local file.

### 2. Deployed Bookmark Link
The app is live and publicly hosted on GitHub Pages:
👉 [https://yashr7.github.io/ai-roadmap/](https://yashr7.github.io/ai-roadmap/)

---

## 🔁 Second Brain Obsidian Integration

When you check off tasks in the browser, your progress is saved to `roadmap-state.json` (locally) or copied via **Export Progress** (on the cloud).

To sync your learnings to your Obsidian vault:
1. In your Gemini CLI session, say **"sync"** or **"sync my learnings"** (optionally pasting your exported JSON).
2. The agent will read your progress, fetch the relevant chapter notes under `Reference/` (or author summaries in `aie-book` if missing), parse the completed Udemy code files, and compile them into your Obsidian Second Brain under `02-Knowledge/AI/AI Engineering.md`.
3. The sync script automatically logs the entry in your root `log.md`, updates the `AI Index.md`, and runs Git commands to commit and push the updates online to your vault repository.

---

## 📁 Repository Structure
```text
ai-roadmap/
├── public/                 # Static assets (Favicons, vector icons)
├── src/
│   ├── App.jsx             # Main interactive application & state handlers
│   ├── index.css           # Custom property token styling (DESIGN.md)
│   └── main.jsx            # Vite entry point
├── Reference/              # Local PDF book and chapter clippings (Git-ignored)
├── roadmap-state.json      # Auto-saved interactive progress JSON (Git-ignored)
├── vite.config.js          # Vite configuration & local save-state middleware
└── package.json            # Deployment scripts (gh-pages)
```
