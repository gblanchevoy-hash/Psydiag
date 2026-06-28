/**
 * PSYMULATION — ScenarioEngine
 * Moteur principal de simulation clinique
 * Version 1.0.0 — Psydiag
 *
 * Responsabilités :
 * - Chargement dynamique des scénarios JSON
 * - Gestion de l'état de la simulation (étape courante, progression)
 * - Navigation entre les étapes (y compris les branches conditionnelles)
 * - Détection des conditions de rupture et de fin
 */

class ScenarioEngine {
  constructor() {
    this.scenario = null;
    this.currentStepId = null;
    this.history = [];       // [{stepId, choiceId, delta, timestamp}]
    this.isFinished = false;
    this.finReason = null;   // 'succes' | 'partiel' | 'echec'
    this._listeners = {};
  }

  // ─── Chargement ────────────────────────────────────────────────────────────

  /**
   * Charge un scénario depuis un fichier JSON
   * @param {string} path — chemin vers le fichier JSON
   * @returns {Promise<object>} — scénario chargé
   */
  async loadScenario(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status} pour ${path}`);
      this.scenario = await response.json();
      this._validateScenario(this.scenario);
      this.currentStepId = this.scenario.etapes[0].id;
      this.isFinished = false;
      this.finReason = null;
      this.history = [];
      this._emit('scenarioLoaded', this.scenario);
      return this.scenario;
    } catch (err) {
      console.error('[ScenarioEngine] Erreur de chargement :', err);
      throw err;
    }
  }

  /**
   * Validation minimale du schéma JSON
   */
  _validateScenario(s) {
    if (!s.id) throw new Error('Scénario sans id');
    if (!Array.isArray(s.etapes) || s.etapes.length === 0)
      throw new Error('Scénario sans étapes');
    if (!s.scoring || !s.scoring.depart)
      throw new Error('Scénario sans bloc scoring.depart');
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  /**
   * Retourne l'étape courante
   */
  getCurrentStep() {
    return this._getStepById(this.currentStepId);
  }

  /**
   * Retourne une étape par son id
   */
  _getStepById(id) {
    return this.scenario.etapes.find(e => e.id === id) || null;
  }

  /**
   * Applique un choix et avance dans le scénario
   * @param {string} choiceId — identifiant de la réponse choisie
   * @param {object} scoringState — état actuel du scoring (référence ScoringEngine)
   * @returns {object} résultat { step, choice, nextStepId, isFinished, finReason, alerte }
   */
  applyChoice(choiceId, scoringState) {
    if (this.isFinished) {
      console.warn('[ScenarioEngine] Simulation déjà terminée');
      return null;
    }

    const step = this.getCurrentStep();
    if (!step) throw new Error(`Étape introuvable : ${this.currentStepId}`);

    const choice = step.reponses.find(r => r.id === choiceId);
    if (!choice) throw new Error(`Choix introuvable : ${choiceId}`);

    // Enregistrement dans l'historique
    this.history.push({
      stepId: step.id,
      choiceId: choice.id,
      qualite: choice.qualite,
      delta: choice.delta,
      timestamp: Date.now()
    });

    // Détermination de la prochaine étape
    const nextId = choice.suite;
    let isFinished = false;
    let finReason = null;

    if (nextId === 'FIN') {
      isFinished = true;
      finReason = this._computeFinReason(scoringState);
    } else {
      const nextStep = this._getStepById(nextId);
      if (!nextStep) {
        console.warn(`[ScenarioEngine] Étape suivante "${nextId}" introuvable — fin forcée`);
        isFinished = true;
        finReason = this._computeFinReason(scoringState);
      } else {
        this.currentStepId = nextId;
      }
    }

    this.isFinished = isFinished;
    this.finReason = finReason;

    // Vérification rupture d'alliance critique
    const alerte = choice.alerte || null;
    const alliances = scoringState?.alliance ?? 50;
    const ruptureForced = alliances <= (this.scenario.scoring.seuil_rupture_alliance || 5);

    if (ruptureForced && !isFinished) {
      this.isFinished = true;
      this.finReason = 'echec';
    }

    const result = {
      step,
      choice,
      nextStepId: isFinished ? null : this.currentStepId,
      isFinished: this.isFinished,
      finReason: this.finReason,
      alerte,
      ruptureForced
    };

    this._emit('choiceApplied', result);
    if (this.isFinished) this._emit('simulationFinished', { finReason: this.finReason });

    return result;
  }

  /**
   * Calcule la raison de fin selon le score global
   */
  _computeFinReason(scoringState) {
    if (!scoringState) return 'partiel';
    const global = this._computeGlobalScore(scoringState);
    const fins = this.scenario.fins;
    if (global >= fins.succes.seuil_score) return 'succes';
    if (global >= fins.partiel.seuil_score) return 'partiel';
    return 'echec';
  }

  /**
   * Calcule le score global (moyenne pondérée des dimensions)
   */
  _computeGlobalScore(state) {
    const dims = this.scenario.scoring.dimensions;
    if (!dims || dims.length === 0) return 50;
    const total = dims.reduce((sum, d) => sum + (state[d] || 0), 0);
    return Math.round(total / dims.length);
  }

  // ─── Accesseurs ────────────────────────────────────────────────────────────

  getHistory() { return [...this.history]; }
  getScenario() { return this.scenario; }
  getProgress() {
    if (!this.scenario) return 0;
    const total = this.scenario.etapes.length;
    const done = this.history.length;
    return Math.round((done / total) * 100);
  }
  getFinMessage() {
    if (!this.isFinished || !this.finReason) return null;
    return this.scenario.fins[this.finReason] || null;
  }

  // ─── Événements ────────────────────────────────────────────────────────────

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
  }
  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  }
}

export default ScenarioEngine;
