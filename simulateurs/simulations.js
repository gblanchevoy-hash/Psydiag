/**
 * PSYMULATION — Application Controller
 * Orchestre ScenarioEngine, ScoringEngine, ReportEngine, StorageEngine
 * Version 1.0.0 — Psydiag
 */

import ScenarioEngine from './engine/scenario-engine.js';
import ScoringEngine  from './engine/scoring-engine.js';
import ReportEngine   from './engine/report-engine.js';
import StorageEngine  from './engine/storage-engine.js';

// ─── Catalogue des scénarios disponibles ────────────────────────────────────

const SCENARIO_CATALOGUE = [
  {
    id: 'ptsd',
    path: './data/ptsd.json',
    titre: 'État de stress post-traumatique',
    patient: 'Marie, 34 ans',
    categorie: 'Trauma',
    difficulte: 'intermediaire',
    cim11: '6B40',
    description: 'Patiente présentant un ESPT suite à une agression. Travail sur l\'alliance, la gestion du silence et l\'accueil du récit traumatique.',
    couleur: '#6B4A7C'
  },
  {
    id: 'depression',
    path: './data/depression.json',
    titre: 'Épisode dépressif caractérisé',
    patient: 'Jean, 48 ans',
    categorie: 'Troubles de l\'humeur',
    difficulte: 'intermediaire',
    cim11: '6A70',
    description: 'Patient en épisode dépressif caractérisé, sans demande initiale. Exploration du risque suicidaire et maintien du lien.',
    couleur: '#4A5A6B'
  }
];

// ─── Classe principale ───────────────────────────────────────────────────────

class PsymulationApp {
  constructor() {
    this.scenarioEngine = new ScenarioEngine();
    this.scoringEngine  = new ScoringEngine();
    this.reportEngine   = new ReportEngine();
    this.storageEngine  = new StorageEngine();

    this.currentView      = 'home';   // 'home' | 'simulation' | 'report'
    this.startTime        = null;
    this.currentScenarioId = null;

    // Expose globalement pour les boutons du rapport
    window.psymulation = {
      restart:      () => this.restartCurrentScenario(),
      exportReport: () => this.exportCurrentReport(),
      goHome:       () => this.showView('home')
    };

    this._init();
  }

  // ─── Initialisation DOM ───────────────────────────────────────────────────

  _init() {
    this._renderCatalogue();
    this._bindNav();
    this._checkResumeSession();
    this.showView('home');
  }

  // ─── Vues ─────────────────────────────────────────────────────────────────

  showView(view) {
    this.currentView = view;
    ['view-home', 'view-simulation', 'view-report'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    const target = document.getElementById(`view-${view}`);
    if (target) target.hidden = false;
  }

  // ─── Catalogue ────────────────────────────────────────────────────────────

  _renderCatalogue() {
    const grid = document.getElementById('catalogue-grid');
    if (!grid) return;

    grid.innerHTML = SCENARIO_CATALOGUE.map(s => `
<div class="scenario-card" data-id="${s.id}" role="button" tabindex="0"
     aria-label="Démarrer le scénario ${s.titre}">
  <div class="sc-header" style="background:${s.couleur}20;border-left:4px solid ${s.couleur}">
    <div class="sc-avatar" style="background:${s.couleur}">${s.patient.charAt(0)}</div>
    <div>
      <div class="sc-patient">${s.patient}</div>
      <div class="sc-categorie">${s.categorie}</div>
    </div>
    <div class="sc-cim">CIM-11<br><strong>${s.cim11}</strong></div>
  </div>
  <div class="sc-body">
    <h3 class="sc-titre">${s.titre}</h3>
    <p class="sc-desc">${s.description}</p>
    <div class="sc-footer">
      <span class="sc-diff diff-${s.difficulte}">${this._diffLabel(s.difficulte)}</span>
      <button class="btn-start" data-id="${s.id}">Commencer →</button>
    </div>
  </div>
</div>`).join('');

    grid.querySelectorAll('.btn-start').forEach(btn => {
      btn.addEventListener('click', () => this.startScenario(btn.dataset.id));
    });
  }

  _diffLabel(d) {
    return { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' }[d] || d;
  }

  // ─── Démarrage simulation ──────────────────────────────────────────────────

  async startScenario(scenarioId) {
    const meta = SCENARIO_CATALOGUE.find(s => s.id === scenarioId);
    if (!meta) { console.error('Scénario inconnu :', scenarioId); return; }

    this._showLoading(true);

    try {
      const scenario = await this.scenarioEngine.loadScenario(meta.path);
      this.scoringEngine.init(scenario.scoring);
      this.startTime = Date.now();
      this.currentScenarioId = scenarioId;

      this.storageEngine.clearSession(); // nouvelle session propre

      this.showView('simulation');
      this._renderSimulation(this.scenarioEngine.getCurrentStep());
    } catch (err) {
      this._showError(`Impossible de charger le scénario : ${err.message}`);
    } finally {
      this._showLoading(false);
    }
  }

  // ─── Rendu d'une étape ────────────────────────────────────────────────────

  _renderSimulation(step) {
    if (!step) return;

    const scenario = this.scenarioEngine.getScenario();
    const progress  = this.scenarioEngine.getProgress();

    // Barre de progression
    const progressBar = document.getElementById('sim-progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;

    // Info patient
    const headerPatient = document.getElementById('sim-patient-info');
    if (headerPatient) {
      headerPatient.innerHTML = `
<div class="patient-avatar" style="background:${scenario.patient.avatar_couleur}">
  ${scenario.patient.avatar_initiales}
</div>
<div>
  <div class="sim-patient-name">${scenario.patient.prenom}, ${scenario.patient.age} ans</div>
  <div class="sim-scenario-title">${scenario.meta.titre}</div>
</div>`;
    }

    // Baromètre d'alliance (signature visuelle)
    this._updateAllianceBarometer();

    // Étape
    const stepTitle = document.getElementById('step-title');
    if (stepTitle) stepTitle.textContent = `Étape ${this.scenarioEngine.history.length + 1} — ${step.titre}`;

    // Contexte clinique
    const contextEl = document.getElementById('step-context');
    if (contextEl) contextEl.textContent = step.contexte_clinique;

    // Émotion indicator
    const emotionEl = document.getElementById('step-emotion');
    if (emotionEl) {
      emotionEl.textContent = step.indicateur_emotion;
      emotionEl.className = `emotion-indicator emotion-${step.emotion_patient}`;
    }

    // Dialogue patient
    const dialogueEl = document.getElementById('step-dialogue');
    if (dialogueEl) {
      if (step.dialogue_type === 'silence') {
        dialogueEl.innerHTML = '<span class="silence-marker">[ silence ]</span>';
        dialogueEl.className = 'dialogue-bubble dialogue-silence';
      } else {
        dialogueEl.textContent = step.dialogue;
        dialogueEl.className = 'dialogue-bubble';
      }
    }

    // Choix
    const choicesEl = document.getElementById('step-choices');
    if (choicesEl) {
      choicesEl.innerHTML = step.reponses.map(r => `
<button class="choice-btn choice-${r.qualite}" data-id="${r.id}" role="option">
  ${r.texte_display || r.texte}
</button>`).join('');

      choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => this._handleChoice(btn.dataset.id));
      });
    }

    // Réinitialiser le feedback
    const feedbackEl = document.getElementById('step-feedback');
    if (feedbackEl) feedbackEl.hidden = true;

    // Auto-save session
    this._saveCurrentSession();
  }

  // ─── Gestion d'un choix ───────────────────────────────────────────────────

  _handleChoice(choiceId) {
    const step = this.scenarioEngine.getCurrentStep();
    const choice = step.reponses.find(r => r.id === choiceId);
    if (!choice) return;

    // Désactiver les boutons
    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.disabled = true;
      btn.classList.remove('choice-hover');
      if (btn.dataset.id === choiceId) btn.classList.add('choice-selected');
    });

    // Appliquer le delta de scoring
    this.scoringEngine.applyDelta(choice.delta, step.id, choiceId);

    // Mettre à jour le baromètre immédiatement
    this._updateAllianceBarometer();

    // Afficher le feedback
    this._showFeedback(choice);

    // Appliquer dans le moteur de scénario
    const result = this.scenarioEngine.applyChoice(choiceId, this.scoringEngine.getRawState());

    // Alerte de rupture
    if (result.alerte === 'rupture_critique' || result.ruptureForced) {
      this._showRuptureAlert();
    }

    // Passer à la suite
    if (result.isFinished) {
      setTimeout(() => this._showReport(result.finReason), 2500);
    } else {
      setTimeout(() => {
        this._renderSimulation(this.scenarioEngine.getCurrentStep());
      }, 2800);
    }
  }

  _showFeedback(choice) {
    const feedbackEl = document.getElementById('step-feedback');
    if (!feedbackEl) return;

    const qualiteConfig = {
      excellent: { cls: 'feedback-excellent', icon: '◈', label: 'Excellent' },
      bien:      { cls: 'feedback-bien',      icon: '◆', label: 'Bien' },
      neutre:    { cls: 'feedback-neutre',     icon: '◇', label: 'Neutre' },
      maladroit: { cls: 'feedback-maladroit',  icon: '⚠', label: 'Maladroit' },
      rupture:   { cls: 'feedback-rupture',    icon: '⛔', label: 'Rupture' }
    };

    const cfg = qualiteConfig[choice.qualite] || qualiteConfig.neutre;

    // Impact delta
    const deltaHtml = Object.entries(choice.delta || {})
      .filter(([, v]) => v !== 0)
      .map(([k, v]) => {
        const sign = v > 0 ? '+' : '';
        const cls  = v > 0 ? 'delta-pos' : 'delta-neg';
        return `<span class="delta-chip ${cls}">${k} ${sign}${v}</span>`;
      }).join('');

    feedbackEl.className = `feedback-panel ${cfg.cls}`;
    feedbackEl.innerHTML = `
<div class="feedback-header">
  <span class="feedback-icon">${cfg.icon}</span>
  <span class="feedback-quality">${cfg.label}</span>
  <div class="feedback-deltas">${deltaHtml}</div>
</div>
<p class="feedback-text">${choice.feedback}</p>`;
    feedbackEl.hidden = false;
  }

  _showRuptureAlert() {
    const existing = document.getElementById('rupture-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.id = 'rupture-alert';
    alert.className = 'rupture-alert-banner';
    alert.innerHTML = `⛔ <strong>Attention — Rupture relationnelle critique.</strong> L'alliance thérapeutique est sévèrement compromise.`;
    document.getElementById('view-simulation')?.prepend(alert);
    setTimeout(() => alert.remove(), 5000);
  }

  // ─── Baromètre d'alliance ─────────────────────────────────────────────────

  _updateAllianceBarometer() {
    const raw = this.scoringEngine.getRawState();
    const alliance = raw.alliance || 0;

    const baro = document.getElementById('alliance-barometer');
    const baroFill = document.getElementById('barometer-fill');
    const baroLabel = document.getElementById('barometer-label');

    if (!baro || !baroFill) return;

    const pct = alliance;
    let color, label;
    if (pct >= 70)      { color = '#4A7C6F'; label = 'Alliance solide'; }
    else if (pct >= 45) { color = '#2E6B8A'; label = 'Alliance fragile'; }
    else if (pct >= 20) { color = '#E65100'; label = 'Alliance précaire'; }
    else                { color = '#8B4A4A'; label = 'Alliance rompue'; }

    baroFill.style.height = `${pct}%`;
    baroFill.style.background = color;
    if (baroLabel) baroLabel.textContent = label;
  }

  // ─── Rapport final ────────────────────────────────────────────────────────

  _showReport(finReason) {
    const scenario  = this.scenarioEngine.getScenario();
    const duration  = Math.round((Date.now() - this.startTime) / 1000);
    const globalScore = this.scoringEngine.getGlobalScore();

    const reportHTML = this.reportEngine.generateReport({
      scenario,
      scoringEngine:  this.scoringEngine,
      scenarioEngine: this.scenarioEngine,
      finReason,
      duration
    });

    const reportContainer = document.getElementById('report-content');
    if (reportContainer) reportContainer.innerHTML = reportHTML;

    // Sauvegarder dans l'historique
    this.storageEngine.addHistoryRecord({
      scenarioId:   scenario.id,
      titre:        scenario.meta.titre,
      patient:      `${scenario.patient.prenom}, ${scenario.patient.age} ans`,
      finReason,
      globalScore,
      scores:       this.scoringEngine.getDimensionScores(),
      level:        this.scoringEngine.getLevel().code,
      duration
    });

    this.storageEngine.clearSession();
    this.showView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Actions globales ─────────────────────────────────────────────────────

  restartCurrentScenario() {
    if (this.currentScenarioId) this.startScenario(this.currentScenarioId);
  }

  exportCurrentReport() {
    const scenario = this.scenarioEngine.getScenario();
    const data = {
      scenario:     scenario?.id,
      globalScore:  this.scoringEngine.getGlobalScore(),
      scores:       this.scoringEngine.getDimensionScores(),
      level:        this.scoringEngine.getLevel(),
      history:      this.scenarioEngine.getHistory(),
      insights:     this.scoringEngine.getInsights(),
      exportedAt:   new Date().toISOString()
    };
    this.storageEngine.exportJSON(data, `psymulation_${scenario?.id}_${Date.now()}.json`);
  }

  // ─── Session ──────────────────────────────────────────────────────────────

  _saveCurrentSession() {
    if (!this.scenarioEngine.scenario) return;
    this.storageEngine.saveSession({
      scenarioId:    this.currentScenarioId,
      currentStepId: this.scenarioEngine.currentStepId,
      scoringState:  this.scoringEngine.getRawState(),
      history:       this.scenarioEngine.getHistory(),
      startTime:     this.startTime
    });
  }

  _checkResumeSession() {
    // TODO: proposer la reprise si session existante
    // if (this.storageEngine.hasSession()) { ... }
  }

  // ─── Nav ──────────────────────────────────────────────────────────────────

  _bindNav() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => this.showView(el.dataset.nav));
    });
  }

  // ─── UI Helpers ───────────────────────────────────────────────────────────

  _showLoading(show) {
    const el = document.getElementById('loading-overlay');
    if (el) el.hidden = !show;
  }

  _showError(msg) {
    const el = document.getElementById('error-banner');
    if (el) { el.textContent = msg; el.hidden = false; }
    else alert(msg);
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  new PsymulationApp();
});
