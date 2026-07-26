/**
 * Magic 8 Ball Online - Production Application Engine
 * Pure Vanilla JavaScript (ES6+)
 */

/* ==========================================================================
   START EDITABLE CONFIGURATION OBJECTS
   ========================================================================== */

/**
 * SITE_CONFIG: Global SEO & Meta Configuration Object
 * Easily modify site details, keywords, and metadata for search engines.
 */
const SITE_CONFIG = {
  siteName: "Magic 8 Ball Online",
  title: "Magic 8 Ball Online - Free Interactive Decision Maker & Fortune Teller",
  description: "Ask the Magic 8 Ball any yes or no question online. Instant answers, classic 20 predictions, sound effects, question history, and saved favorites.",
  canonical: "https://magic8ball.online",
  author: "Magic 8 Ball Online Team",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  themeColor: "#7c3aed",
  primaryKeyword: "Magic 8 Ball",
  language: "en",
  ogImage: "/og-image.png",
  twitterImage: "/twitter-image.png",
  twitterCard: "summary_large_image"
};

/**
 * UI_CONFIG: Theme, Animation & Visual Settings Configuration Object
 * Controls dynamic UI parameters, colors, particles, and timings.
 */
const UI_CONFIG = {
  primaryColor: "#7c3aed",
  secondaryColor: "#8b5cf6",
  glowColor: "rgba(124, 58, 237, 0.25)",
  borderRadius: "16px",
  animationSpeed: "1000ms", // Duration of shake sequence
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  buttonRadius: "9999px",
  shadowStrength: "0 12px 32px -8px rgba(124, 58, 237, 0.12)",
  particleCount: 35,
  ballSize: "280px"
};

/* ==========================================================================
   START MAGIC 8 BALL CLASSIC RESPONSES
   ========================================================================== */

/**
 * Array of standard 20 Magic 8 Ball answers categorized by sentiment type.
 * Easily add or edit responses in the future.
 */
const MAGIC_RESPONSES = [
  // --- AFFIRMATIVE RESPONSES (10) ---
  { id: 1, text: "It is certain.", type: "affirmative" },
  { id: 2, text: "It is decidedly so.", type: "affirmative" },
  { id: 3, text: "Without a doubt.", type: "affirmative" },
  { id: 4, text: "Yes - definitely.", type: "affirmative" },
  { id: 5, text: "You may rely on it.", type: "affirmative" },
  { id: 6, text: "As I see it, yes.", type: "affirmative" },
  { id: 7, text: "Most likely.", type: "affirmative" },
  { id: 8, text: "Outlook good.", type: "affirmative" },
  { id: 9, text: "Yes.", type: "affirmative" },
  { id: 10, text: "Signs point to yes.", type: "affirmative" },

  // --- NON-COMMITTAL RESPONSES (5) ---
  { id: 11, text: "Reply hazy, try again.", type: "non-committal" },
  { id: 12, text: "Ask again later.", type: "non-committal" },
  { id: 13, text: "Better not tell you now.", type: "non-committal" },
  { id: 14, text: "Cannot predict now.", type: "non-committal" },
  { id: 15, text: "Concentrate and ask again.", type: "non-committal" },

  // --- NEGATIVE RESPONSES (5) ---
  { id: 16, text: "Don't count on it.", type: "negative" },
  { id: 17, text: "My reply is no.", type: "negative" },
  { id: 18, text: "My sources say no.", type: "negative" },
  { id: 19, text: "Outlook not so good.", type: "negative" },
  { id: 20, text: "Very doubtful.", type: "negative" }
];

/* ==========================================================================
   START AUDIO SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */

class SoundEffectsManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    try {
      this.isMuted = localStorage.getItem("m8b_muted") === "true";
    } catch (e) {
      this.isMuted = false;
    }

    // Unlock AudioContext on first user gesture anywhere on page
    const unlockAudio = () => {
      this.initContext();
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
    document.addEventListener("click", unlockAudio, { once: true });
    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("keydown", unlockAudio, { once: true });
  }

  initContext() {
    if (!this.audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      } catch (err) {
        console.warn("AudioContext initialization failed:", err);
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem("m8b_muted", this.isMuted);
    } catch (e) {
      // Storage restricted
    }
    return this.isMuted;
  }

  // Mystical magical fluid swirl sound during 8-ball shake
  playShakeRumble() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const duration = 0.9;

      // Lowpass filter to eliminate any harsh buzz and create a smooth magical atmosphere
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(250, now + duration);

      const mainGain = this.audioCtx.createGain();
      mainGain.gain.setValueAtTime(0.01, now);
      mainGain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Harmonically blended sine & triangle tones for a pleasant swishing magic sound
      const baseFreqs = [150, 225, 300]; 
      baseFreqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const oscGain = this.audioCtx.createGain();

        osc.type = idx === 0 ? "sine" : "triangle";

        // Gentle swishing pitch modulation simulating liquid motion
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.3, now + 0.35);
        osc.frequency.linearRampToValueAtTime(freq * 0.85, now + 0.65);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, now + duration);

        oscGain.gain.value = 1 / (idx + 1.2);

        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start(now);
        osc.stop(now + duration);
      });

      filter.connect(mainGain);
      mainGain.connect(this.audioCtx.destination);
    } catch (err) {
      console.warn("Audio playback error:", err);
    }
  }

  // Magical crystal chime on answer reveal
  playRevealChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord

      frequencies.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.06 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 1.3);
      });
    } catch (err) {
      console.warn("Audio playback error:", err);
    }
  }

  // Subtle click feedback for buttons
  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      // Ignore background click audio errors
    }
  }
}

/* ==========================================================================
   START INTERACTIVE PARTICLE CANVAS BACKGROUND
   ========================================================================== */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.burstParticles = [];
    this.animId = null;

    this.init();
    window.addEventListener("resize", () => this.resize());
  }

  init() {
    this.resize();
    this.createBaseParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createBaseParticles() {
    this.particles = [];
    for (let i = 0; i < UI_CONFIG.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * 0.02
      });
    }
  }

  // Trigger burst of glowing magic particles on answer reveal
  triggerBurst(originX, originY) {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.burstParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        color: Math.random() > 0.5 ? "#7c3aed" : "#c026d3"
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw base ambient floating particles
    this.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += p.pulse;

      if (p.alpha > 0.8 || p.alpha < 0.2) p.pulse = -p.pulse;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha * 0.35})`;
      this.ctx.fill();
    });

    // Draw burst particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vx *= 0.96;
      bp.vy *= 0.96;
      bp.alpha -= 0.025;

      if (bp.alpha <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
      this.ctx.fillStyle = bp.color;
      this.ctx.globalAlpha = bp.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }

    this.animId = requestAnimationFrame(() => this.animate());
  }
}

/* ==========================================================================
   START APPLICATION STATE & LOCALSTORAGE MANAGER
   ========================================================================== */

class AppStorage {
  static getHistory() {
    try {
      return JSON.parse(localStorage.getItem("m8b_history") || "[]");
    } catch {
      return [];
    }
  }

  static saveHistoryItem(item) {
    const history = this.getHistory();
    history.unshift(item); // Newest first
    if (history.length > 50) history.pop(); // Max 50 items
    try {
      localStorage.setItem("m8b_history", JSON.stringify(history));
    } catch (e) {
      console.warn("Storage item save failed:", e);
    }
    return history;
  }

  static deleteHistoryItem(id) {
    const history = this.getHistory().filter((h) => h.id !== id);
    try {
      localStorage.setItem("m8b_history", JSON.stringify(history));
    } catch (e) {
      console.warn("Storage update failed:", e);
    }
    return history;
  }

  static clearHistory() {
    try {
      localStorage.removeItem("m8b_history");
    } catch (e) {
      console.warn("Storage clear failed:", e);
    }
    return [];
  }

  static getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("m8b_favorites") || "[]");
    } catch {
      return [];
    }
  }

  static toggleFavorite(item) {
    let favorites = this.getFavorites();
    const index = favorites.findIndex((f) => f.id === item.id);
    let isFav = false;

    if (index >= 0) {
      favorites.splice(index, 1);
      isFav = false;
    } else {
      favorites.unshift(item);
      isFav = true;
    }

    try {
      localStorage.setItem("m8b_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.warn("Favorites storage failed:", e);
    }
    return { favorites, isFav };
  }

  static isFavorite(id) {
    const favorites = this.getFavorites();
    return favorites.some((f) => f.id === id);
  }
}

/* ==========================================================================
   START UI CONTROLLER & EVENT LISTENERS
   ========================================================================== */

class Magic8BallApp {
  constructor() {
    this.soundFX = new SoundEffectsManager();
    this.particleSystem = null;
    this.currentResult = null;
    this.isShaking = false;

    this.initDOM();
    this.bindEvents();
    this.updateBadges();
    this.applySEOConfig();
  }

  initDOM() {
    // Buttons & Inputs
    this.questionInput = document.getElementById("question-input");
    this.questionForm = document.getElementById("question-form");
    this.clearInputBtn = document.getElementById("clear-input-btn");
    this.inputError = document.getElementById("input-error");
    this.shakeBtn = document.getElementById("shake-btn");
    this.shakeBtnText = document.getElementById("shake-btn-text");

    // Magic 8 Ball Elements
    this.magicBall = document.getElementById("magic-ball");
    this.frontFace = document.getElementById("ball-front-face");
    this.liquidWindow = document.getElementById("liquid-window");
    this.windowAnswerText = document.getElementById("window-answer-text");

    // Result Card Elements
    this.resultCard = document.getElementById("result-card");
    this.resultSentimentBadge = document.getElementById("result-sentiment-badge");
    this.resultTimestamp = document.getElementById("result-timestamp");
    this.resultQuestionText = document.getElementById("result-question-text");
    this.resultAnswerText = document.getElementById("result-answer-text");
    this.askAgainBtn = document.getElementById("ask-again-btn");
    this.favResultBtn = document.getElementById("fav-result-btn");
    this.favBtnLabel = document.getElementById("fav-btn-label");
    this.copyResultBtn = document.getElementById("copy-result-btn");
    this.shareResultBtn = document.getElementById("share-result-btn");

    // Nav & Modals
    this.soundToggleBtn = document.getElementById("sound-toggle");
    this.soundOnIcon = this.soundToggleBtn ? this.soundToggleBtn.querySelector(".sound-on-icon") : null;
    this.soundOffIcon = this.soundToggleBtn ? this.soundToggleBtn.querySelector(".sound-off-icon") : null;
    this.favoritesBtn = document.getElementById("favorites-btn");
    this.historyBtn = document.getElementById("history-btn");
    this.favCount = document.getElementById("fav-count");
    this.historyCount = document.getElementById("history-count");

    // History Modal
    this.historyModal = document.getElementById("history-modal");
    this.historyList = document.getElementById("history-list");
    this.emptyHistoryState = document.getElementById("empty-history-state");
    this.closeHistoryModalBtn = document.getElementById("close-history-modal");
    this.clearHistoryBtn = document.getElementById("clear-history-btn");
    this.modalHistoryCount = document.getElementById("modal-history-count");

    // Favorites Modal
    this.favoritesModal = document.getElementById("favorites-modal");
    this.favoritesList = document.getElementById("favorites-list");
    this.emptyFavState = document.getElementById("empty-fav-state");
    this.closeFavModalBtn = document.getElementById("close-fav-modal");
    this.modalFavCount = document.getElementById("modal-fav-count");

    // Page Modals (About, Privacy, Terms, Contact)
    this.navHomeBtn = document.getElementById("nav-home-btn");
    this.aboutModal = document.getElementById("about-modal");
    this.closeAboutModalBtn = document.getElementById("close-about-modal");
    this.navAboutBtn = document.getElementById("nav-about-btn");
    this.aboutLink = document.getElementById("about-link");

    this.privacyModal = document.getElementById("privacy-modal");
    this.closePrivacyModalBtn = document.getElementById("close-privacy-modal");
    this.navPrivacyBtn = document.getElementById("nav-privacy-btn");
    this.privacyLink = document.getElementById("privacy-link");

    this.termsModal = document.getElementById("terms-modal");
    this.closeTermsModalBtn = document.getElementById("close-terms-modal");
    this.navTermsBtn = document.getElementById("nav-terms-btn");
    this.termsLink = document.getElementById("terms-link");

    this.contactModal = document.getElementById("contact-modal");
    this.closeContactModalBtn = document.getElementById("close-contact-modal");
    this.navContactBtn = document.getElementById("nav-contact-btn");
    this.contactLink = document.getElementById("contact-link");
    this.contactForm = document.getElementById("contact-form");
    this.contactSuccessMsg = document.getElementById("contact-success-msg");

    this.disclaimerModal = document.getElementById("disclaimer-modal");
    this.closeDisclaimerModalBtn = document.getElementById("close-disclaimer-modal");
    this.disclaimerLink = document.getElementById("disclaimer-link");

    // Toast
    this.toastNotification = document.getElementById("toast-notification");
    this.toastMessage = document.getElementById("toast-message");

    // Particles Canvas
    this.particleSystem = new ParticleSystem("particle-canvas");

    // Set initial mute UI
    if (this.soundFX.isMuted && this.soundOnIcon && this.soundOffIcon) {
      this.soundOnIcon.classList.add("hidden");
      this.soundOffIcon.classList.remove("hidden");
    }

    // Check hash on load
    this.handleHashNavigation();
  }

  applySEOConfig() {
    if (SITE_CONFIG.title) document.title = SITE_CONFIG.title;
  }

  bindEvents() {
    // Form submission & input actions
    this.questionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleShake();
    });

    this.questionInput.addEventListener("input", () => {
      if (this.questionInput.value.trim().length > 0) {
        this.clearInputBtn.classList.remove("hidden");
        this.inputError.classList.add("hidden");
      } else {
        this.clearInputBtn.classList.add("hidden");
      }
    });

    this.clearInputBtn.addEventListener("click", () => {
      this.questionInput.value = "";
      this.clearInputBtn.classList.add("hidden");
      this.questionInput.focus();
      this.soundFX.playClick();
    });

    // Quick Question Chips
    document.querySelectorAll(".chip-btn").forEach((chip) => {
      chip.addEventListener("click", () => {
        const questionText = chip.getAttribute("data-question");
        this.questionInput.value = questionText;
        this.clearInputBtn.classList.remove("hidden");
        this.inputError.classList.add("hidden");
        this.soundFX.playClick();
        this.handleShake();
      });
    });

    // Magic 8 Ball Direct Click / Keyboard Shake
    this.magicBall.addEventListener("click", () => this.handleShake());
    this.magicBall.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleShake();
      }
    });

    this.shakeBtn.addEventListener("click", () => this.handleShake());

    // Result Card Action Buttons
    this.askAgainBtn.addEventListener("click", () => {
      this.questionInput.value = "";
      this.clearInputBtn.classList.add("hidden");
      this.liquidWindow.classList.add("hidden");
      this.frontFace.classList.remove("hidden");
      this.questionInput.focus();
      this.soundFX.playClick();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    if (this.favResultBtn) this.favResultBtn.addEventListener("click", () => this.toggleCurrentFavorite());
    if (this.copyResultBtn) this.copyResultBtn.addEventListener("click", () => this.copyCurrentResult());
    if (this.shareResultBtn) this.shareResultBtn.addEventListener("click", () => this.shareCurrentResult());

    // Sound Toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener("click", () => {
        const isMuted = this.soundFX.toggleMute();
        if (isMuted) {
          if (this.soundOnIcon) this.soundOnIcon.classList.add("hidden");
          if (this.soundOffIcon) this.soundOffIcon.classList.remove("hidden");
          this.showToast("Sound muted");
        } else {
          if (this.soundOffIcon) this.soundOffIcon.classList.add("hidden");
          if (this.soundOnIcon) this.soundOnIcon.classList.remove("hidden");
          this.soundFX.playClick();
          this.showToast("Sound enabled");
        }
      });
    }

    // Modal Triggers - History & Favorites
    if (this.historyBtn) this.historyBtn.addEventListener("click", () => this.openHistoryModal());
    if (this.closeHistoryModalBtn) this.closeHistoryModalBtn.addEventListener("click", () => this.closeModal(this.historyModal));
    if (this.clearHistoryBtn) {
      this.clearHistoryBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your entire question history?")) {
          AppStorage.clearHistory();
          this.renderHistory();
          this.updateBadges();
          this.showToast("History cleared");
        }
      });
    }

    if (this.favoritesBtn) this.favoritesBtn.addEventListener("click", () => this.openFavoritesModal());
    if (this.closeFavModalBtn) this.closeFavModalBtn.addEventListener("click", () => this.closeModal(this.favoritesModal));

    // Page Modal Triggers
    if (this.navHomeBtn) this.navHomeBtn.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });

    if (this.navAboutBtn) this.navAboutBtn.addEventListener("click", () => this.openAboutModal());
    if (this.aboutLink) this.aboutLink.addEventListener("click", (e) => { e.preventDefault(); this.openAboutModal(); });
    if (this.closeAboutModalBtn) this.closeAboutModalBtn.addEventListener("click", () => this.closeModal(this.aboutModal));

    if (this.navPrivacyBtn) this.navPrivacyBtn.addEventListener("click", () => this.openPrivacyModal());
    if (this.privacyLink) this.privacyLink.addEventListener("click", (e) => { e.preventDefault(); this.openPrivacyModal(); });
    if (this.closePrivacyModalBtn) this.closePrivacyModalBtn.addEventListener("click", () => this.closeModal(this.privacyModal));

    if (this.navTermsBtn) this.navTermsBtn.addEventListener("click", () => this.openTermsModal());
    if (this.termsLink) this.termsLink.addEventListener("click", (e) => { e.preventDefault(); this.openTermsModal(); });
    if (this.closeTermsModalBtn) this.closeTermsModalBtn.addEventListener("click", () => this.closeModal(this.termsModal));

    if (this.navContactBtn) this.navContactBtn.addEventListener("click", () => this.openContactModal());
    if (this.contactLink) this.contactLink.addEventListener("click", (e) => { e.preventDefault(); this.openContactModal(); });
    if (this.closeContactModalBtn) this.closeContactModalBtn.addEventListener("click", () => this.closeModal(this.contactModal));

    if (this.disclaimerLink) this.disclaimerLink.addEventListener("click", (e) => { e.preventDefault(); this.openDisclaimerModal(); });
    if (this.closeDisclaimerModalBtn) this.closeDisclaimerModalBtn.addEventListener("click", () => this.closeModal(this.disclaimerModal));

    // Modal Crosslink buttons inside modal footers
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("open-about-btn")) {
        this.closeAllPageModals();
        this.openAboutModal();
      } else if (e.target.classList.contains("open-privacy-btn")) {
        this.closeAllPageModals();
        this.openPrivacyModal();
      } else if (e.target.classList.contains("open-terms-btn")) {
        this.closeAllPageModals();
        this.openTermsModal();
      } else if (e.target.classList.contains("open-contact-btn")) {
        this.closeAllPageModals();
        this.openContactModal();
      } else if (e.target.classList.contains("open-disclaimer-btn")) {
        this.closeAllPageModals();
        this.openDisclaimerModal();
      }
    });

    // Contact Form Submission
    if (this.contactForm) {
      this.contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.soundFX.playClick();
        if (this.contactSuccessMsg) this.contactSuccessMsg.classList.remove("hidden");
        this.showToast("Message sent! We'll reply within 24h.");
        setTimeout(() => {
          this.contactForm.reset();
          if (this.contactSuccessMsg) this.contactSuccessMsg.classList.add("hidden");
        }, 3500);
      });
    }

    // Close modals on backdrop click
    [
      this.historyModal, 
      this.favoritesModal,
      this.aboutModal,
      this.privacyModal,
      this.termsModal,
      this.contactModal,
      this.disclaimerModal
    ].forEach((modal) => {
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) this.closeModal(modal);
        });
      }
    });

    // Escape key modal handler
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(this.historyModal);
        this.closeModal(this.favoritesModal);
        this.closeAllPageModals();
      }
    });

    // Window Hash Navigation Listener
    window.addEventListener("hashchange", () => this.handleHashNavigation());
  }

  handleHashNavigation() {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#about") {
      this.openAboutModal();
    } else if (hash === "#privacy") {
      this.openPrivacyModal();
    } else if (hash === "#terms") {
      this.openTermsModal();
    } else if (hash === "#contact") {
      this.openContactModal();
    } else if (hash === "#disclaimer") {
      this.openDisclaimerModal();
    }
  }

  openAboutModal() {
    this.closeAllPageModals();
    this.openModal(this.aboutModal);
  }

  openPrivacyModal() {
    this.closeAllPageModals();
    this.openModal(this.privacyModal);
  }

  openTermsModal() {
    this.closeAllPageModals();
    this.openModal(this.termsModal);
  }

  openContactModal() {
    this.closeAllPageModals();
    this.openModal(this.contactModal);
  }

  openDisclaimerModal() {
    this.closeAllPageModals();
    this.openModal(this.disclaimerModal);
  }

  closeAllPageModals() {
    if (this.aboutModal) this.closeModal(this.aboutModal);
    if (this.privacyModal) this.closeModal(this.privacyModal);
    if (this.termsModal) this.closeModal(this.termsModal);
    if (this.contactModal) this.closeModal(this.contactModal);
    if (this.disclaimerModal) this.closeModal(this.disclaimerModal);
  }

  /* --------------------------------------------------------------------------
     START CORE SHAKE & REVEAL LOGIC
     -------------------------------------------------------------------------- */
  handleShake() {
    if (this.isShaking) return;

    let question = this.questionInput.value.trim();

    // If user didn't type a question, use a fallback question so shaking always works
    if (!question) {
      question = "Your Secret Question";
    }

    this.inputError.classList.add("hidden");
    this.isShaking = true;
    this.shakeBtn.disabled = true;
    this.shakeBtnText.textContent = "Asking the Oracle...";

    // Audio & Haptics
    this.soundFX.playShakeRumble();
    if ("vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    // Hide liquid window during shake, display front face 8 logo temporarily
    this.liquidWindow.classList.add("hidden");
    this.frontFace.classList.remove("hidden");

    // Add CSS shake animation
    this.magicBall.classList.add("shaking");

    // Wait for shake duration (~1000ms)
    setTimeout(() => {
      this.revealAnswer(question);
    }, 1000);
  }

  revealAnswer(question) {
    // Select random response
    const randomIndex = Math.floor(Math.random() * MAGIC_RESPONSES.length);
    const selectedResponse = MAGIC_RESPONSES[randomIndex];

    const resultItem = {
      id: "res_" + Date.now(),
      question: question,
      answer: selectedResponse.text,
      type: selectedResponse.type,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    this.currentResult = resultItem;

    // Save to storage
    AppStorage.saveHistoryItem(resultItem);
    this.updateBadges();

    // Update 8-Ball Window Portal Text
    this.windowAnswerText.textContent = selectedResponse.text;
    this.frontFace.classList.add("hidden");
    this.liquidWindow.classList.remove("hidden");

    // Remove shake class
    this.magicBall.classList.remove("shaking");

    // Sound chime & Particle Burst
    this.soundFX.playRevealChime();
    const rect = this.magicBall.getBoundingClientRect();
    this.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // Update Result Card UI
    this.renderResultCard(resultItem);

    // Reset shake button state
    this.isShaking = false;
    this.shakeBtn.disabled = false;
    this.shakeBtnText.textContent = "Shake the 8 Ball";
  }

  renderResultCard(item) {
    this.resultQuestionText.textContent = `"${item.question}"`;
    this.resultAnswerText.textContent = item.answer;
    this.resultTimestamp.textContent = item.timestamp;

    // Format Sentiment Badge
    this.resultSentimentBadge.className = `sentiment-badge ${item.type}`;
    if (item.type === "affirmative") {
      this.resultSentimentBadge.textContent = "✨ Positive Outcome";
    } else if (item.type === "non-committal") {
      this.resultSentimentBadge.textContent = "🌫️ Hazy / Uncertain";
    } else {
      this.resultSentimentBadge.textContent = "⚠️ Unfavorable";
    }

    // Check favorite status
    const isFav = AppStorage.isFavorite(item.id);
    this.updateFavoriteButtonUI(isFav);

    // Show result card with animation
    this.resultCard.classList.remove("hidden");
    this.resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* --------------------------------------------------------------------------
     START FAVORITES & SHARE HANDLERS
     -------------------------------------------------------------------------- */
  toggleCurrentFavorite() {
    if (!this.currentResult) return;
    const { isFav } = AppStorage.toggleFavorite(this.currentResult);
    this.updateFavoriteButtonUI(isFav);
    this.updateBadges();
    this.soundFX.playClick();
    this.showToast(isFav ? "Saved to Favorites!" : "Removed from Favorites");
  }

  updateFavoriteButtonUI(isFav) {
    if (isFav) {
      this.favResultBtn.classList.add("active");
      this.favBtnLabel.textContent = "Favorited";
    } else {
      this.favResultBtn.classList.remove("active");
      this.favBtnLabel.textContent = "Favorite";
    }
  }

  copyCurrentResult() {
    if (!this.currentResult) return;
    const shareText = `Q: ${this.currentResult.question}\nMagic 8 Ball Says: ${this.currentResult.answer}\nAsk online at: ${window.location.href}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showToast("Answer copied to clipboard!");
        this.soundFX.playClick();
      }).catch(() => {
        this.fallbackCopy(shareText);
      });
    } else {
      this.fallbackCopy(shareText);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    this.showToast("Answer copied to clipboard!");
  }

  shareCurrentResult() {
    if (!this.currentResult) return;
    const shareData = {
      title: "Magic 8 Ball Online Answer",
      text: `I asked: "${this.currentResult.question}" - Magic 8 Ball says: "${this.currentResult.answer}"`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // Share cancelled by user
      });
    } else {
      this.copyCurrentResult();
    }
  }

  /* --------------------------------------------------------------------------
     START MODAL DRAWERS & RENDERING
     -------------------------------------------------------------------------- */
  openHistoryModal() {
    this.renderHistory();
    this.openModal(this.historyModal);
  }

  openFavoritesModal() {
    this.renderFavorites();
    this.openModal(this.favoritesModal);
  }

  openModal(modal) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    this.soundFX.playClick();
  }

  closeModal(modal) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  renderHistory() {
    const history = AppStorage.getHistory();
    this.historyList.innerHTML = "";
    this.modalHistoryCount.textContent = history.length;

    if (history.length === 0) {
      this.emptyHistoryState.classList.remove("hidden");
      this.clearHistoryBtn.disabled = true;
      return;
    }

    this.emptyHistoryState.classList.add("hidden");
    this.clearHistoryBtn.disabled = false;

    history.forEach((item) => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="history-content">
          <p class="history-question">"${this.escapeHTML(item.question)}"</p>
          <p class="history-answer">${this.escapeHTML(item.answer)}</p>
          <span class="history-time">${item.timestamp}</span>
        </div>
        <button class="delete-item-btn" aria-label="Delete item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      card.querySelector(".delete-item-btn").addEventListener("click", () => {
        AppStorage.deleteHistoryItem(item.id);
        this.renderHistory();
        this.updateBadges();
      });

      this.historyList.appendChild(card);
    });
  }

  renderFavorites() {
    const favorites = AppStorage.getFavorites();
    this.favoritesList.innerHTML = "";
    this.modalFavCount.textContent = favorites.length;

    if (favorites.length === 0) {
      this.emptyFavState.classList.remove("hidden");
      return;
    }

    this.emptyFavState.classList.add("hidden");

    favorites.forEach((item) => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="history-content">
          <p class="history-question">"${this.escapeHTML(item.question)}"</p>
          <p class="history-answer">${this.escapeHTML(item.answer)}</p>
          <span class="history-time">${item.timestamp}</span>
        </div>
        <button class="delete-item-btn" aria-label="Remove favorite">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      card.querySelector(".delete-item-btn").addEventListener("click", () => {
        AppStorage.toggleFavorite(item);
        this.renderFavorites();
        this.updateBadges();
        if (this.currentResult && this.currentResult.id === item.id) {
          this.updateFavoriteButtonUI(false);
        }
      });

      this.favoritesList.appendChild(card);
    });
  }

  updateBadges() {
    const historyCount = AppStorage.getHistory().length;
    const favCount = AppStorage.getFavorites().length;

    if (this.historyCount) this.historyCount.textContent = historyCount;
    if (this.favCount) this.favCount.textContent = favCount;
  }

  showToast(message) {
    this.toastMessage.textContent = message;
    this.toastNotification.classList.remove("hidden");

    setTimeout(() => {
      this.toastNotification.classList.add("hidden");
    }, 2500);
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

// Initialize application safely regardless of document readyState
function initMagic8Ball() {
  if (!window.magic8BallApp) {
    window.magic8BallApp = new Magic8BallApp();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMagic8Ball);
} else {
  initMagic8Ball();
}
