/**
 * PSYMULATION — ScoringEngine
 * Moteur de scoring multidimensionnel
 * Version 1.0.0 — Psydiag
 *
 * Gère 8 dimensions indépendantes :
 * alliance | ecoute | validation | exploration | rythme | directivite | silence | securisation
 *
 * Chaque dimension est bornée [0, 100].
 * La directivité est une dimension "inverse" (haute directivité = moins bon score global).
 */

class ScoringEngine {
  constructor() {
    this.state = {};
    this.initialState = {};
    this.history = [];   // [{stepId, choiceId, delta, stateAfter, timestamp}]
    this.dimensions = [];
    this._inverses = ['directivite'];  // dimensions où haut = mauvais
  }

  // ─── Initialisation ────────────────────────────────────────────────────────

  /**
   * Initialise le scoring depuis le bloc `scoring` du scénario
   * @param {object} scenarioScoring — { dimensions, depart }
   */
  init(scenarioScoring) {
    this.dimensions = scenarioScoring.dimensions || [];
    this.state = { ...scenarioScoring.depart };
    this.initialState = { ...scenarioScoring.depart };
    this.history = [];
  }

  // ─── Application des deltas ────────────────────────────────────────────────

  /**
   * Applique un delta à l'état courant
   * @param {object} delta — ex: { alliance: +8, validation: +5, directivite: -3 }
   * @param {string} stepId — pour l'historique
   * @param {string} choiceId — pour l'historique
   */
  applyDelta(delta, stepId = '', choiceId = '') {
    if (!delta) return;

    const previous = { ...this.state };

    for (const [dim, value] of Object.entries(delta)) {
      if (!(dim in this.state)) {
        console.warn(`[ScoringEngine] Dimension inconnue : ${dim}`);
        continue;
      }
      this.state[dim] = this._clamp(this.state[dim] + value);
    }

    this.history.push({
      stepId,
      choiceId,
      delta,
      stateBefore: previous,
      stateAfter: { ...this.state },
      timestamp: Date.now()
    });
  }

  _clamp(value) {
    return Math.max(0, Math.min(100, value));
  }

  // ─── Calculs de scores ─────────────────────────────────────────────────────

  /**
   * Score global sur 100, en tenant compte des dimensions inverses
   */
  getGlobalScore() {
    if (this.dimensions.length === 0) return 50;

    const normalizedValues = this.dimensions.map(dim => {
      const raw = this.state[dim] || 0;
      return this._inverses.includes(dim) ? 100 - raw : raw;
    });

    const total = normalizedValues.reduce((a, b) => a + b, 0);
    return Math.round(total / normalizedValues.length);
  }

  /**
   * Score par dimension (corrigé pour les inverses)
   * @returns {object} — { alliance: 72, ecoute: 68, ... }
   */
  getDimensionScores() {
    const scores = {};
    for (const dim of this.dimensions) {
      const raw = this.state[dim] || 0;
      scores[dim] = this._inverses.includes(dim) ? 100 - raw : raw;
    }
    return scores;
  }

  /**
   * Retourne l'état brut (sans correction inverse)
   */
  getRawState() {
    return { ...this.state };
  }

  /**
   * Niveau global en 4 paliers
   */
  getLevel() {
    const score = this.getGlobalScore();
    if (score >= 80) return { code: 'expert',        label: 'Expert',        color: '#2E7D32' };
    if (score >= 65) return { code: 'confirme',      label: 'Confirmé',      color: '#4A7C6F' };
    if (score >= 45) return { code: 'intermediaire', label: 'Intermédiaire', color: '#E65100' };
    return           { code: 'debutant',             label: 'Débutant',      color: '#8B4A4A' };
  }

  /**
   * Forces et axes d'amélioration
   * @returns {{ forces: string[], axes: string[] }}
   */
  getInsights() {
    const scores = this.getDimensionScores();
    const labels = {
      alliance:     'Alliance thérapeutique',
      ecoute:       'Écoute active',
      validation:   'Validation émotionnelle',
      exploration:  'Exploration clinique',
      rythme:       'Respect du rythme',
      directivite:  'Non-directivité',
      silence:      'Gestion du silence',
      securisation: 'Sécurisation de la parole'
    };

    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const forces = sorted.slice(0, 3).filter(([, v]) => v >= 55).map(([k]) => labels[k] || k);
    const axes   = sorted.slice(-3).filter(([, v]) => v < 60).map(([k]) => labels[k] || k);

    return { forces, axes };
  }

  /**
   * Données pour le radar chart (format {label, value} array)
   */
  getRadarData() {
    const scores = this.getDimensionScores();
    const labels = {
      alliance:     'Alliance',
      ecoute:       'Écoute',
      validation:   'Validation',
      exploration:  'Exploration',
      rythme:       'Rythme',
      directivite:  'Non-directivité',
      silence:      'Silence',
      securisation: 'Sécurisation'
    };
    return this.dimensions.map(dim => ({
      dim,
      label: labels[dim] || dim,
      value: scores[dim] || 0
    }));
  }

  /**
   * Analyse pédagogique textuelle générée depuis les scores
   */
  getPedagogicalAnalysis(scenario) {
    const score = this.getGlobalScore();
    const scores = this.getDimensionScores();
    const level = this.getLevel();
    const { forces, axes } = this.getInsights();
    const historyChoices = this.history;

    // Comptage des qualités
    const qualiteCounts = { excellent: 0, bien: 0, neutre: 0, maladroit: 0, rupture: 0 };
    historyChoices.forEach(h => {
      // Récupérer la qualité depuis l'historique ScenarioEngine via stepId/choiceId
    });

    const paragraphes = [];

    // Introduction
    paragraphes.push(`Votre simulation a obtenu un score global de **${score}/100**, correspondant au niveau **${level.label}**.`);

    // Forces
    if (forces.length > 0) {
      paragraphes.push(`**Points forts observés :** ${forces.join(', ')}. Ces compétences constituent le socle de votre pratique actuelle et ont contribué positivement à la dynamique relationnelle.`);
    }

    // Axes
    if (axes.length > 0) {
      paragraphes.push(`**Axes de progression prioritaires :** ${axes.join(', ')}. Ces dimensions ont limité la qualité de l'alliance ou de l'exploration clinique au cours de cet entretien.`);
    }

    // Analyse spécifique par dimension basse
    if (scores.alliance < 50) {
      paragraphes.push(`L'**alliance thérapeutique** a été fortement impactée. Dans les entretiens avec des patients traumatisés ou vulnérables, la qualité du lien est le premier outil thérapeutique. Des interventions précoces ou trop directives ont fragilisé la relation.`);
    }
    if (scores.securisation < 50) {
      paragraphes.push(`La **sécurisation de la parole** a été insuffisante. Le patient n'a pas suffisamment ressenti que l'espace était safe pour se livrer. Travailler sur les signaux non verbaux et les premiers échanges est recommandé.`);
    }
    if (scores.validation < 50) {
      paragraphes.push(`La **validation émotionnelle** a manqué à plusieurs reprises. Des réponses de réassurance prématurée ou des transitions trop rapides vers l'exploration factuelle ont laissé le patient sans accueil de son vécu.`);
    }
    if ((100 - (this.state.directivite || 50)) < 40) {
      paragraphes.push(`La **directivité excessive** a été l'un des obstacles principaux. Poser des questions factuelles avant l'accueil émotionnel, ou prendre le contrôle du rythme de l'entretien, réduit l'espace d'expression du patient.`);
    }

    // Recommandation pédagogique
    paragraphes.push(`**Pour progresser :** Révisez les interventions notées 'maladroit' ou 'rupture' dans le détail des étapes. Ces moments constituent les opportunités d'apprentissage les plus fertiles. Reconsultez les objectifs pédagogiques du scénario et tentez une nouvelle simulation en ciblant spécifiquement ces points.`);

    return paragraphes;
  }

  getHistory() { return [...this.history]; }

  reset() {
    this.state = { ...this.initialState };
    this.history = [];
  }
}

export default ScoringEngine;
