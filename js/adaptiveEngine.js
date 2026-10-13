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

    // Recently-seen tracking uses content fingerprints (prompt + correct answer),
    // NOT question ids: ids are regenerated randomly on every page load, so saved
    // ids never match after a refresh and the no-repeat memory silently reset.
    const recentKeys = new Set(state.recentQuestionIds || []);
    const justSeenKeys = new Set((state.recentQuestionIds || []).slice(-10));
    const lastAnsweredKey = state.lastAnsweredId;

    // 1. Spaced Repetition: re-test a missed question, picked at random from the
    // queue (not always the first one) and never within the last 10 questions.
    if (!specificCategory && repeatQueue.length > 0 && Math.random() < 0.35) {
      const queued = new Set(repeatQueue);
      const reviewable = this.questionBank.filter(q => {
        const key = questionFingerprint(q);
        return queued.has(key) && !justSeenKeys.has(key);
      });
      if (reviewable.length > 0) {
        const q = reviewable[Math.floor(Math.random() * reviewable.length)];
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

    const candidates = this.questionBank.filter(q => q.category === targetCatId);

    // Exclude anything Lily has seen recently (rolling window) BEFORE matching
    // difficulty, then widen the difficulty window (harder levels first) whenever
    // the exact level has too few fresh questions. Filtering by difficulty first
    // used to trap her in a loop: a level with only 2-3 questions kept serving
    // those same questions forever once everything else was "recent".
    const fresh = candidates.filter(q => !recentKeys.has(questionFingerprint(q)));

    const MIN_FRESH_POOL = 6;
    const levelPreference = [
      currentLevel, currentLevel + 1, currentLevel - 1,
      currentLevel + 2, currentLevel - 2, currentLevel + 3, currentLevel - 3
    ];
    let pool = [];
    for (const lvl of levelPreference) {
      if (lvl < 1 || lvl > 4) continue;
      pool = pool.concat(fresh.filter(q => (q.difficulty || 1) === lvl));
      if (pool.length >= MIN_FRESH_POOL) break;
    }
    if (pool.length === 0) pool = fresh;
    if (pool.length === 0) pool = candidates.filter(q => questionFingerprint(q) !== lastAnsweredKey);
    if (pool.length === 0) pool = candidates;

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
    const questionKey = questionFingerprint(question);
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
      this.storage.removeFromReviewQueue(questionKey);
    } else {
      catStats.consecutiveWrong = (catStats.consecutiveWrong || 0) + 1;
      catStats.consecutiveCorrect = 0;

      // Adaptive de-escalation: 2 consecutive wrong lowers difficulty to build confidence
      if (catStats.consecutiveWrong >= 2 && catStats.level > 1) {
        catStats.level -= 1;
        catStats.consecutiveWrong = 0;
      }

      // Add to spaced repetition review queue
      this.storage.addToReviewQueue(questionKey);
    }

    this.storage.updateCategoryStat(catId, catStats);
    this.storage.recordAnswer(questionId, isCorrect, questionKey);

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

// Stable identity for a question that survives page reloads. Question ids get a
// random suffix every time the bank is generated, so anything persisted to
// localStorage (recent list, review queue) must key on content instead.
function questionFingerprint(q) {
  const correctText = (q.options && q.options[q.correctIndex]) ? q.options[q.correctIndex].text : "";
  return q.prompt + "||" + correctText;
}
