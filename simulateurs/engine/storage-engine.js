/**
 * PSYMULATION — StorageEngine
 * Gestion de la persistance locale (localStorage)
 * Version 1.0.0 — Psydiag
 *
 * Fonctionnalités :
 * - Sauvegarde et reprise de session en cours
 * - Historique des simulations terminées
 * - Statistiques utilisateur agrégées
 * - Export JSON
 */

const KEYS = {
  SESSION:    'psymulation_session',
  HISTORY:    'psymulation_history',
  STATS:      'psymulation_stats',
  PREFS:      'psymulation_prefs',
};

class StorageEngine {
  constructor() {
    this._available = this._checkAvailability();
  }

  _checkAvailability() {
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
      return true;
    } catch {
      console.warn('[StorageEngine] localStorage non disponible');
      return false;
    }
  }

  _get(key) {
    if (!this._available) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  _set(key, value) {
    if (!this._available) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[StorageEngine] Erreur d\'écriture :', e);
      return false;
    }
  }

  _remove(key) {
    if (!this._available) return;
    localStorage.removeItem(key);
  }

  // ─── Session en cours ──────────────────────────────────────────────────────

  /**
   * Sauvegarde l'état complet d'une simulation en cours
   */
  saveSession(data) {
    return this._set(KEYS.SESSION, {
      ...data,
      savedAt: Date.now()
    });
  }

  /**
   * Restaure la session sauvegardée
   */
  loadSession() {
    return this._get(KEYS.SESSION);
  }

  /**
   * Supprime la session en cours (après fin ou abandon)
   */
  clearSession() {
    this._remove(KEYS.SESSION);
  }

  hasSession() {
    const s = this.loadSession();
    return s !== null && s.scenarioId !== undefined;
  }

  // ─── Historique ────────────────────────────────────────────────────────────

  /**
   * Enregistre une simulation terminée dans l'historique
   * @param {object} record — { scenarioId, titre, finReason, globalScore, scores, level, duration }
   */
  addHistoryRecord(record) {
    const history = this.getHistory();
    history.unshift({
      id: `sim_${Date.now()}`,
      ...record,
      completedAt: Date.now()
    });
    // Limite à 50 entrées
    if (history.length > 50) history.splice(50);
    this._set(KEYS.HISTORY, history);
    this._updateStats(record);
    return history[0].id;
  }

  getHistory() {
    return this._get(KEYS.HISTORY) || [];
  }

  clearHistory() {
    this._remove(KEYS.HISTORY);
  }

  // ─── Statistiques ──────────────────────────────────────────────────────────

  _updateStats(record) {
    const stats = this.getStats();
    stats.totalSimulations = (stats.totalSimulations || 0) + 1;
    stats.totalDuration = (stats.totalDuration || 0) + (record.duration || 0);

    // Compteur par scénario
    if (!stats.byScenario) stats.byScenario = {};
    if (!stats.byScenario[record.scenarioId]) {
      stats.byScenario[record.scenarioId] = { count: 0, bestScore: 0, scores: [] };
    }
    const sc = stats.byScenario[record.scenarioId];
    sc.count++;
    sc.scores.push(record.globalScore);
    if (record.globalScore > sc.bestScore) sc.bestScore = record.globalScore;
    sc.avgScore = Math.round(sc.scores.reduce((a, b) => a + b, 0) / sc.scores.length);
    if (sc.scores.length > 20) sc.scores.splice(0, sc.scores.length - 20); // garde les 20 derniers

    // Score moyen global
    const allScores = Object.values(stats.byScenario).flatMap(s => s.scores);
    stats.avgGlobalScore = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    this._set(KEYS.STATS, stats);
  }

  getStats() {
    return this._get(KEYS.STATS) || {
      totalSimulations: 0,
      totalDuration: 0,
      avgGlobalScore: 0,
      byScenario: {}
    };
  }

  // ─── Préférences ───────────────────────────────────────────────────────────

  savePrefs(prefs) { this._set(KEYS.PREFS, prefs); }
  loadPrefs() { return this._get(KEYS.PREFS) || {}; }

  // ─── Export ────────────────────────────────────────────────────────────────

  /**
   * Exporte une simulation complète en JSON téléchargeable
   */
  exportJSON(simulationData, filename = 'psymulation_export.json') {
    const blob = new Blob(
      [JSON.stringify(simulationData, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Export PDF — TODO: implémenter avec jsPDF ou window.print()
   * Placeholder structurel pour intégration future
   */
  exportPDF(reportHTML, filename = 'psymulation_rapport.pdf') {
    // TODO: intégration jsPDF ou service cloud
    console.info('[StorageEngine] Export PDF TODO — filename:', filename);
    window.print();
  }
}

export default StorageEngine;
