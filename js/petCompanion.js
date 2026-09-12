/**
 * Interactive Pet Companion for Lily
 * Sparkle gives cheerful feedback, emotional reactions, and dance encouragement.
 */

class PetCompanion {
  constructor(storage, sounds) {
    this.storage = storage;
    this.sounds = sounds;
    this.emotions = ['happy', 'excited', 'thinking', 'celebrating', 'dancing'];
    this.currentEmotion = 'happy';

    this.cheerQuotes = [
      "You have such a brilliant brain, Lily! 🌟",
      "Winding Creek 1st graders are the smartest! 🏫",
      "You're solving these like a real GATE detective! 🔍",
      "I love learning new mysteries with you! 🦄",
      "Keep shining! Almost time for a Danny Go dance! 💃",
      "Wow, look at those thinking gears turn! ⚙️✨",
      "High-five, Lily! You are unstoppable! 🖐️",
      "Every puzzle makes your brain muscle stronger! 💪"
    ];
  }

  getCurrentPet() {
    const profile = this.storage.getProfile();
    const petConfig = CONFIG.pets.find(p => p.id === profile.pet) || CONFIG.pets[0];
    return {
      ...petConfig,
      customName: profile.petName || petConfig.name
    };
  }

  getRandomCheer() {
    return this.cheerQuotes[Math.floor(Math.random() * this.cheerQuotes.length)];
  }

  setEmotion(emotion) {
    this.currentEmotion = emotion;
    this.render();
  }

  render(containerElement) {
    if (!containerElement) return;
    const pet = this.getCurrentPet();

    containerElement.innerHTML = `
      <div class="pet-wrapper ${this.currentEmotion}">
        <div class="pet-speech-bubble" id="pet-speech">
          "${this.getRandomCheer()}"
        </div>
        <div class="pet-avatar" id="pet-avatar-click">
          <span class="pet-emoji">${pet.emoji}</span>
          <div class="pet-sparkles">✨</div>
        </div>
        <div class="pet-name-badge">
          <span>${pet.customName}</span>
          <span class="pet-lvl">Lv. ${this.storage.getProfile().level || 1}</span>
        </div>
      </div>
    `;

    const avatar = containerElement.querySelector('#pet-avatar-click');
    if (avatar) {
      avatar.addEventListener('click', () => {
        this.sounds.playPop();
        this.setEmotion('excited');
        const speech = containerElement.querySelector('#pet-speech');
        if (speech) {
          const quote = this.getRandomCheer();
          speech.textContent = `"${quote}"`;
          this.sounds.speak(quote);
        }
      });
    }
  }
}
