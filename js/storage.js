/**
 * Persistent Storage & Profile Manager
 * Handles local progress, star economy, badges, streaks, and data export.
 */

const STORAGE_KEY = 'lily_gate_adventure_v1';

class StorageManager {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      profile: { ...CONFIG.defaultStudent },
      categoryStats: {
        matrix_reasoning: { attempts: 0, correct: 0, level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] },
        math_logic: { attempts: 0, correct: 0, level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] },
        verbal_detective: { attempts: 0, correct: 0, level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] },
        spatial_folding: { attempts: 0, correct: 0, level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] },
        logic_mysteries: { attempts: 0, correct: 0, level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] },
        science_inquiry: { attempts: 0, correct: 0, level: 1, consecutiveCorrect: 0, consecutiveWrong: 0, history: [] }
      },
      unlockedBadges: [],
      unlockedStickers: ['s1'],
      placedStickers: [],
      totalSolved: 0,
      totalCorrect: 0,
      currentStreak: 0,
      bestStreak: 0,
      dancesCompleted: 0,
      starsSinceLastDance: 0,
      spacedRepetitionQueue: [],
      lastAnsweredId: null,
      lastActiveDate: new Date().toISOString().split('T')[0],
      parentSettings: {
        voiceNarration: true,
        soundEffects: true,
        dannyGoEveryNStars: 5,
        theme: 'magical_candy'
      }
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with defaults to ensure all keys exist (profile merged deeply so new fields survive)
        const merged = { ...this.getDefaultState(), ...parsed, profile: { ...this.getDefaultState().profile, ...parsed.profile } };
        this.migrateGemsToMoney(merged.profile);
        return merged;
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using defaults", e);
    }
    return this.getDefaultState();
  }

  // Converts old diamond ("gems") saves to the new money economy at $0.25 per gem
  migrateGemsToMoney(profile) {
    if (typeof profile.gems === 'number') {
      profile.moneyCents = Math.round(profile.gems * 25);
      delete profile.gems;
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  getState() {
    return this.state;
  }

  getProfile() {
    return this.state.profile;
  }

  getCategoryStats() {
    return this.state.categoryStats;
  }

  updateCategoryStat(catId, statObj) {
    this.state.categoryStats[catId] = statObj;
    this.save();
  }

  recordAnswer(questionId, isCorrect) {
    this.state.totalSolved += 1;
    this.state.lastAnsweredId = questionId;

    if (isCorrect) {
      this.state.totalCorrect += 1;
      this.state.currentStreak += 1;
      if (this.state.currentStreak > this.state.bestStreak) {
        this.state.bestStreak = this.state.currentStreak;
      }
      this.state.profile.stars += 1;
      this.state.starsSinceLastDance += 1;

      // Every 3 streak grants bonus money
      if (this.state.currentStreak % 3 === 0) {
        this.state.profile.moneyCents += 50;
      }
    } else {
      this.state.currentStreak = 0;
    }

    this.save();
  }

  addToReviewQueue(questionId) {
    if (!this.state.spacedRepetitionQueue.includes(questionId)) {
      this.state.spacedRepetitionQueue.push(questionId);
      this.save();
    }
  }

  removeFromReviewQueue(questionId) {
    this.state.spacedRepetitionQueue = this.state.spacedRepetitionQueue.filter(id => id !== questionId);
    this.save();
  }

  recordDanceCompleted(videoId) {
    this.state.dancesCompleted += 1;
    this.state.starsSinceLastDance = 0;
    this.state.profile.moneyCents += 100; // Reward $1.00 for dancing!
    this.save();
  }

  isDannyGoReady() {
    const threshold = this.state.parentSettings.dannyGoEveryNStars || 5;
    return this.state.starsSinceLastDance >= threshold;
  }

  getDanceProgress() {
    const threshold = this.state.parentSettings.dannyGoEveryNStars || 5;
    return {
      current: Math.min(this.state.starsSinceLastDance, threshold),
      target: threshold,
      percent: Math.min(100, Math.round((this.state.starsSinceLastDance / threshold) * 100))
    };
  }

  checkBadges(masteryMap) {
    const newlyUnlocked = [];
    const unlocked = this.state.unlockedBadges;

    CONFIG.badges.forEach(badge => {
      if (unlocked.includes(badge.id)) return;

      let meets = false;
      const cond = badge.condition;

      if (cond.type === 'solved' && this.state.totalCorrect >= cond.count) {
        meets = true;
      } else if (cond.type === 'streak' && this.state.bestStreak >= cond.count) {
        meets = true;
      } else if (cond.type === 'dance' && this.state.dancesCompleted >= cond.count) {
        meets = true;
      } else if (cond.type === 'category') {
        const cat = this.state.categoryStats[cond.category];
        if (cat && cat.correct >= cond.count) {
          meets = true;
        }
      } else if (cond.type === 'all_mastery') {
        const allMaster = Object.values(masteryMap).every(m => m.percent >= 80);
        if (allMaster && Object.keys(masteryMap).length > 0) {
          meets = true;
        }
      }

      if (meets) {
        unlocked.push(badge.id);
        newlyUnlocked.push(badge);
        this.state.profile.moneyCents += 75; // Bonus money for badge!
      }
    });

    if (newlyUnlocked.length > 0) {
      this.save();
    }

    return newlyUnlocked;
  }

  buySticker(stickerId, costCents) {
    if (this.state.profile.moneyCents >= costCents && !this.state.unlockedStickers.includes(stickerId)) {
      this.state.profile.moneyCents -= costCents;
      this.state.unlockedStickers.push(stickerId);
      this.save();
      return true;
    }
    return false;
  }

  placeSticker(sticker) {
    this.state.placedStickers.push(sticker);
    this.save();
  }

  clearPlacedStickers() {
    this.state.placedStickers = [];
    this.save();
  }

  resetAllProgress() {
    this.state = this.getDefaultState();
    this.save();
  }

  exportDataJson() {
    return JSON.stringify(this.state, null, 2);
  }

  importDataJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.categoryStats) {
        this.state = { ...this.getDefaultState(), ...parsed, profile: { ...this.getDefaultState().profile, ...parsed.profile } };
        this.migrateGemsToMoney(this.state.profile);
        this.save();
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON data for import", e);
    }
    return false;
  }
}
