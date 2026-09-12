/**
 * Adaptive Intelligence Engine ("Plastic Brain")
 * Dynamically adjusts difficulty, tracks mastery per domain, focuses on weak points,
 * and manages spaced-repetition reinforcement for Lily.
 */

class AdaptiveEngine {
  constructor(questionBank, storage) {
    this.questionBank = questionBank;
    this.storage = storage;
  }

  /**
   * Get user progress state
   */
  getState() {
    return this.storage.getState();
  }

  /**
   * Calculate mastery % for each category based on correct vs total attempts & difficulty weights
   */
  getDomainMastery() {
    const stats = this.storage.getCategoryStats();
    const domainMastery = {};

    Object.keys(stats).forEach(catId => {
      const data = stats[catId] || { attempts: 0, correct: 0, level: 1, history: [] };
      if (data.attempts === 0) {
        domainMastery[catId] = {
          percent: 0,
          level: 1,
          status: "Not Started",
          attempts: 0,
          correct: 0,
          accuracy: 0
        };
      } else {
        const accuracy = Math.round((data.correct / data.attempts) * 100);
        // Level weight multiplier: Level 1 = 25%, Level 2 = 50%, Level 3 = 75%, Level 4 = 100%
        const levelScore = (data.level / 4) * 50;
        const accuracyScore = (accuracy / 100) * 50;
        const totalMastery = Math.min(100, Math.round(levelScore + accuracyScore));

        let status = "Developing";
        if (totalMastery >= 85) status = "Gifted Mastery 🌟";
        else if (totalMastery >= 65) status = "Proficient 👍";
        else if (totalMastery >= 40) status = "Practicing 💡";

        domainMastery[catId] = {
          percent: totalMastery,
          level: data.level || 1,
          status,
          attempts: data.attempts,
          correct: data.correct,
          accuracy
        };
      }
    });

    return domainMastery;
  }

  /**
   * Identify current weak points that need adaptive focus
   */
  getWeakestDomains() {
    const mastery = this.getDomainMastery();
    const sorted = Object.keys(mastery).map(catId => ({
      catId,
      ...mastery[catId]
    })).sort((a, b) => a.percent - b.percent);

    return sorted;
  }

  /**
   * Select next optimal question adaptively:
   * 1. Check if there are missed questions in spaced repetition queue
   * 2. Otherwise focus on the category with the lowest mastery or unpracticed
   * 3. Match difficulty level to current learner capacity
   */
  getNextQuestion(specificCategory = null) {
    const state = this.getState();
    const repeatQueue = state.spacedRepetitionQueue || [];

    // 1. Spaced Repetition (re-test missed question after at least 2 other questions)
    if (!specificCategory && repeatQueue.length > 0 && Math.random() < 0.35) {
      const targetId = repeatQueue[0];
      const q = this.questionBank.find(item => item.id === targetId);
      if (q) {
        return { question: q, isReview: true, reason: "Reviewing a previous puzzle to boost your brain power!" };
      }
    }

    // 2. Determine target category
    let targetCatId = specificCategory;
    if (!targetCatId) {
      const weakest = this.getWeakestDomains();
      // 70% chance pick one of the bottom 2 weakest domains, 30% explore
      if (weakest.length > 0 && Math.random() < 0.7) {
        const topWeak = weakest.slice(0, 2);
        targetCatId = topWeak[Math.floor(Math.random() * topWeak.length)].catId;
      } else {
        // Random pick
        const cats = Object.keys(masteryMap(this.questionBank));
        targetCatId = cats[Math.floor(Math.random() * cats.length)];
      }
    }

    // 3. Determine target difficulty level for this category
    const catStats = this.storage.getCategoryStats()[targetCatId] || { level: 1 };
    const currentLevel = catStats.level || 1;

    // Filter questions by category and matching or adjacent difficulty
    let candidates = this.questionBank.filter(q => q.category === targetCatId);
    let matchedDifficulty = candidates.filter(q => q.difficulty === currentLevel);

    // If no exact match, fallback to any in category
    if (matchedDifficulty.length === 0) {
      matchedDifficulty = candidates;
    }

    // Avoid immediately repeating the last answered question
    const lastAnsweredId = state.lastAnsweredId;
    let pool = matchedDifficulty.filter(q => q.id !== lastAnsweredId);
    if (pool.length === 0) pool = matchedDifficulty;

    const selected = pool[Math.floor(Math.random() * pool.length)] || this.questionBank[0];

    return {
      question: selected,
      isReview: false,
      reason: `Targeting ${targetCatId} at Level ${selected.difficulty}`
    };
  }

  /**
   * Process user answer and adjust plastic neural state
   */
  recordResult(questionId, isCorrect, timeSpentSec = 0) {
    const question = this.questionBank.find(q => q.id === questionId);
    if (!question) return { unlockedBadges: [], levelUp: false };

    const catId = question.category;
    const catStats = this.storage.getCategoryStats()[catId] || {
      attempts: 0,
      correct: 0,
      level: 1,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
      history: []
    };

    catStats.attempts += 1;
    catStats.history = catStats.history || [];
    catStats.history.push({ isCorrect, time: Date.now(), difficulty: question.difficulty });

    let leveledUp = false;

    if (isCorrect) {
      catStats.correct += 1;
      catStats.consecutiveCorrect = (catStats.consecutiveCorrect || 0) + 1;
      catStats.consecutiveWrong = 0;

      // Adaptive difficulty escalation: 2 consecutive correct at current level upgrades level
      if (catStats.consecutiveCorrect >= 2 && catStats.level < 4) {
        catStats.level += 1;
        catStats.consecutiveCorrect = 0;
        leveledUp = true;
      }

      // Remove from spaced repetition queue if present
      this.storage.removeFromReviewQueue(questionId);
    } else {
      catStats.consecutiveWrong = (catStats.consecutiveWrong || 0) + 1;
      catStats.consecutiveCorrect = 0;

      // Adaptive de-escalation: 2 consecutive wrong lowers difficulty to build confidence
      if (catStats.consecutiveWrong >= 2 && catStats.level > 1) {
        catStats.level -= 1;
        catStats.consecutiveWrong = 0;
      }

      // Add to spaced repetition review queue
      this.storage.addToReviewQueue(questionId);
    }

    this.storage.updateCategoryStat(catId, catStats);
    this.storage.recordAnswer(questionId, isCorrect);

    // Check newly unlocked badges
    const unlockedBadges = this.storage.checkBadges(this.getDomainMastery());

    return {
      leveledUp,
      newLevel: catStats.level,
      unlockedBadges
    };
  }

  /**
   * Calculate overall composite GATE Readiness Score (0-100%)
   */
  calculateGATEComposite() {
    const mastery = this.getDomainMastery();
    const categories = Object.keys(mastery);
    if (categories.length === 0) return 0;

    let totalScore = 0;
    categories.forEach(cat => {
      totalScore += mastery[cat].percent;
    });

    return Math.round(totalScore / categories.length);
  }
}

function masteryMap(bank) {
  const map = {};
  bank.forEach(q => {
    map[q.category] = true;
  });
  return map;
}
