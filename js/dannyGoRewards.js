/**
 * Danny Go! Reward & Dance Break Controller
 * Inspires Lily to get off the chair, dance, jump, and stay active!
 */

class DannyGoRewards {
  constructor(storage, sounds) {
    this.storage = storage;
    this.sounds = sounds;
    this.activeVideo = null;
  }

  getVideos() {
    return CONFIG.dannyGoVideos;
  }

  isUnlocked() {
    return this.storage.isDannyGoReady();
  }

  renderDanceLobby(container) {
    if (!container) return;
    const progress = this.storage.getDanceProgress();
    const isReady = this.isUnlocked();
    const videos = this.getVideos();
    const dancesDone = this.storage.getState().dancesCompleted || 0;

    container.innerHTML = `
      <div class="danny-lobby-header">
        <div class="danny-badge-tag">🌟 DANNY GO! DANCE CLUB 🕺</div>
        <h2>Dance & Get Moving with Danny Go!</h2>
        <p class="danny-subtitle">Earn ${progress.target} stars in your puzzles to unlock high-energy dance breaks that get you jumping and dancing!</p>
        
        <div class="dance-energy-meter">
          <div class="meter-info">
            <span>Dance Energy Charge</span>
            <strong>${progress.current} / ${progress.target} Stars</strong>
          </div>
          <div class="meter-bar-track">
            <div class="meter-bar-fill" style="width: ${progress.percent}%"></div>
          </div>
          <div class="meter-status">
            ${isReady 
              ? "🎉 <strong>DANCE PARTY UNLOCKED!</strong> Pick any video to start moving!" 
              : `⭐ Solve <strong>${progress.target - progress.current} more puzzles</strong> to fill your dance power!`}
          </div>
        </div>

        <div class="dance-stats-pill">
          <span>🏆 Total Dance Breaks Completed: <strong>${dancesDone}</strong></span>
          <span>🎉 Your Reward for Hard Work!</span>
        </div>
      </div>

      <div class="danny-video-grid">
        ${videos.map((vid, idx) => `
          <div class="danny-video-card ${isReady ? 'unlocked' : 'locked'}" data-id="${vid.id}">
            <div class="video-thumb-wrapper">
              <img src="${vid.thumbnail}" alt="${vid.title}" class="video-thumb" loading="lazy" />
              <div class="play-overlay">
                <span class="play-btn-icon">${isReady ? '▶️' : '🔒'}</span>
              </div>
              <span class="video-duration">${vid.duration}</span>
            </div>
            <div class="video-info">
              <h3>${vid.title}</h3>
              <p>${vid.desc}</p>
              <div class="video-action-tag">${vid.actionPrompt}</div>
              <button class="btn-start-dance" data-id="${vid.id}">
                ${isReady ? '💃 Start Dancing!' : `⭐ Need ${progress.target - progress.current} More Stars`}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Add click listeners to cards
    container.querySelectorAll('.btn-start-dance').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vidId = e.currentTarget.getAttribute('data-id');
        this.startDanceSession(vidId);
      });
    });
  }

  startDanceSession(videoId) {
    if (!this.isUnlocked()) {
      const progress = this.storage.getDanceProgress();
      this.sounds.playTryAgain();
      this.sounds.speak(`Solve ${progress.target - progress.current} more puzzles to unlock the dance party!`);
      return;
    }

    const video = CONFIG.dannyGoVideos.find(v => v.id === videoId) || CONFIG.dannyGoVideos[0];
    this.activeVideo = video;
    this.sounds.playFanfare();
    this.sounds.speak(`Danny Go dance party time! ${video.actionPrompt}`);

    const modal = document.getElementById('dance-party-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="dance-modal-overlay">
        <div class="dance-modal-content">
          <div class="dance-modal-header">
            <div class="party-lights">✨ 💃 🎶 🕺 ✨</div>
            <h2>${video.title}</h2>
            <div class="dance-action-banner">
              <strong>${video.actionPrompt}</strong>
            </div>
          </div>

          <div class="video-player-frame">
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1" 
              title="${video.title}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>

          <div class="dance-modal-footer">
            <div class="dance-timer-card">
              <span class="timer-emoji">⏱️</span>
              <span>Dance until the song ends, then celebrate your reward!</span>
            </div>
            <div class="dance-action-buttons">
              <button class="btn-complete-dance" id="btn-finish-dance">
                🎉 I Finished Dancing & Moving!
              </button>
              <button class="btn-close-dance" id="btn-close-dance-modal">
                Back to Puzzles
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');

    // Trigger confetti
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    const finishBtn = modal.querySelector('#btn-finish-dance');
    const closeBtn = modal.querySelector('#btn-close-dance-modal');

    finishBtn.addEventListener('click', () => {
      this.storage.recordDanceCompleted(video.id);
      this.sounds.playStarCollect();
      this.sounds.speak("Awesome dancing, Lily! Great job moving your body!");
      if (window.confetti) {
        window.confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      }
      modal.classList.add('hidden');
      modal.innerHTML = '';
      window.dispatchEvent(new CustomEvent('app:refresh'));
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.innerHTML = '';
      window.dispatchEvent(new CustomEvent('app:refresh'));
    });
  }
}
