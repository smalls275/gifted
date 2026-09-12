# 🦄 Lily's GATE Adventure
### Winding Creek Elementary School • Stafford County Public Schools (SCPS) Gifted Identification & 1st Grade Virginia SOL Prep Game

An intelligent, adaptive, web-based learning adventure designed especially for **Lily** (6 years old, 1st Grade) attending **Winding Creek Elementary School** in **Stafford, Virginia**. 

This application prepares Lily for the Stafford County Public Schools (SCPS) **Gifted and Talented Education (GATE / FOCUS)** screening process and masters all **Virginia Standards of Learning (SOL)** Grade 1 competencies through gamified challenges, positive reinforcement, and high-energy **Danny Go!** dance breaks that get her up and moving!

---

## 🌟 Key Features

### 1. 🧠 Plastic Adaptive Brain Engine
* **Dynamic Difficulty Scaling:** Seamlessly transitions through 4 tiers of difficulty:
  * **Level 1 (Warmup / Foundations):** Builds initial confidence with visual scaffolds.
  * **Level 2 (Virginia Grade 1 SOL Standard):** Tests on-grade Virginia competencies.
  * **Level 3 (Stafford FOCUS / Gifted Challenge):** Multi-step problem solving & lateral thinking.
  * **Level 4 (Super Genius / 99th Percentile CogAT):** Complex relational analogies & matrix transformations.
* **Weak-Point Focusing:** Intelligently analyzes Lily's response accuracy across all domains, automatically routing extra practice to areas needing reinforcement.
* **Spaced Repetition Review:** Re-tests previously missed concepts at optimal intervals.
* **Composite GATE Readiness Score:** Real-time percentage indicator of readiness for SCPS gifted screening.

### 2. 💃 Danny Go! Dance Party Rewards
* **Active Screen-Time Balance:** Solves the sedentary screen problem by rewarding academic milestones with Danny Go dance breaks.
* **Energy Charge Meter:** Every 5 stars earned unlocks a Danny Go! Dance Party.
* **Curated Video Dance Player:** Embeds high-energy Danny Go! favorites:
  * 🌋 *The Floor is Lava!*
  * 🦍 *Gorilla Smash!*
  * ❄️ *Freeze Dance!*
  * 🐛 *The Wiggle Dance!*
  * 🔥❄️ *Fire and Ice!*
  * 🤖 *The Robot Dance!*
  * 🦖 *Digging for Dinosaurs!*
  * 🚀 *Space Party Blastoff!*
* **Active Completion Bonus:** Lily earns +5 shiny Gems every time she completes a dance break!

### 3. 🔊 Kid-Friendly Voice Narration (TTS) & Web Audio
* **Built-in Text-to-Speech:** Automatically reads questions, clues, and feedback out loud with child-friendly phrasing.
* **Synthesized Audio:** Harmonious arpeggio chimes and encouraging sounds without harsh buzzers.

### 4. 🏆 Gamification, Stickers & Pet Companion
* **Sparkle the Pet Companion:** Custom interactive pet (Unicorn, Puppy, Bunny, Kitten, Dragon) that offers encouraging affirmations and celebrates victories.
* **24 Collectible Badges:** Unlocked for streaks, topic mastery, and dance milestones.
* **Magical Sticker Studio:** Exchange earned gems for fun stickers and decorate a personal star display board.

---

## 📚 Curriculum & Standards Alignment

The game is mapped to the exact educational and gifted identification standards used in **Stafford County, VA**:

| Domain | Assessment / Standard Alignment | Skills Covered |
| :--- | :--- | :--- |
| **🧩 Matrix & Patterns** | CogAT Nonverbal & NNAT3 | 2x2 Matrices, figure classification, pattern series, shape math. |
| **🔢 Math & Quant Logic** | Virginia SOL Math 1.1–1.15 & CogAT Quant | Tens & ones place value, skip counting (2s, 5s, 10s), equality balance scales ($\triangle + 4 = 10$), coins/time, multi-step word problems, fractions. |
| **🔍 Word Detective** | CogAT Verbal & VA SOL Reading 1.5–1.10 | Word analogies, category exclusion, context clue riddles, phonics rhyme deductions, opposites. |
| **📐 Spatial & Shapes** | NNAT3 Spatial Visualization & Geometry | Paper folding & hole punches, hidden 3D cube counts, mirror reflections, tangrams. |
| **🕵️‍♀️ Deductive Mysteries** | SCPS FOCUS Gifted Logic | Logic grid deduction, finish-line race ordering, elimination clues. |
| **🔬 Science Explorer** | VA Science SOL 1.1–1.7 & Inquiry | Living vs nonliving, plant life cycles, sun & shadow science, states of matter, sink or float, camouflage. |

---

## 📱 Cross-Platform Device Support

The application is built with standard Web technologies (HTML5, CSS3, ES Modules, Web Audio API, Web Speech API):
* **Laptops & Desktops:** Chrome, Edge, Safari, Firefox.
* **iPads & Tablets:** Large touch targets, responsive touch controls.
* **Smartphones (iPhone & Android):** Mobile-first layouts with single-hand reachability.
* **Zero Dependencies / No Build Step Required:** Double click `index.html` to run anywhere.

---

## 🚀 Deployment to GitHub Pages

This repository is pre-configured with a GitHub Actions workflow in `.github/workflows/deploy.yml` for automated GitHub Pages hosting.

### Steps to Deploy to `smalls275.github.io`:
1. Push this code to a new repository on GitHub (e.g. `https://github.com/smalls275/gate-prep`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Lily's GATE Adventure"
   git branch -M main
   git remote add origin https://github.com/smalls275/gate-prep.git
   git push -u origin main
   ```
2. In your GitHub repository settings:
   * Go to **Settings** > **Pages**.
   * Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The app will be live at:
   `https://smalls275.github.io/gate-prep/`

---

## 📊 Parent & Educator Analytics Portal

Click on **Parent Portal** in the navigation bar to access:
* **Composite GATE Readiness Score** (%)
* **Per-Domain Accuracy and Adaptive Difficulty Level**
* **Diagnostic Recommendations** for target study areas
* **JSON Progress Export/Backup**
