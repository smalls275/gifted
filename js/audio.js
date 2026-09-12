/**
 * Audio Synthesizer (Web Audio API) & Kid-Friendly Text-to-Speech (Web Speech API)
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.selectedVoice = null;

    if (this.synth) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices.length) return;

    // Known female voice names across Windows, macOS/iOS, Android, and Chrome/Edge
    const femaleKeywords = [
      'female', 'zira', 'jenny', 'aria', 'michelle', 'hazel', 'susan', 'samantha',
      'victoria', 'allison', 'ava', 'karen', 'moira', 'tessa', 'fiona', 'kate',
      'natural', 'salli', 'joanna', 'kendra', 'kimberly', 'ivy', 'emma', 'amy',
      'nicky', 'sara', 'catherine', 'linda', 'heera', 'veena', 'shelley', 'anna',
      'google us english', 'google uk english female', 'google english female'
    ];
    // Known male voice names to explicitly exclude
    const maleKeywords = [
      'male', 'david', 'mark', 'guy', 'ryan', 'daniel', 'alex', 'fred', 'james',
      'christopher', 'matthew', 'justin', 'oliver', 'george', 'thomas', 'eric',
      'google uk english male'
    ];

    const nameHas = (voice, keywords) => {
      const n = voice.name.toLowerCase();
      return keywords.some(k => n.includes(k));
    };

    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const pool = englishVoices.length ? englishVoices : voices;

    this.selectedVoice =
      pool.find(v => nameHas(v, femaleKeywords)) ||
      voices.find(v => nameHas(v, femaleKeywords)) ||
      pool.find(v => !nameHas(v, maleKeywords)) ||
      pool[0] ||
      voices[0];
  }

  speak(text, priority = false) {
    if (!this.speechEnabled || !this.synth) return;
    if (priority || this.synth.speaking) {
      this.synth.cancel();
    }

    // Clean text of emojis and markdown for speech
    const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[#*_~`]/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = 0.92; // slightly slower, clear for 6-year-old
    utterance.pitch = 1.15; // friendly, upbeat pitch
    this.currentUtterance = utterance;
    
    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }

  stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  playPop() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    
    const now = this.audioCtx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playCorrect() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    // Happy major triad arpeggio (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.35);
    });
  }

  playTryAgain() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    // Gentle encouraging two-tone chime (F4 -> D4)
    const notes = [349.23, 293.66];
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0.12, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.25);
    });
  }

  playStarCollect() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    const freqs = [880, 1174.66, 1760];
    const now = this.audioCtx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  playFanfare() {
    if (!this.soundEnabled) return;
    this.ensureAudioContext();
    if (!this.audioCtx) return;

    // Triumphant level-up fanfare
    const chords = [
      { f: 523.25, time: 0.0 }, // C5
      { f: 659.25, time: 0.12 }, // E5
      { f: 783.99, time: 0.24 }, // G5
      { f: 1046.50, time: 0.36 }, // C6
      { f: 1318.51, time: 0.52 }  // E6
    ];
    const now = this.audioCtx.currentTime;

    chords.forEach(n => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.time);

      gain.gain.setValueAtTime(0.25, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + 0.5);
    });
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled) {
      this.stopSpeech();
    }
    return this.speechEnabled;
  }
}

const sounds = new SoundController();
