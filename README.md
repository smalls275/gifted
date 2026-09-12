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
* **No-Repeat Question Engine:** A huge bank of 1,500+ curated and procedurally-generated questions (40+ generators across math, verbal, matrix, spatial, logic, and science) with a rolling exclusion window so Lily never sees the same question looping back too soon.
* **Composite GATE Readiness Score:** Real-time percentage indicator of readiness for SCPS gifted screening.

### 2. 💃 Danny Go! Dance Party Rewards
* **Active Screen-Time Balance:** Solves the sedentary screen problem by rewarding academic milestones with Danny Go dance breaks.
* **Energy Charge Meter:** Every 20 stars earned unlocks a Danny Go! Dance Party.
* **Curated Video Dance Player:** Embeds high-energy Danny Go! favorites:
  * 🌋 *The Floor Is Lava!*
  * 🦍 *Gorilla Smash!*
  * ❄️ *The Ice King Freeze Dance!*
  * 🐛 *The Wiggle Dance!*
  * 🔥❄️ *Fire and Ice Freeze Dance!*
  * 🤖 *The Robot Dance!*
  * 🦖 *The Dinosaur Dance!*
  * 🚀 *Space Race! Planet Dance*
* **Pure Reward, No Strings Attached:** Dance breaks don't cost or grant any in-game money — they're purely a fun movement break earned by completing puzzles.

### 3. 🔊 Kid-Friendly Voice Narration (TTS) & Web Audio
* **Built-in Text-to-Speech:** Automatically reads questions, clues, and feedback out loud with child-friendly phrasing.
* **Synthesized Audio:** Harmonious arpeggio chimes and encouraging sounds without harsh buzzers.

### 4. 🏆 Gamification, Stickers & Pet Companion
* **Sparkle the Pet Companion:** Custom interactive pet (Sparkle the Unicorn, Bowie the Star Pup, Pip the Hop Bunny, Luna the Star Cat, or Nova the Baby Dragon) that offers encouraging affirmations and celebrates victories.
* **64 Collectible Trophies:** Unlocked for streaks, per-domain mastery tiers, total puzzles solved, dance milestones, and sticker collecting.
* **Real-Money Economy:** Correct answers, streaks, and trophies earn real money (shown as dollars & cents) instead of an abstract currency — a gentle, natural way to practice counting money.
* **Magical Sticker Studio:** Spend earned money on 112 collectible stickers and decorate a personal star display board.

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

The application is built with standard Web technologies (HTML5, CSS3, vanilla JavaScript, Web Audio API, Web Speech API):
* **Laptops & Desktops:** Chrome, Edge, Safari, Firefox.
* **iPads & Tablets:** Large touch targets, responsive touch controls.
* **Smartphones (iPhone & Android):** Mobile-first layouts with single-hand reachability.
* **Zero Dependencies / No Build Step Required:** Double click `index.html` to run directly from disk — plain `<script>` tags are used instead of ES modules specifically so it works over `file://` without a server.

---

## 🚀 Deployment to GitHub Pages

This repository is pushed to [github.com/smalls275/gifted](https://github.com/smalls275/gifted) and is live at:
`https://smalls275.github.io/gifted/`

It deploys automatically via GitHub's built-in branch-based Pages hosting — no custom build step or Actions workflow is needed since this is a static site with zero dependencies.

### One-time setup (if re-creating this repo):
1. Go to **Settings** > **Pages** on the [gifted repository](https://github.com/smalls275/gifted/settings/pages).
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Choose the `main` branch and `/ (root)` folder.
4. Every push to `main` redeploys automatically, typically within 15-45 seconds.

---

## 📊 Parent & Educator Analytics Portal

Click on **Parent Portal** in the navigation bar to access:
* **Composite GATE Readiness Score** (%)
* **Per-Domain Accuracy and Adaptive Difficulty Level**
* **Diagnostic Recommendations** for target study areas
* **JSON Progress Export/Backup**
