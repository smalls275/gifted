/**
 * Main Application Controller - Lily's GATE Adventure
 * Connects UI views, adaptive engine, pet companion, audio, and Danny Go rewards.
 */

class App {
  constructor() {
    this.storage = new StorageManager();
    this.adaptiveEngine = new AdaptiveEngine(QUESTION_BANK, this.storage);
    this.pet = new PetCompanion(this.storage, sounds);
    this.dannyGo = new DannyGoRewards(this.storage, sounds);

    this.currentScreen = 'home-view';
    this.currentQuestion = null;
    this.currentCategoryFilter = null;
    this.selectedAnswerIndex = null;
    this.isAnswerSubmitted = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupNavigation();
    this.updateHeaderStats();
    this.showScreen('home-view');

    window.addEventListener('app:refresh', () => {
      this.updateHeaderStats();
      this.renderCurrentView();
    });
  }

  setupNavigation() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-nav');
        sounds.playPop();
        if (target === 'game-view') {
          this.currentCategoryFilter = null;
          this.loadNextQuestion();
        }
        this.showScreen(target);
      });
    });
  }

  showScreen(screenId) {
    this.currentScreen = screenId;
    sounds.stopSpeech();

    document.querySelectorAll('.app-screen').forEach(scr => {
      scr.classList.add('hidden');
    });

    const active = document.getElementById(screenId);
    if (active) {
      active.classList.remove('hidden');
    }

    // Highlight active nav item
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-nav') === screenId);
    });

    this.renderCurrentView();
  }

  renderCurrentView() {
    this.updateHeaderStats();

    try {
      switch (this.currentScreen) {
        case 'home-view':
          this.renderHome();
          break;
        case 'game-view':
          // Question is rendered by loadNextQuestion / renderQuestion
          break;
        case 'topics-view':
          this.renderTopics();
          break;
        case 'dance-view':
          this.dannyGo.renderDanceLobby(document.getElementById('dance-lobby-container'));
          break;
        case 'stickers-view':
          this.renderStickers();
          break;
        case 'badges-view':
          this.renderBadges();
          break;
        case 'parent-view':
          this.renderParentDashboard();
          break;
      }
    } catch (e) {
      console.error(`Error rendering ${this.currentScreen}`, e);
      const container = document.getElementById(this.currentScreen);
      if (container) {
        container.innerHTML = `
          <div style="max-width:500px;margin:40px auto;padding:20px;background:#FFF7ED;border:2px solid #FDBA74;border-radius:16px;text-align:center;">
            <p>😅 This screen had trouble loading. Try tapping Home and coming back!</p>
          </div>
        `;
      }
    }
  }

  updateHeaderStats() {
    const state = this.storage.getState();
    const profile = state.profile;
    const progress = this.storage.getDanceProgress();

    const starCount = document.getElementById('stat-stars');
    const gemCount = document.getElementById('stat-gems');
    const streakCount = document.getElementById('stat-streak');
    const studentName = document.getElementById('header-student-name');
    const headerDanceBadge = document.getElementById('header-dance-badge');

    if (starCount) starCount.textContent = profile.stars;
    if (gemCount) gemCount.textContent = formatMoney(profile.moneyCents);
    if (streakCount) streakCount.textContent = state.currentStreak;
    if (studentName) studentName.textContent = profile.name;

    if (headerDanceBadge) {
      headerDanceBadge.classList.toggle('ready-pulse', this.storage.isDannyGoReady());
      headerDanceBadge.querySelector('.dance-count-text').textContent = `${progress.current}/${progress.target} ⭐`;
    }
  }

  renderHome() {
    const homeContainer = document.getElementById('home-container');
    if (!homeContainer) return;

    const state = this.storage.getState();
    const profile = state.profile;
    const gateScore = this.adaptiveEngine.calculateGATEComposite();
    const weakest = this.adaptiveEngine.getWeakestDomains();
    const danceReady = this.storage.isDannyGoReady();

    homeContainer.innerHTML = `
      <div class="welcome-hero-card">
        <div class="hero-left">
          <div class="welcome-tag">🎒 Welcome, ${profile.name}! • ${profile.school}</div>
          <h1 class="hero-title">Ready for Today's Brain Adventure?</h1>
          <p class="hero-desc">Explore fun puzzles in Math, Logic, Word Mysteries, and Spatial Shapes tailored for the Stafford County Gifted Program!</p>
          
          <div class="hero-actions">
            <button class="btn-primary-play" id="btn-play-smart">
              <span class="btn-icon">🚀</span>
              <div class="btn-text-block">
                <strong>Smart Adaptive Play</strong>
                <small>AI chooses the best puzzles for your brain</small>
              </div>
            </button>
            <button class="btn-secondary-topics" data-nav="topics-view">
              <span class="btn-icon">📚</span>
              <span>Pick a Topic</span>
            </button>
          </div>
        </div>

        <div class="hero-right" id="pet-home-slot">
          <!-- Pet companion loaded here -->
        </div>
      </div>

      ${danceReady ? `
        <div class="dance-ready-banner" id="banner-dance-now">
          <div class="dance-banner-icon">🎉 🕺</div>
          <div class="dance-banner-text">
            <h3>DANNY GO! DANCE BREAK IS READY!</h3>
            <p>You have earned enough stars! Click here to dance and get moving!</p>
          </div>
          <button class="btn-dance-banner-action">Let's Dance! 💃</button>
        </div>
      ` : ''}

      <div class="dashboard-grid">
        <div class="dash-card gate-readiness-card">
          <div class="dash-card-header">
            <h3>🧠 GATE Readiness Tracker</h3>
            <span class="score-pill">${gateScore}% Ready</span>
          </div>
          <div class="readiness-bar-track">
            <div class="readiness-bar-fill" style="width: ${gateScore}%"></div>
          </div>
          <p class="dash-card-sub">Stafford County Gifted Screening Readiness (1st Grade FOCUS)</p>
          <div class="weak-focus-list">
            <strong>🎯 Suggested Brain Focus:</strong>
            ${weakest.slice(0, 2).map(w => {
              const cat = CONFIG.categories.find(c => c.id === w.catId);
              return `<span class="focus-tag">${cat ? cat.name : w.catId} (${w.percent}%)</span>`;
            }).join(' ')}
          </div>
        </div>

        <div class="dash-card quick-category-grid">
          <div class="dash-card-header">
            <h3>🧩 Quick Practice Zones</h3>
            <button class="link-see-all" data-nav="topics-view">View All →</button>
          </div>
          <div class="category-chip-row">
            ${CONFIG.categories.slice(0, 4).map(cat => `
              <div class="cat-chip" data-category="${cat.id}" style="border-left: 4px solid ${cat.color}">
                <span class="chip-icon">${cat.icon}</span>
                <span class="chip-name">${cat.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.pet.render(homeContainer.querySelector('#pet-home-slot'));

    // Bind Home screen events
    const playSmartBtn = homeContainer.querySelector('#btn-play-smart');
    if (playSmartBtn) {
      playSmartBtn.addEventListener('click', () => {
        sounds.playPop();
        this.currentCategoryFilter = null;
        this.loadNextQuestion();
        this.showScreen('game-view');
      });
    }

    const danceBanner = homeContainer.querySelector('#banner-dance-now');
    if (danceBanner) {
      danceBanner.addEventListener('click', () => {
        sounds.playPop();
        this.showScreen('dance-view');
      });
    }

    homeContainer.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-category');
        sounds.playPop();
        this.currentCategoryFilter = catId;
        this.loadNextQuestion();
        this.showScreen('game-view');
      });
    });

    homeContainer.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-nav');
        sounds.playPop();
        this.showScreen(target);
      });
    });
  }

  loadNextQuestion() {
    this.selectedAnswerIndex = null;
    this.isAnswerSubmitted = false;

    const nextObj = this.adaptiveEngine.getNextQuestion(this.currentCategoryFilter);
    // Reshuffle option order every time so the correct answer's position can't be memorized
    this.currentQuestion = this.shuffleQuestionOptions(nextObj.question);
    this.isReviewQuestion = nextObj.isReview;

    this.renderQuestion();
  }

  shuffleQuestionOptions(original) {
    const tagged = original.options.map((opt, idx) => ({ ...opt, __correct: idx === original.correctIndex }));
    for (let i = tagged.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
    }
    const correctIndex = tagged.findIndex(o => o.__correct);
    return {
      ...original,
      options: tagged.map(({ __correct, ...rest }) => rest),
      correctIndex
    };
  }

  renderQuestion() {
    const q = this.currentQuestion;
    if (!q) return;

    const container = document.getElementById('game-arena-container');
    if (!container) return;

    const cat = CONFIG.categories.find(c => c.id === q.category) || { name: q.category, color: "#3B82F6", icon: "✨" };
    const difficultyLabels = ["Warmup 🌱", "1st Grade SOL 📘", "Gifted Challenge 🌟", "Super Genius 👑"];
    const diffLabel = difficultyLabels[q.difficulty - 1] || "Level " + q.difficulty;

    container.innerHTML = `
      <div class="game-top-bar">
        <div class="category-indicator" style="background: ${cat.color}22; color: ${cat.color}; border: 1.5px solid ${cat.color}">
          <span>${cat.icon}</span>
          <strong>${cat.name}</strong>
        </div>

        <div class="difficulty-indicator">
          <span class="diff-badge diff-${q.difficulty}">${diffLabel}</span>
          <span class="standard-subtag">${q.standard}</span>
        </div>

        <button class="btn-read-aloud" id="btn-read-aloud" title="Read question out loud">
          <span class="speaker-icon">🔊</span>
          <span>Read Aloud</span>
        </button>
      </div>

      <div class="question-box">
        <h2 class="question-prompt">${q.prompt}</h2>
      </div>

      <div class="visual-stage-area" id="visual-stage">
        ${this.renderVisualStage(q)}
      </div>

      <div class="answer-options-grid">
        ${q.options.map((opt, idx) => `
          <button class="btn-option" data-index="${idx}">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <div class="option-content">
              ${opt.icon ? `<span class="opt-icon">${opt.icon}</span>` : ''}
              <span class="opt-text">${opt.text}</span>
            </div>
          </button>
        `).join('')}
      </div>

      <div class="game-bottom-bar">
        <button class="btn-hint-trigger" id="btn-show-hint">
          <span>💡 Need a Clue?</span>
        </button>
        <button class="btn-submit-answer disabled" id="btn-submit-action" disabled>
          <span>Check My Answer ✨</span>
        </button>
      </div>

      <div class="hint-drawer hidden" id="hint-drawer">
        <div class="hint-content">
          <strong>🔍 Detective Clue:</strong>
          <p>${q.hint}</p>
        </div>
      </div>

      <div class="feedback-modal hidden" id="feedback-modal"></div>
    `;

    // Speak question aloud automatically if enabled
    if (this.storage.getState().parentSettings.voiceNarration) {
      setTimeout(() => {
        sounds.speak(q.prompt);
      }, 300);
    }

    // Bind Question screen events
    const readBtn = container.querySelector('#btn-read-aloud');
    if (readBtn) {
      readBtn.addEventListener('click', () => {
        sounds.playPop();
        sounds.speak(q.prompt);
      });
    }

    const hintBtn = container.querySelector('#btn-show-hint');
    const hintDrawer = container.querySelector('#hint-drawer');
    if (hintBtn && hintDrawer) {
      hintBtn.addEventListener('click', () => {
        sounds.playPop();
        hintDrawer.classList.toggle('hidden');
        sounds.speak(`Here is a clue: ${q.hint}`);
      });
    }

    const optionBtns = container.querySelectorAll('.btn-option');
    const submitBtn = container.querySelector('#btn-submit-action');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isAnswerSubmitted) return;
        sounds.playPop();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        this.selectedAnswerIndex = idx;

        optionBtns.forEach(b => b.classList.remove('selected'));
        e.currentTarget.classList.add('selected');

        submitBtn.disabled = false;
        submitBtn.classList.remove('disabled');

        // Optional speech for the selected option
        const optText = q.options[idx].text;
        sounds.speak(optText);
      });
    });

    submitBtn.addEventListener('click', () => {
      this.handleAnswerSubmission();
    });
  }

  renderVisualStage(q) {
    if (q.visualType === 'matrix_2x2') {
      const d = q.visualData;
      return `
        <div class="matrix-2x2-board">
          <div class="matrix-cell tl">${this.renderShapeIcon(d.tl)}</div>
          <div class="matrix-cell tr">${this.renderShapeIcon(d.tr)}</div>
          <div class="matrix-cell bl">${this.renderShapeIcon(d.bl)}</div>
          <div class="matrix-cell br question-target">❓</div>
        </div>
      `;
    } else if (q.visualType === 'balance_scale') {
      return `
        <div class="balance-scale-stage">
          <div class="scale-beam">
            <div class="scale-pan left-pan">
              <span class="pan-item">${q.visualData.left}</span>
            </div>
            <div class="scale-fulcrum">⚖️</div>
            <div class="scale-pan right-pan">
              <span class="pan-item">${q.visualData.right}</span>
            </div>
          </div>
          <div class="scale-caption">Equal Balance (=)</div>
        </div>
      `;
    } else if (q.visualType === 'sequence' || q.visualType === 'stones' || q.visualType === 'rotation_sequence' || q.visualType === 'math_expression') {
      const items = q.visualData.items || q.visualData.values || q.visualData.steps || [];
      return `
        <div class="sequence-stage">
          ${items.map(item => `
            <div class="seq-item ${item === '?' || item === '❓' ? 'target' : ''}">${item}</div>
          `).join('<div class="seq-arrow">➔</div>')}
        </div>
      `;
    } else if (q.visualType === 'coins') {
      return `
        <div class="coins-stage">
          ${q.visualData.coins.map(c => `<div class="coin-item">🪙 ${c}</div>`).join('')}
        </div>
      `;
    } else if (q.visualType === 'analogy') {
      return `
        <div class="analogy-stage">
          <div class="analogy-box first-box">${q.visualData.pair1}</div>
          <div class="analogy-bridge">AS</div>
          <div class="analogy-box second-box">${q.visualData.pair2}</div>
        </div>
      `;
    } else if (q.visualType === 'logic_grid' || q.visualType === 'treasure_chests' || q.visualType === 'height_order' || q.visualType === 'race_order' || q.visualType === 'backpack_logic') {
      return `
        <div class="mystery-clue-stage">
          <div class="mystery-icon">🕵️‍♀️</div>
          <div class="mystery-clue-bubble">
            ${q.prompt.split('\n').filter(l => l.startsWith('•')).map(l => `<div class="clue-line">${l}</div>`).join('')}
          </div>
        </div>
      `;
    }

    return `<div class="standard-visual-badge">🌟 Stafford Gifted Challenge</div>`;
  }

  renderShapeIcon(item) {
    if (!item) return '';
    if (typeof item === 'string') return item;
    const color = item.color || '#3B82F6';
    const shape = item.shape || 'circle';

    if (shape === 'circle') {
      return `<svg width="50" height="50"><circle cx="25" cy="25" r="20" fill="${color}" /></svg>`;
    } else if (shape === 'square') {
      return `<svg width="50" height="50"><rect x="5" y="5" width="40" height="40" rx="4" fill="${color}" /></svg>`;
    } else if (shape === 'triangle') {
      return `<svg width="50" height="50"><polygon points="25,5 45,45 5,45" fill="${color}" /></svg>`;
    } else if (shape === 'star') {
      return `<svg width="50" height="50" viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" fill="${color}" /></svg>`;
    } else if (shape === 'heart') {
      return `<span style="font-size: 2.2rem; color: ${color}">💖</span>`;
    } else if (shape === 'diamond') {
      return `<span style="font-size: 2.2rem; color: ${color}">🔷</span>`;
    }
    return item.desc || '🔷';
  }

  handleAnswerSubmission() {
    if (this.isAnswerSubmitted || this.selectedAnswerIndex === null) return;
    this.isAnswerSubmitted = true;

    const q = this.currentQuestion;
    const isCorrect = this.selectedAnswerIndex === q.correctIndex;
    const feedbackModal = document.getElementById('feedback-modal');
    const optionBtns = document.querySelectorAll('.btn-option');

    // Update button visual styles
    optionBtns.forEach((btn, idx) => {
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === this.selectedAnswerIndex) {
        btn.classList.add('wrong');
      }
    });

    const result = this.adaptiveEngine.recordResult(q.id, isCorrect);
    this.updateHeaderStats();

    if (isCorrect) {
      sounds.playCorrect();
      this.pet.setEmotion('celebrating');
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }

      feedbackModal.innerHTML = `
        <div class="feedback-card correct-card">
          <div class="feedback-header">
            <span class="feedback-emoji">🌟 🎉 🌟</span>
            <h3>Brilliant Job, Lily!</h3>
            <span class="reward-pill">+1 Star ⭐</span>
          </div>
          <p class="feedback-explanation">${q.explanation}</p>
          ${result.leveledUp ? `
            <div class="level-up-notice">
              🎉 <strong>Level Up!</strong> Difficulty increased to Level ${result.newLevel}!
            </div>
          ` : ''}
          ${result.unlockedBadges.length > 0 ? `
            <div class="unlocked-badge-notice">
              🏆 <strong>New Badge Unlocked:</strong> ${result.unlockedBadges.map(b => `${b.icon} ${b.name}`).join(', ')}!
            </div>
          ` : ''}
          <div class="feedback-actions">
            <button class="btn-next-question" id="btn-next-q">
              Next Brain Adventure! ➔
            </button>
          </div>
        </div>
      `;

      sounds.speak(`Brilliant job, Lily! ${q.explanation}`);
    } else {
      sounds.playTryAgain();
      this.pet.setEmotion('thinking');

      feedbackModal.innerHTML = `
        <div class="feedback-card wrong-card">
          <div class="feedback-header">
            <span class="feedback-emoji">💡</span>
            <h3>Great Try! Let's Learn Together!</h3>
          </div>
          <p class="feedback-explanation">${q.explanation}</p>
          <div class="feedback-actions">
            <button class="btn-next-question" id="btn-next-q">
              Got It! Next Puzzle ➔
            </button>
          </div>
        </div>
      `;

      sounds.speak(`Great try! ${q.explanation}`);
    }

    feedbackModal.classList.remove('hidden');

    const nextBtn = feedbackModal.querySelector('#btn-next-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sounds.playPop();
        feedbackModal.classList.add('hidden');

        // Check if Danny Go dance party was just unlocked!
        if (this.storage.isDannyGoReady()) {
          this.showScreen('dance-view');
        } else {
          this.loadNextQuestion();
        }
      });
    }
  }

  renderTopics() {
    const container = document.getElementById('topics-container');
    if (!container) return;

    const mastery = this.adaptiveEngine.getDomainMastery();

    container.innerHTML = `
      <div class="topics-header">
        <h2>Curriculum & Gifted Practice Domains</h2>
        <p>Pick a specific subject to train your brain in Virginia SOL & Stafford County Gifted competencies.</p>
      </div>

      <div class="topics-grid">
        ${CONFIG.categories.map(cat => {
          const m = mastery[cat.id] || { percent: 0, level: 1, status: 'Not Started' };
          return `
            <div class="topic-card" style="border-top: 6px solid ${cat.color}">
              <div class="topic-icon-badge" style="background: ${cat.color}22; color: ${cat.color}">
                ${cat.icon}
              </div>
              <h3>${cat.name}</h3>
              <p class="topic-desc">${cat.desc}</p>
              <div class="topic-standard-badge">${cat.standard}</div>

              <div class="topic-mastery-section">
                <div class="mastery-labels">
                  <span>Brain Mastery</span>
                  <strong>${m.percent}%</strong>
                </div>
                <div class="mastery-track">
                  <div class="mastery-fill" style="width: ${m.percent}%; background: ${cat.color}"></div>
                </div>
                <div class="mastery-sub">
                  <span>Level: ${m.level}/4</span>
                  <span>${m.status}</span>
                </div>
              </div>

              <button class="btn-start-topic" data-category="${cat.id}">
                Practice ${cat.name} ➔
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-start-topic').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-category');
        sounds.playPop();
        this.currentCategoryFilter = catId;
        this.loadNextQuestion();
        this.showScreen('game-view');
      });
    });
  }

  renderStickers() {
    const container = document.getElementById('stickers-container');
    if (!container) return;

    const state = this.storage.getState();
    const profile = state.profile;
    const unlocked = state.unlockedStickers || [];

    container.innerHTML = `
      <div class="stickers-header">
        <div class="stickers-title-wrap">
          <h2>🎨 Lily's Magical Sticker Studio</h2>
          <p>Use the money you earned to collect cute stickers and decorate your room!</p>
        </div>
        <div class="gem-purse">
          <span>💰 Lily's Money:</span>
          <strong>${formatMoney(profile.moneyCents)}</strong>
        </div>
      </div>

      <div class="sticker-shop-shelf">
        <h3>🛍️ Sticker Shop</h3>
        <div class="sticker-items-row">
          ${CONFIG.stickers.map(st => {
            const isOwned = unlocked.includes(st.id);
            return `
              <div class="sticker-card ${isOwned ? 'owned' : ''}">
                <div class="sticker-emoji-display">${st.emoji}</div>
                <div class="sticker-name">${st.name}</div>
                ${isOwned 
                  ? `<span class="owned-tag">✨ Owned</span>` 
                  : `<button class="btn-buy-sticker" data-id="${st.id}" data-cost="${st.costCents}">Buy for ${formatMoney(st.costCents)}</button>`}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="sticker-canvas-area">
        <div class="canvas-header">
          <h3>🖼️ Lily's Star Display Board</h3>
          <button class="btn-clear-canvas" id="btn-clear-canvas">Clear Board</button>
        </div>
        <div class="canvas-dropzone" id="sticker-board">
          ${state.placedStickers.length === 0 
            ? `<div class="empty-canvas-prompt">Tap any of your owned stickers above to place them on your canvas! ✨</div>` 
            : state.placedStickers.map(ps => `<div class="placed-sticker" style="left: ${ps.x}px; top: ${ps.y}px">${ps.emoji}</div>`).join('')}
        </div>
      </div>
    `;

    // Bind sticker shop purchase
    container.querySelectorAll('.btn-buy-sticker').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const cost = parseInt(e.currentTarget.getAttribute('data-cost'));
        if (this.storage.buySticker(id, cost)) {
          sounds.playStarCollect();
          sounds.speak("Yay! New sticker added to your collection!");
          if (window.confetti) {
            window.confetti({ particleCount: 50, spread: 60 });
          }
          this.renderStickers();
          this.updateHeaderStats();
        } else {
          sounds.playTryAgain();
          sounds.speak("You need more money! Solve more puzzles or dance with Danny Go to earn more!");
        }
      });
    });

    // Tap owned stickers to place them on canvas
    container.querySelectorAll('.sticker-card.owned').forEach(card => {
      card.addEventListener('click', (e) => {
        const emoji = card.querySelector('.sticker-emoji-display').textContent;
        sounds.playPop();
        const x = Math.floor(Math.random() * 250) + 20;
        const y = Math.floor(Math.random() * 150) + 20;
        this.storage.placeSticker({ emoji, x, y });
        this.renderStickers();
      });
    });

    const clearBtn = container.querySelector('#btn-clear-canvas');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sounds.playPop();
        this.storage.clearPlacedStickers();
        this.renderStickers();
      });
    }
  }

  renderBadges() {
    const container = document.getElementById('badges-container');
    if (!container) return;

    const state = this.storage.getState();
    const unlocked = state.unlockedBadges || [];

    container.innerHTML = `
      <div class="badges-header">
        <h2>🏆 Trophy & Honor Vault</h2>
        <p>Badges earned for Stafford County Gifted readiness, streaks, and Danny Go dance breakthroughs!</p>
      </div>

      <div class="badges-grid">
        ${CONFIG.badges.map(b => {
          const isUnlocked = unlocked.includes(b.id);
          return `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
              <div class="badge-icon-wrap">
                <span class="badge-emoji">${b.icon}</span>
              </div>
              <h3>${b.name}</h3>
              <p>${b.desc}</p>
              <div class="badge-status-pill">
                ${isUnlocked ? '🌟 UNLOCKED (+3 💎)' : '🔒 Locked'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderParentDashboard() {
    const container = document.getElementById('parent-container');
    if (!container) return;

    const state = this.storage.getState();
    const mastery = this.adaptiveEngine.getDomainMastery();
    const compositeScore = this.adaptiveEngine.calculateGATEComposite();
    const weakest = this.adaptiveEngine.getWeakestDomains();

    container.innerHTML = `
      <div class="parent-header">
        <div class="parent-title-wrap">
          <h2>📊 Parent & Educator Analytics Portal</h2>
          <p>Winding Creek Elementary School • Stafford County Public Schools (SCPS) Gifted Identification Tracking</p>
        </div>
        <div class="gate-composite-badge">
          <span>Composite GATE Readiness</span>
          <strong>${compositeScore}%</strong>
        </div>
      </div>

      <div class="parent-summary-grid">
        <div class="parent-stat-box">
          <span>Total Solved</span>
          <strong>${state.totalSolved}</strong>
        </div>
        <div class="parent-stat-box">
          <span>Total Correct</span>
          <strong>${state.totalCorrect}</strong>
        </div>
        <div class="parent-stat-box">
          <span>Best Streak</span>
          <strong>${state.bestStreak} 🔥</strong>
        </div>
        <div class="parent-stat-box">
          <span>Danny Go Dance Breaks</span>
          <strong>${state.dancesCompleted} 💃</strong>
        </div>
      </div>

      <div class="parent-section">
        <h3>🎯 Domain Mastery & Standards Matrix</h3>
        <table class="standards-table">
          <thead>
            <tr>
              <th>Domain / Battery</th>
              <th>Standards Alignment</th>
              <th>Mastery</th>
              <th>Adaptive Level</th>
              <th>Accuracy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${CONFIG.categories.map(cat => {
              const m = mastery[cat.id] || { percent: 0, level: 1, attempts: 0, correct: 0, accuracy: 0, status: 'Not Started' };
              return `
                <tr>
                  <td><strong>${cat.icon} ${cat.name}</strong></td>
                  <td><small>${cat.standard}</small></td>
                  <td>
                    <div class="table-progress">
                      <div class="table-fill" style="width: ${m.percent}%; background: ${cat.color}"></div>
                      <span>${m.percent}%</span>
                    </div>
                  </td>
                  <td>Level ${m.level} / 4</td>
                  <td>${m.correct} / ${m.attempts} (${m.accuracy}%)</td>
                  <td><span class="status-badge">${m.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="parent-section diagnostics-box">
        <h3>🧠 Adaptive Diagnostic Recommendations</h3>
        <p>The "plastic brain" engine continuously tracks response accuracy and escalates or de-escalates difficulty in real-time.</p>
        <ul>
          ${weakest.slice(0, 3).map(w => {
            const cat = CONFIG.categories.find(c => c.id === w.catId);
            return `<li><strong>Focus Recommendation:</strong> Provide additional reinforcement in <em>${cat ? cat.name : w.catId}</em> (Current Mastery: ${w.percent}%).</li>`;
          }).join('')}
          <li><strong>Physical Activity Integration:</strong> Danny Go! dance breaks are active every <strong>${state.parentSettings.dannyGoEveryNStars} stars</strong> to ensure healthy screen breaks and movement.</li>
        </ul>
      </div>

      <div class="parent-section data-controls">
        <h3>💾 Data Backup & Settings</h3>
        <div class="data-buttons-row">
          <button class="btn-parent-action" id="btn-export-data">📥 Export Progress Report (JSON)</button>
          <button class="btn-parent-action danger" id="btn-reset-data">⚠️ Reset Progress</button>
        </div>
      </div>
    `;

    // Export button
    const exportBtn = container.querySelector('#btn-export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const json = this.storage.exportDataJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lily_gate_prep_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Reset button
    const resetBtn = container.querySelector('#btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset Lily's progress? This will reset stars, badges, and levels.")) {
          this.storage.resetAllProgress();
          sounds.playPop();
          this.renderParentDashboard();
          this.updateHeaderStats();
        }
      });
    }
  }

  bindEvents() {
    // Sound & Speech Toggles
    const soundToggle = document.getElementById('btn-toggle-sound');
    const voiceToggle = document.getElementById('btn-toggle-voice');

    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const enabled = sounds.toggleSound();
        soundToggle.textContent = enabled ? '🔊 Sound On' : '🔇 Sound Off';
      });
    }

    if (voiceToggle) {
      voiceToggle.addEventListener('click', () => {
        const enabled = sounds.toggleSpeech();
        const state = this.storage.getState();
        state.parentSettings.voiceNarration = enabled;
        this.storage.save();
        voiceToggle.textContent = enabled ? '🗣️ Voice On' : '🤐 Voice Off';
      });
    }
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.app = new App();
  } catch (e) {
    // A total startup failure should never leave a silent blank page.
    console.error("Lily's GATE Adventure failed to start", e);
    const main = document.querySelector('.app-main') || document.body;
    main.innerHTML = `
      <div style="max-width:600px;margin:60px auto;padding:24px;background:#FFF7ED;border:2px solid #FDBA74;border-radius:16px;text-align:center;font-family:sans-serif;">
        <h2 style="margin-bottom:12px;">😅 Oops! The game had trouble starting.</h2>
        <p style="margin-bottom:16px;color:#7C2D12;">Please try refreshing the page. If this keeps happening, try a different browser (Chrome, Edge, or Safari work best).</p>
        <button onclick="location.reload()" style="padding:10px 20px;border-radius:50px;border:none;background:#F97316;color:#fff;font-weight:700;cursor:pointer;">Refresh & Try Again</button>
      </div>
    `;
  }
});
