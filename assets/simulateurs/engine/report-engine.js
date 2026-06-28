/**
 * PSYMULATION — ReportEngine
 * Génération du tableau de bord final
 * Version 1.0.0 — Psydiag
 *
 * Produit le HTML du rapport final + le radar SVG des compétences
 */

class ReportEngine {
  constructor() {}

  /**
   * Génère le rapport complet (HTML string injecté dans la DOM)
   * @param {object} params
   * @param {object} params.scenario — scénario complet
   * @param {object} params.scoringEngine — instance ScoringEngine
   * @param {object} params.scenarioEngine — instance ScenarioEngine
   * @param {string} params.finReason — 'succes' | 'partiel' | 'echec'
   * @param {number} params.duration — durée en secondes
   */
  generateReport({ scenario, scoringEngine, scenarioEngine, finReason, duration }) {
    const globalScore = scoringEngine.getGlobalScore();
    const dimScores   = scoringEngine.getDimensionScores();
    const radarData   = scoringEngine.getRadarData();
    const level       = scoringEngine.getLevel();
    const insights    = scoringEngine.getInsights();
    const analysis    = scoringEngine.getPedagogicalAnalysis(scenario);
    const history     = scenarioEngine.getHistory();
    const finMsg      = scenarioEngine.getFinMessage();

    const finColors = {
      succes:  '#2E7D32',
      partiel: '#E65100',
      echec:   '#8B4A4A'
    };
    const finColor = finColors[finReason] || '#333';

    const radarSVG = this._buildRadarSVG(radarData);
    const dimBarsHTML = this._buildDimensionBars(dimScores);
    const historyHTML = this._buildHistoryTable(history, scenario);
    const analysisHTML = analysis.map(p =>
      `<p class="report-para">${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`
    ).join('');
    const forcesHTML = insights.forces.length
      ? insights.forces.map(f => `<span class="tag tag-force">${f}</span>`).join('')
      : '<em>—</em>';
    const axesHTML = insights.axes.length
      ? insights.axes.map(a => `<span class="tag tag-axe">${a}</span>`).join('')
      : '<em>—</em>';
    const durationStr = duration ? this._formatDuration(duration) : '—';

    return `
<div class="report-container">

  <!-- EN-TÊTE -->
  <div class="report-header">
    <div class="report-patient">
      <div class="patient-avatar-lg" style="background:${scenario.patient.avatar_couleur}">
        ${scenario.patient.avatar_initiales}
      </div>
      <div>
        <div class="report-patient-name">${scenario.patient.prenom}, ${scenario.patient.age} ans</div>
        <div class="report-scenario-title">${scenario.meta.titre}</div>
        <div class="report-meta">CIM-11 : ${scenario.meta.reference_cim11} · Durée : ${durationStr}</div>
      </div>
    </div>
    <div class="report-verdict" style="border-left: 4px solid ${finColor}">
      <div class="verdict-label">Issue de la simulation</div>
      <div class="verdict-title" style="color:${finColor}">${finMsg?.titre || finReason}</div>
      <div class="verdict-message">${finMsg?.message || ''}</div>
    </div>
  </div>

  <!-- SCORE GLOBAL + NIVEAU -->
  <div class="report-scores-row">
    <div class="score-global-card">
      <div class="score-number">${globalScore}</div>
      <div class="score-label">Score global / 100</div>
      <div class="score-progress">
        <div class="score-bar" style="width:${globalScore}%; background:${level.color}"></div>
      </div>
    </div>
    <div class="level-card" style="border-color:${level.color}">
      <div class="level-icon">${this._levelIcon(level.code)}</div>
      <div class="level-label" style="color:${level.color}">${level.label}</div>
      <div class="level-desc">${this._levelDesc(level.code)}</div>
    </div>
  </div>

  <!-- RADAR + BARRES -->
  <div class="report-visual-row">
    <div class="radar-card">
      <h3 class="card-title">Radar des compétences</h3>
      ${radarSVG}
    </div>
    <div class="bars-card">
      <h3 class="card-title">Scores par dimension</h3>
      ${dimBarsHTML}
    </div>
  </div>

  <!-- FORCES & AXES -->
  <div class="report-insights-row">
    <div class="insight-card insight-forces">
      <h3 class="card-title">✦ Points forts</h3>
      <div class="tags-container">${forcesHTML}</div>
    </div>
    <div class="insight-card insight-axes">
      <h3 class="card-title">◈ Axes de progression</h3>
      <div class="tags-container">${axesHTML}</div>
    </div>
  </div>

  <!-- ANALYSE PÉDAGOGIQUE -->
  <div class="report-analysis-card">
    <h3 class="card-title">Analyse pédagogique détaillée</h3>
    <div class="analysis-content">${analysisHTML}</div>
  </div>

  <!-- OBJECTIFS PÉDAGOGIQUES DU SCÉNARIO -->
  <div class="report-objectives-card">
    <h3 class="card-title">Objectifs pédagogiques du scénario</h3>
    <ul class="objectives-list">
      ${(scenario.objectifs_pedagogiques || []).map(o => `<li>${o}</li>`).join('')}
    </ul>
    <h4 class="card-subtitle">Pièges relationnels identifiés</h4>
    <ul class="traps-list">
      ${(scenario.pieges_relationnels || []).map(p => `<li>⚠ ${p}</li>`).join('')}
    </ul>
  </div>

  <!-- HISTORIQUE DES CHOIX -->
  <div class="report-history-card">
    <h3 class="card-title">Détail des interventions</h3>
    ${historyHTML}
  </div>

  <!-- ACTIONS -->
  <div class="report-actions">
    <button class="btn-report btn-retry" onclick="window.psymulation?.restart()">
      ↺ Recommencer
    </button>
    <button class="btn-report btn-export" onclick="window.psymulation?.exportReport()">
      ↓ Exporter JSON
    </button>
    <button class="btn-report btn-home" onclick="window.psymulation?.goHome()">
      ← Choisir un scénario
    </button>
  </div>

</div>`;
  }

  // ─── Radar SVG ─────────────────────────────────────────────────────────────

  _buildRadarSVG(radarData) {
    const cx = 160, cy = 160, r = 110;
    const n = radarData.length;
    const levels = 4;

    // Grille
    let gridPaths = '';
    for (let l = 1; l <= levels; l++) {
      const fr = (r * l) / levels;
      const pts = Array.from({ length: n }, (_, i) => {
        const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
        return `${cx + fr * Math.cos(angle)},${cy + fr * Math.sin(angle)}`;
      }).join(' ');
      gridPaths += `<polygon points="${pts}" fill="none" stroke="#dde2ea" stroke-width="1"/>`;
    }

    // Axes
    let axes = '';
    radarData.forEach((d, i) => {
      const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      axes += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#dde2ea" stroke-width="1"/>`;
    });

    // Labels
    let labels = '';
    radarData.forEach((d, i) => {
      const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
      const lx = cx + (r + 22) * Math.cos(angle);
      const ly = cy + (r + 22) * Math.sin(angle);
      labels += `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#4a5568" font-family="Inter,sans-serif">${d.label}</text>`;
    });

    // Valeurs
    const pts = radarData.map((d, i) => {
      const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
      const fr = (r * d.value) / 100;
      return `${cx + fr * Math.cos(angle)},${cy + fr * Math.sin(angle)}`;
    }).join(' ');

    return `
<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:320px;display:block;margin:auto">
  ${gridPaths}
  ${axes}
  <polygon points="${pts}" fill="rgba(46,107,138,0.2)" stroke="#2E6B8A" stroke-width="2.5" stroke-linejoin="round"/>
  ${radarData.map((d, i) => {
    const angle = (i * 2 * Math.PI / n) - Math.PI / 2;
    const fr = (r * d.value) / 100;
    const px = cx + fr * Math.cos(angle);
    const py = cy + fr * Math.sin(angle);
    return `<circle cx="${px}" cy="${py}" r="4" fill="#2E6B8A" stroke="white" stroke-width="1.5"/>`;
  }).join('')}
  ${labels}
</svg>`;
  }

  // ─── Barres de dimensions ──────────────────────────────────────────────────

  _buildDimensionBars(dimScores) {
    const labels = {
      alliance:     'Alliance thérapeutique',
      ecoute:       'Écoute active',
      validation:   'Validation émotionnelle',
      exploration:  'Exploration clinique',
      rythme:       'Respect du rythme',
      directivite:  'Non-directivité',
      silence:      'Gestion du silence',
      securisation: 'Sécurisation'
    };

    return Object.entries(dimScores).map(([dim, score]) => {
      const color = score >= 70 ? '#4A7C6F' : score >= 45 ? '#2E6B8A' : '#8B4A4A';
      return `
<div class="dim-bar-row">
  <span class="dim-label">${labels[dim] || dim}</span>
  <div class="dim-bar-track">
    <div class="dim-bar-fill" style="width:${score}%;background:${color}"></div>
  </div>
  <span class="dim-score" style="color:${color}">${score}</span>
</div>`;
    }).join('');
  }

  // ─── Tableau historique ────────────────────────────────────────────────────

  _buildHistoryTable(history, scenario) {
    if (!history.length) return '<p>Aucune intervention enregistrée.</p>';

    const qualiteLabels = {
      excellent: { label: 'Excellent', cls: 'q-excellent' },
      bien:      { label: 'Bien',      cls: 'q-bien' },
      neutre:    { label: 'Neutre',    cls: 'q-neutre' },
      maladroit: { label: 'Maladroit', cls: 'q-maladroit' },
      rupture:   { label: 'Rupture',   cls: 'q-rupture' }
    };

    const rows = history.map((h, idx) => {
      // Retrouver l'étape et le choix
      const step   = scenario.etapes.find(e => e.id === h.stepId);
      const choice = step?.reponses?.find(r => r.id === h.choiceId);
      const q      = qualiteLabels[h.qualite] || { label: h.qualite, cls: 'q-neutre' };
      const deltaStr = Object.entries(h.delta || {})
        .map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`)
        .join(', ');

      return `
<tr>
  <td class="hist-num">${idx + 1}</td>
  <td class="hist-step">${step?.titre || h.stepId}</td>
  <td class="hist-choice">${choice?.texte || h.choiceId}</td>
  <td><span class="qualite-badge ${q.cls}">${q.label}</span></td>
  <td class="hist-delta">${deltaStr}</td>
</tr>`;
    }).join('');

    return `
<table class="history-table">
  <thead>
    <tr>
      <th>#</th><th>Étape</th><th>Intervention</th><th>Qualité</th><th>Impact</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>`;
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  _levelIcon(code) {
    return { expert: '◈', confirme: '◆', intermediaire: '◇', debutant: '○' }[code] || '○';
  }

  _levelDesc(code) {
    return {
      expert:        'Maîtrise clinique avancée — posture rigoureuse et nuancée',
      confirme:      'Compétences solides — quelques ajustements possibles',
      intermediaire: 'Base en construction — lacunes identifiables',
      debutant:      'Débuts prometteurs — travail de fond nécessaire'
    }[code] || '';
  }

  _formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}min ${s}s`;
  }
}

export default ReportEngine;
