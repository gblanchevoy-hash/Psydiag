/* ================================================================
   PSYDIAG — Module S.P.I.R.A.L.E.
   Logique complète : canvas neuronal, scoring pondéré A/M/P,
   radar canvas, synthèse clinique, export PDF
   ================================================================ */

'use strict';

/* ── ÉTAT GLOBAL ─────────────────────────────────────────────── */
var state = {
  S: 0, P: 0, I: 0, R: 0, A: 0, L: 0, E: 0,
  items: {},      // id -> niveau (0=Absent, 1=Modéré, 2=Présent)
  synthText: ''
};

/* ── LISTE DES ITEMS PAR AXE ─────────────────────────────────── */
var AXIS_ITEMS = {
  S: ['sS1','sS2','sS3','sS4','sS5','sS6','sS7'],
  P: ['sP2','sP3','sP4','sP5','sP6'],
  I: ['sI1','sI2','sI3','sI4'],
  R: ['sR1','sR2','sR3','sR4','sR5'],
  A: ['sA1','sA2','sA3','sA4','sA5'],
  L: ['sL1','sL2','sL3','sL4','sL5'],
  E: ['sE1','sE2','sE3','sE4','sE5','sE6','sE7']
};

/* ── PONDÉRATION "PRÉSENT" (niveau=2). Modéré(1) = pondération/2.
   Items spéciaux (sS7, sL*) gérés séparément dans computeAxisScore. */
var ITEM_WEIGHTS = {
  sS1: 2, sS2: 1, sS3: 2, sS4: 1, sS5: 2, sS6: 2,
  /* sS7 spécial — anesthésie émotionnelle, conditionnel à l'axe P */
  sP2: 1, sP3: 3, sP4: 1, sP5: 3, sP6: 1,
  sI1: 1, sI2: 1, sI3: 1, sI4: 1,
  sR1: -3, sR2: -2, sR3: -2, sR4: -2, sR5: -2,
  sA1: 1, sA2: 2, sA3: 2, sA4: 3, sA5: 2,
  /* sL1..sL5 — valeurs fixes (sélection unique), voir L_VALUES */
  sE1: 2, sE2: 1, sE3: 2, sE4: 2, sE5: 2, sE6: 2, sE7: 2
};

/* Axe L — sélection unique parmi 5 niveaux de létalité */
var L_VALUES = { sL1: 0, sL2: 1, sL3: 2.5, sL4: 4, sL5: 5 };

var AXIS_MULT = { S:1.2, P:1.6, I:1.1, R:1.4, A:1.3, L:1.7, E:1.1 };

/* Score maximal par axe (niveau Présent partout, hors exclusions mutuelles) */
var AXIS_MAX  = { S:13, P:9, I:4, R:16, A:10, L:5, E:13 }; // R: amplitude totale -11..+5 = 16

/* MAX_RAW = somme (axMax × multiplicateur) pour S,P,I,A,L,E (R exclu, soustractif) */
var MAX_RAW = 77.2; // inclut R défavorable (+5×1.4) en cas d'absence totale de ressources

var AXIS_COLORS = {
  S:'#ef4444', P:'#f97316', I:'#eab308',
  R:'#22c55e', A:'#8b5cf6', L:'#dc2626', E:'#f59e0b'
};

var AXIS_NAMES = {
  S:'Souffrance psychique', P:'Projet suicidaire', I:'Isolement social',
  R:'Ressources protectrices', A:'Antécédents / Vulnérabilités',
  L:'Létalité potentielle', E:'Éléments aggravants'
};

var AMP_LABELS = ['Absent','Modéré','Présent'];

/* ── ACCÈS NIVEAU D'UN ITEM ──────────────────────────────────── */
function itemLevel(id) {
  return state.items[id] || 0;
}

/* ── VALEUR D'UN ITEM SELON SON NIVEAU ───────────────────────── */
function itemValue(id) {
  var lvl = itemLevel(id);
  if (lvl === 0) return 0;
  var pond = ITEM_WEIGHTS[id];
  if (pond === undefined) return 0;
  return lvl === 2 ? pond : pond / 2;
}

/* ── CALCUL DU SCORE D'UN AXE (avec logiques conditionnelles) ─── */
function computeAxisScore(axis) {
  var ids = AXIS_ITEMS[axis];

  // Axe L — sélection unique
  if (axis === 'L') {
    var selected = ids.find(function(id){ return itemLevel(id) >= 2; });
    return selected ? L_VALUES[selected] : 0;
  }

  var total = 0;

  if (axis === 'R') {
    ids.forEach(function(id) {
      var lvl = itemLevel(id);
      if (lvl === 0) total += 1;          // Absence de ressource = facteur de risque (+1)
      else total += itemValue(id);        // Modéré/Présent = effet protecteur (négatif)
    });
    return total;
  }

  ids.forEach(function(id) {

    // sS7 — anesthésie émotionnelle, conditionnée par l'axe P
    if (id === 'sS7') {
      var lvlS7 = itemLevel('sS7');
      if (lvlS7 > 0) {
        var base;
        if (itemLevel('sP5') > 0 || itemLevel('sP6') > 0)      base = 3;
        else if (itemLevel('sP3') > 0 || itemLevel('sP4') > 0) base = 2;
        else if (itemLevel('sP2') > 0)                          base = 1;

        else                                                     base = 0;
        total += lvlS7 === 2 ? base : base / 2;
      }
      return;
    }

    total += itemValue(id);
  });

  return total;
}

/* ── RENDU VISUEL D'UN ITEM A/M/P ────────────────────────────── */
function renderItem(id) {
  var wrap = document.querySelector('[data-item="' + id + '"]');
  if (!wrap) return;
  var lvl = itemLevel(id);
  wrap.querySelectorAll('.sp-amp-btn').forEach(function(btn) {
    var v = parseInt(btn.getAttribute('data-v'));
    btn.classList.toggle('active', v === lvl);
  });
  wrap.classList.toggle('sp-item-active', lvl > 0);
}

/* ── CLIC SUR UN BOUTON A/M/P ─────────────────────────────────── */
function setAMP(id, level) {
  var wrap = document.querySelector('[data-item="' + id + '"]');
  if (wrap && wrap.classList.contains('sp-item-disabled')) return;

  var current = itemLevel(id);
  state.items[id] = (current === level) ? 0 : level;

  renderItem(id);
  updateGating();
  computeScore();
  drawRadar();
}

/* ── SÉLECTION UNIQUE AXE L (létalité) ────────────────────────── */
function selectLethality(id) {
  var current = itemLevel(id);
  AXIS_ITEMS.L.forEach(function(lid) { state.items[lid] = 0; });
  state.items[id] = current >= 2 ? 0 : 2;
  AXIS_ITEMS.L.forEach(function(lid) {
    var wrap = document.querySelector('[data-item="' + lid + '"]');
    if (wrap) wrap.classList.toggle('sp-item-active', itemLevel(lid) >= 2);
  });
  computeScore();
  drawRadar();
}

/* ── ACTIVER/DÉSACTIVER UN ITEM (exclusions mutuelles axe P) ──── */
function setItemDisabled(id, disabled) {
  var wrap = document.querySelector('[data-item="' + id + '"]');
  if (!wrap) return;
  wrap.classList.toggle('sp-item-disabled', disabled);
}

/* ── GESTION DES EXCLUSIONS MUTUELLES — AXE P ─────────────────── */
function updateGating() {
  // P2 (« Idées passives de mort ») et P3 (« Idées suicidaires actives ») — exclusion mutuelle.
  // P3 Modéré/Présent déverrouille P4, P5, P6.
  var p2 = itemLevel('sP2') > 0;
  var p3 = itemLevel('sP3') > 0;

  // Exclusion mutuelle P2 ↔ P3 (logique : on ne peut pas avoir à la fois
  // des idées passives et des idées actives comme niveaux indépendants)
  // En fait ici P2=idées passives, P3=idées actives — cochables ensemble
  // La demande est : P2 Absent si P3 coché, et inversement P3 Absent si P2 coché
  // => exclusion mutuelle stricte

  if (p3) {
    setItemDisabled('sP2', true);
    if (itemLevel('sP2') > 0) { state.items.sP2 = 0; renderItem('sP2'); }
  } else {
    setItemDisabled('sP2', false);
  }

  if (p2) {
    setItemDisabled('sP3', true);
    if (itemLevel('sP3') > 0) { state.items.sP3 = 0; renderItem('sP3'); }
  } else {
    setItemDisabled('sP3', false);
  }

  // P4, P5, P6 nécessitent P3 Modéré/Présent
  ['sP4','sP5','sP6'].forEach(function(id) {
    setItemDisabled(id, !p3);
    if (!p3 && itemLevel(id) > 0) {
      state.items[id] = 0;
      renderItem(id);
    }
  });
}

/* ── CALCUL GLOBAL DU SCORE ───────────────────────────────────── */
function computeScore() {
  state.S = computeAxisScore('S');
  state.P = computeAxisScore('P');
  state.I = computeAxisScore('I');
  state.R = computeAxisScore('R');
  state.A = computeAxisScore('A');
  state.L = computeAxisScore('L');
  state.E = computeAxisScore('E');

  var S=state.S, P=state.P, I=state.I, R=state.R, A=state.A, L=state.L, E=state.E;

  // R est déjà négatif (pondérations protectrices négatives) → addition directe
  var raw = 1.2*S + 1.6*P + 1.1*I + 1.3*A + 1.7*L + 1.1*E + 1.4*R;
  var index = Math.max(0, Math.min(100, Math.round((raw / MAX_RAW) * 100)));

  // Concordance avec les alertes critiques : une alerte "Urgence absolue" ou
  // "triadique" représente un danger catégoriel qui ne peut pas être masqué
  // par un score global modéré — l'indice est plancher à un niveau critique.
  var alertFlags = getAlertFlags();
  if (alertFlags.triadic)            index = Math.max(index, 95);
  else if (alertFlags.absolute)      index = Math.max(index, 90);
  else if (alertFlags.structural || alertFlags.impulsive) index = Math.max(index, 70);

  // Affichages par axe
  ['S','P','I','A','L','E'].forEach(function(ax) {
    var d = document.getElementById('display-' + ax);
    if (d) d.textContent = (Math.round(state[ax]*10)/10).toString();
  });
  var dR = document.getElementById('display-R');
  if (dR) dR.textContent = (Math.round(state.R*10)/10).toString();

  // Bandeau
  var indexEl = document.getElementById('sp-risk-index');
  var barEl   = document.getElementById('sp-score-bar');
  var levelEl = document.getElementById('sp-score-level');
  var domEl   = document.getElementById('sp-dominance');

  if (indexEl) indexEl.textContent = index;

  // Formule masquée dans le bandeau

  // Couleur de la barre
  var color = index <= 20 ? '#22c55e'
             : index <= 40 ? '#f59e0b'
             : index <= 65 ? '#f97316'
             : index <= 85 ? '#ef4444'
             : '#991b1b';

  if (barEl) { barEl.style.width = index+'%'; barEl.style.background = color; }

  // Texte de niveau
  var levels = [
    [20,'Bas — vigilance de routine'],
    [40,'Modéré — surveillance renforcée'],
    [65,'Élevé — intervention active requise'],
    [85,'Très élevé — urgence psychiatrique'],
    [100,'Critique — danger imminent']
  ];
  var levelText = 'Critique — danger imminent';
  for (var i=0;i<levels.length;i++) {
    if (index <= levels[i][0]) { levelText = levels[i][1]; break; }
  }
  if (levelEl) { levelEl.textContent = levelText; levelEl.style.color = color; }

  // Axe dominant (R exclu — protecteur, non « à risque »)
  var riskAxes = {S:1.2*S, P:1.6*P, I:1.1*I, A:1.3*A, L:1.7*L, E:1.1*E};
  var total = Object.values(riskAxes).reduce(function(a,b){return a+b;},0);
  if (total > 0) {
    var dominant = Object.entries(riskAxes).reduce(function(a,b){return b[1]>a[1]?b:a;});
    var pct = Math.round(dominant[1]/total*100);
    if (domEl) domEl.textContent = 'Axe dominant : ' + AXIS_NAMES[dominant[0]] + ' (' + dominant[0] + ') — ' + pct + '% du profil';
  } else {
    if (domEl) domEl.textContent = '';
  }

  checkAlerts();

  return { raw: raw, index: index, color: color, levelText: levelText };
}

/* ── ALERTES CRITIQUES ─────────────────────────────────────────
   Logique issue du tableur SPIRALE :
   - « Urgence absolue » si P3 à P6 (≥ Modéré) + A3 et/ou A4
   - « Urgence absolue » si L4/L5 sélectionné + A1 à A4 (≥ Modéré)
   ──────────────────────────────────────────────────────────── */
function getAlertFlags() {
  var planningActive = ['sP3','sP4','sP5','sP6'].some(function(id){ return itemLevel(id) > 0; });
  var addictOrImpuls = itemLevel('sA3') > 0 || itemLevel('sA4') > 0;
  var anteAny         = ['sA1','sA2','sA3','sA4'].some(function(id){ return itemLevel(id) > 0; });
  var lethalHigh      = itemLevel('sL4') >= 2 || itemLevel('sL5') >= 2;
  var activeIdeas     = itemLevel('sP3') > 0;
  var impulsivity     = itemLevel('sA4') > 0;
  var lethalAvail     = itemLevel('sL3') >= 2 || itemLevel('sL4') >= 2 || itemLevel('sL5') >= 2;

  var flags = {
    planningAddiction: planningActive && addictOrImpuls,
    lethalAntecedents: lethalHigh && anteAny,
    triadic: lethalAvail && activeIdeas && impulsivity,
    structural: state.I >= 3 && state.R > -2,
    impulsive: state.A >= 5 && state.S >= 6 && !activeIdeas
  };
  flags.absolute = flags.planningAddiction || flags.lethalAntecedents || flags.triadic;
  flags.any = flags.absolute || flags.structural || flags.impulsive;
  return flags;
}

function getAlertMessages(flags) {
  var alerts = [];
  if (flags.planningAddiction) alerts.push("🚨 URGENCE ABSOLUE : Planification suicidaire active associée à une addiction et/ou une impulsivité marquée — Intervention immédiate requise");
  if (flags.lethalAntecedents) alerts.push("🚨 URGENCE ABSOLUE : Moyen létal fortement disponible et antécédent(s) de vulnérabilité présents — Risque de passage à l'acte imminent");
  if (flags.triadic) alerts.push("🚨 ALERTE CRITIQUE TRIADIQUE : Moyen létal disponible + idées suicidaires actives + impulsivité — Risque immédiat maximal");
  if (flags.structural) alerts.push("⚠ ALERTE STRUCTURELLE : Isolement social sévère sans ressources protectrices suffisantes — Situation critique d'abandon");
  if (flags.impulsive) alerts.push("⚡ ALERTE IMPULSIVE : Instabilité et souffrance intenses sans idéation structurée — Risque de passage à l'acte impulsif");
  return alerts;
}

function checkAlerts() {
  var banner = document.getElementById('sp-score-banner');
  if (!banner) return;
  banner.classList.remove('alert-max','alert-struct','alert-impuls','alert-tri');

  var flags = getAlertFlags();
  if (flags.planningAddiction || flags.lethalAntecedents) banner.classList.add('alert-max');
  if (flags.triadic) banner.classList.add('alert-tri');
  if (flags.structural) banner.classList.add('alert-struct');
  if (flags.impulsive) banner.classList.add('alert-impuls');

  var alerts = getAlertMessages(flags);

  var alertDiv = document.getElementById('sp-alerts-live');
  if (!alertDiv) {
    alertDiv = document.createElement('div');
    alertDiv.id = 'sp-alerts-live';
    alertDiv.style.cssText = 'margin-top:10px;display:flex;flex-direction:column;gap:6px';
    banner.appendChild(alertDiv);
  }
  alertDiv.innerHTML = alerts.map(function(a) {
    return '<div style="padding:8px 12px;border-radius:8px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);font-size:12px;color:#f87171;font-family:var(--font2)">' + a + '</div>';
  }).join('');
}

function drawRadar() {
  var canvas = document.getElementById('sp-radar');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var cx = W/2, cy = H/2;
  var R = Math.min(W,H)/2 - 65;
  var N = 7;
  var axes = ['S','P','I','R','A','L','E'];
  var vals = axes.map(function(a){
    if (a === 'R') {
      // state.R va de -11 (protection totale) à +5 (aucune protection)
      // normalisé en "intensité de risque lié aux ressources" : 0=protégé, 1=non protégé
      return Math.max(0, Math.min(1, (state.R + 11) / 16));
    }
    var mx = AXIS_MAX[a] || 5;
    return Math.max(0, Math.min(1, state[a] / mx));
  });
  var colors = axes.map(function(a){return AXIS_COLORS[a];});
  var labels = ['S','P','I','R','A','L','E'];

  ctx.clearRect(0,0,W,H);

  // Grid rings
  for (var ring=1;ring<=5;ring++) {
    var rr=R*ring/5;
    ctx.beginPath();
    for (var i=0;i<N;i++) {
      var angle=(i/N)*2*Math.PI - Math.PI/2;
      var x=cx+rr*Math.cos(angle), y=cy+rr*Math.sin(angle);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle='rgba(79,124,255,0.12)';
    ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle='rgba(79,124,255,0.35)';
    ctx.font='9px monospace';
    ctx.textAlign='center';
    ctx.fillText(ring, cx+4, cy-rr+4);
  }

  // Axes spokes
  for (var i=0;i<N;i++) {
    var angle=(i/N)*2*Math.PI - Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+R*Math.cos(angle), cy+R*Math.sin(angle));
    ctx.strokeStyle='rgba(79,124,255,0.15)';
    ctx.lineWidth=1; ctx.stroke();
  }

  // Polygone — couleur selon le niveau de risque global
  var riskScore = 0;
  try { var el = document.getElementById('sp-risk-index'); riskScore = el && el.textContent !== '—' ? parseInt(el.textContent)||0 : 0; } catch(e){}
  var riskFill, riskStroke;
  var alertFlags = getAlertFlags();
  if (alertFlags.any) {
    // Dès la première alerte, le radar devient rouge critique — indépendamment de l'indice global
    riskFill = 'rgba(220,38,38,0.26)'; riskStroke = 'rgba(220,38,38,0.95)';
  } else if (riskScore <= 20) {
    riskFill = 'rgba(34,197,94,0.18)'; riskStroke = 'rgba(34,197,94,0.75)';
  } else if (riskScore <= 40) {
    riskFill = 'rgba(245,158,11,0.18)'; riskStroke = 'rgba(245,158,11,0.75)';
  } else if (riskScore <= 65) {
    riskFill = 'rgba(249,115,22,0.20)'; riskStroke = 'rgba(249,115,22,0.80)';
  } else if (riskScore <= 85) {
    riskFill = 'rgba(239,68,68,0.22)'; riskStroke = 'rgba(239,68,68,0.85)';
  } else {
    riskFill = 'rgba(153,27,27,0.28)'; riskStroke = 'rgba(220,38,38,0.95)';
  }

  ctx.beginPath();
  for (var i=0;i<N;i++) {
    var angle=(i/N)*2*Math.PI - Math.PI/2;
    var r=R*vals[i];
    var x=cx+r*Math.cos(angle), y=cy+r*Math.sin(angle);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.fillStyle=riskFill; ctx.fill();
  ctx.strokeStyle=riskStroke; ctx.lineWidth=2.5; ctx.stroke();

  // Points + badges + labels
  for (var i=0;i<N;i++) {
    var angle=(i/N)*2*Math.PI - Math.PI/2;
    var r=R*vals[i];
    var x=cx+r*Math.cos(angle), y=cy+r*Math.sin(angle);

    ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2);
    ctx.fillStyle=colors[i]; ctx.fill();
    ctx.strokeStyle='rgba(6,11,20,.8)'; ctx.lineWidth=2; ctx.stroke();

    var lx=cx+(R+38)*Math.cos(angle), ly=cy+(R+38)*Math.sin(angle);
    ctx.beginPath(); ctx.arc(lx,ly,14,0,Math.PI*2);
    ctx.fillStyle=colors[i]; ctx.globalAlpha=.9; ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle='#fff'; ctx.font='bold 11px Outfit,sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    var badgeVal = Math.round(state[axes[i]]);
    ctx.fillText(badgeVal, lx, ly);

    var llx=cx+(R+66)*Math.cos(angle), lly=cy+(R+66)*Math.sin(angle);
    ctx.fillStyle='rgba(200,215,240,0.7)';
    ctx.font='bold 11px Outfit,sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(labels[i], llx, lly);
  }

  // Score central
  var scoreEl = document.getElementById('sp-risk-index');
  var idx = scoreEl ? scoreEl.textContent : '—';
  ctx.font='bold 24px Outfit,sans-serif'; ctx.fillStyle='rgba(224,232,248,.9)';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(idx !== '—' ? idx : '0', cx, cy-8);
  ctx.font='10px Outfit,sans-serif'; ctx.fillStyle='rgba(128,144,184,.6)';
  ctx.fillText('indice', cx, cy+10);
}

function showTab(tabId) {
  document.querySelectorAll('.sp-page').forEach(function(p) {
    p.style.display = 'none';
    p.classList.remove('sp-page-active');
  });
  document.querySelectorAll('.sp-tab-btn').forEach(function(b) {
    b.classList.remove('sp-tab-active');
  });

  var page = document.getElementById('tab-' + tabId);
  if (page) {
    page.style.display = 'block';
    page.classList.add('sp-page-active');
  }

  var tabs = document.querySelectorAll('.sp-tab-btn');
  var map = ['presentation','passation','evaluation','synthese','contact'];
  var idx = map.indexOf(tabId);
  if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('sp-tab-active');

  // Init canvas on presentation tab
  if (tabId === 'presentation') initCanvas();
  if (tabId === 'evaluation') initLogoCanvas();
  // Redraw radar on evaluation tab
  if (tabId === 'evaluation') setTimeout(drawRadar, 50);
}

/* ── NEURAL CANVAS (présentation) ────────────────────────────── */
var canvasInited = false;
function initCanvas() {
  if (canvasInited) return;
  canvasInited = true;

  var canvas = document.getElementById('sp-canvas');
  if (canvas) {
    runNeuronAnimation(canvas, 60, true);
  }
}

var logoCanvasInited = false;
function initLogoCanvas() {
  if (logoCanvasInited) return;
  var logoCanvas = document.getElementById('sp-logo-canvas');
  if (!logoCanvas) return;
  logoCanvasInited = true;
  runNeuronAnimation(logoCanvas, 22, false);
}

/* ── Animation neurones / synapses fluides — réutilisable ───────
   fullPage=true  : canvas redimensionné sur window.innerWidth/Height
   fullPage=false : canvas redimensionné sur son conteneur parent  */
function runNeuronAnimation(canvas, nodeCount, fullPage) {
  var ctx = canvas.getContext('2d');
  var W, H, nodes = [];

  function resize() {
    if (fullPage) {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    } else {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
    }
  }
  resize();
  window.addEventListener('resize', function() { resize(); buildNodes(); });

  function buildNodes() {
    nodes = [];
    for (var i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
        r: Math.random()*2+.5,
        pulse: Math.random()*Math.PI*2,
        pulseSpeed: .02+Math.random()*.025,
        hue: Math.random()<.5 ? 220+Math.random()*20 : 260+Math.random()*25
      });
    }
  }
  buildNodes();

  var linkDist = fullPage ? 140 : 80;

  (function loop() {
    ctx.clearRect(0,0,W,H);
    nodes.forEach(function(n) {
      n.x+=n.vx; n.y+=n.vy; n.pulse+=n.pulseSpeed;
      if(n.x<0)n.x=W; if(n.x>W)n.x=0;
      if(n.y<0)n.y=H; if(n.y>H)n.y=0;
    });
    for (var i=0;i<nodes.length;i++) {
      for (var j=i+1;j<nodes.length;j++) {
        var dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<linkDist) {
          var a=(1-d/linkDist)*.3;
          var g=ctx.createLinearGradient(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
          g.addColorStop(0,'hsla('+nodes[i].hue+',80%,65%,'+a+')');
          g.addColorStop(1,'hsla('+nodes[j].hue+',80%,65%,'+(a*.4)+')');
          ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.strokeStyle=g; ctx.lineWidth=.7; ctx.stroke();
        }
      }
    }
    nodes.forEach(function(n) {
      var glow=.7+.3*Math.sin(n.pulse);
      var gr=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*6);
      gr.addColorStop(0,'hsla('+n.hue+',85%,65%,'+(glow*.2)+')');
      gr.addColorStop(1,'hsla('+n.hue+',85%,65%,0)');
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*6,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle='hsla('+n.hue+',85%,72%,'+glow+')'; ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
}
/* ── AXIS UPDATE ─────────────────────────────────────────────── */

/* ── DESCRIPTIONS DES ITEMS (pour la synthèse) ────────────────── */
var ITEM_LABELS = {
  sS1:"Douleur psychique intense", sS2:"État de désespoir",
  sS3:"Absence de projection positive", sS4:"Impression d'impasse, sentiment que rien ne peut changer",
  sS5:"Honte ou auto-dévalorisation sévère", sS6:"Culpabilité envahissante",
  sS7:"Anesthésie émotionnelle",
  sP2:"Idées passives de mort",
  sP3:"Idées suicidaires actives", sP4:"Scénario identifié (mode opératoire envisagé)",
  sP5:"Préparation active (lettres, organisation matérielle)", sP6:"Date ou contexte défini",
  sI1:"Réseau social pauvre ou non disponible", sI2:"Qualité des liens sociaux et/ou familiaux dégradée ou inexistante",
  sI3:"Refus ou incapacité à demander de l'aide", sI4:"Impossibilité de surveillance rapprochée",
  sR1:"Enfants ou proches parents présents", sR2:"Projets ou objectifs futurs identifiés",
  sR3:"Engagement spirituel, moral ou religieux", sR4:"Alliance thérapeutique établie",
  sR5:"Responsabilités ou engagements concrets",
  sA1:"Tentative(s) de suicide antérieure(s)", sA2:"Trouble psychiatrique diagnostiqué",
  sA3:"Addiction active à une substance psychodysleptique", sA4:"Impulsivité marquée",
  sA5:"Traumatisme récent (< 6 mois)",
  sL1:"Aucun moyen identifié", sL2:"Moyen peu létal ou imprécis évoqué",
  sL3:"Moyen potentiellement létal disponible", sL4:"Moyen fortement létal envisagé",
  sL5:"Moyen immédiatement disponible et préparé",
  sE1:"Pathologie chronique", sE2:"Douleurs chroniques", sE3:"Handicap physique ou sensoriel",
  sE4:"Précarité sociale", sE5:"Difficultés professionnelles ou scolaires",
  sE6:"Dysfonctionnement familial", sE7:"Instance de séparation / rupture"
};

/* Items cotés Modéré ou Présent pour un axe, formatés pour la synthèse */
function listAxisItems(axis) {
  return AXIS_ITEMS[axis]
    .filter(function(id){ return itemLevel(id) > 0; })
    .map(function(id){ return ITEM_LABELS[id] + ' (' + AMP_LABELS[itemLevel(id)] + ')'; });
}

function generateSpiralSynthesis() {
  var score = computeScore();
  var S=state.S, P=state.P, I=state.I, R=state.R, A=state.A, L=state.L, E=state.E;

  function gNote(ax) {
    var el = document.getElementById('notes-'+ax);
    return el ? el.value.trim() : '';
  }

  // Déterminer le profil
  var profile = 'vert';
  var pPct = P / AXIS_MAX.P, lPct = L / AXIS_MAX.L, sPct = S / AXIS_MAX.S;
  var iPct = I / AXIS_MAX.I, aPct = A / AXIS_MAX.A, ePct = E / AXIS_MAX.E;
  var rPct = Math.abs(R) / AXIS_MAX.R;

  if (pPct >= 0.7 && lPct >= 0.7 && rPct <= 0.2) profile = 'noir';
  else if ([pPct,lPct,sPct].some(function(v){return v>=0.6;})) profile = 'rouge';
  else if ([sPct,pPct,iPct,aPct,lPct,ePct].filter(function(v){return v>=0.4;}).length >= 2) profile = 'orange';

  var profileLabels = {
    vert: 'Vert — Vigilance de routine',
    orange: 'Orange — Surveillance renforcée',
    rouge: 'Rouge — Intervention active requise',
    noir: 'Noir — Urgence maximale'
  };

  // Axe dominant
  var riskAxes = {S:1.2*S, P:1.6*P, I:1.1*I, A:1.3*A, L:1.7*L, E:1.1*E};
  var totalRisk = Object.values(riskAxes).reduce(function(a,b){return a+b;},0);
  var dominant = totalRisk > 0 ? Object.entries(riskAxes).reduce(function(a,b){return b[1]>a[1]?b:a;}) : ['—',0];

  // Alertes (texte complet réutilisé depuis checkAlerts)
  var alertDiv = document.getElementById('sp-alerts-live');
  var alerts = [];
  if (alertDiv) {
    alertDiv.querySelectorAll('div').forEach(function(d){ alerts.push(d.textContent); });
  }

  // Orientation
  var orientation = '';
  if (profile === 'noir') {
    orientation = "La configuration observée (profil noir) justifie une évaluation psychiatrique urgente et la mise en place de mesures de sécurisation immédiates. Une hospitalisation, volontaire ou sous contrainte si nécessaire, est à envisager. Le retrait des moyens létaux accessibles doit être organisé sans délai, avec mobilisation de l'entourage proche.";
  } else if (profile === 'rouge') {
    orientation = "Le profil rouge identifié nécessite une intervention clinique active. Une évaluation psychiatrique rapprochée est recommandée, avec mise en place d'un suivi intensifié. La mobilisation du réseau de soutien et la sécurisation de l'environnement restent prioritaires. Le numéro 3114 (prévention du suicide) peut être proposé au patient.";
  } else if (profile === 'orange') {
    orientation = "Le profil orange suggère une vigilance clinique renforcée. Un suivi régulier est à programmer avec réévaluation rapprochée. Il est recommandé de renforcer les ressources protectrices identifiées et de s'assurer de la continuité des soins. La disponibilité d'un contact de crise doit être établie avec le patient.";
  } else {
    orientation = "Le profil vert ne signifie pas l'absence de risque, mais indique un niveau de facteurs de risque actuellement bas. Une vigilance clinique ordinaire est maintenue, avec réévaluation si modification du contexte. Les ressources protectrices identifiées sont à valoriser et à consolider.";
  }

  // Construction des sections
  function axisBlock(ax, label) {
    var items = listAxisItems(ax);
    var val = ax === 'R' ? Math.abs(state.R) : state[ax];
    var line = ax + ' — ' + label + '\u00a0: ' + (Math.round(val*10)/10) + '/' + AXIS_MAX[ax];
    if (items.length) line += '\n   • ' + items.join('\n   • ');
    if (gNote(ax)) line += '\n   → ' + gNote(ax);
    return line;
  }

  var sections = [
    {
      title: 'IDENTIFICATION',
      body: 'Outil\u00a0: Matrice S.P.I.R.A.L.E. — Psydiag\nDate d\'évaluation\u00a0: ' + new Date().toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'}) + '\nHeure\u00a0: ' + new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})
    },
    {
      title: 'RÉSULTATS DE L\'ÉVALUATION',
      body: 'Indice de risque global\u00a0: ' + score.index + '/100\n' +
            'Niveau\u00a0: ' + score.levelText + '\n' +
            'Profil matriciel\u00a0: ' + profileLabels[profile] + '\n' +
            'Axe dominant\u00a0: ' + (dominant[0] !== '—' ? AXIS_NAMES[dominant[0]] + ' (' + dominant[0] + ')' : 'Non déterminé')
    },
    {
      title: 'SCORES PAR AXE',
      body: [
        axisBlock('S','Souffrance psychique'),
        axisBlock('P','Projet suicidaire'),
        axisBlock('I','Isolement social'),
        axisBlock('R','Ressources protectrices'),
        axisBlock('A','Antécédents / Vulnérabilités'),
        axisBlock('L','Létalité potentielle'),
        axisBlock('E','Éléments aggravants')
      ].join('\n')
    },
    {
      title: 'LECTURE CLINIQUE',
      body: buildClinicalReading(profile)
    },
    {
      title: alerts.length ? 'ALERTES CRITIQUES' : null,
      body: alerts.length ? alerts.map(function(a,i){return (i+1)+'. '+a;}).join('\n\n') : null
    },
    {
      title: 'ORIENTATION ET RECOMMANDATIONS',
      body: orientation
    },
    {
      title: 'LIMITES DU MODÈLE',
      body: "Ce document est généré automatiquement à partir des cotations cliniciennes saisies (Absent / Modéré / Présent). La matrice S.P.I.R.A.L.E. n'est pas un outil diagnostique validé scientifiquement. Les résultats sont soumis aux biais subjectifs de l'évaluateur. Toute décision clinique reste sous la responsabilité exclusive du praticien habilité.\n\nRéférence\u00a0: Matrice S.P.I.R.A.L.E. v2 — Psydiag © 2026. Inspirée des approches RUD et Columbia Suicide Severity Rating Scale."
    }
  ].filter(function(s){return s.title && s.body;});

  state.synthText = sections.map(function(s){return s.title+':\n'+s.body;}).join('\n\n────────────────────────────────────────────────────\n\n');

  // Rendu DOM
  var outputEl = document.getElementById('sp-synthesis-output');
  if (outputEl) {
    outputEl.className = '';
    outputEl.innerHTML = sections.map(function(s) {
      return '<div class="sp-synth-section"><div class="sp-synth-section-title">'+s.title+'</div><div class="sp-synth-section-body" contenteditable="true">'+s.body.replace(/\n/g,'<br/>')+'</div></div>';
    }).join('');
  }

  var editWrap = document.getElementById('sp-synth-edit-wrap');
  var editTA = document.getElementById('sp-synth-edit');
  if (editTA) editTA.value = state.synthText;
  if (editWrap) editWrap.style.display = 'block';

  var actionsEl = document.getElementById('sp-synth-actions');
  if (actionsEl) actionsEl.style.display = 'flex';

  showTab('synthese');
}

/* ── LECTURE CLINIQUE NARRATIVE ───────────────────────────────── */
function buildClinicalReading(profile) {
  var S=state.S, P=state.P, I=state.I, R=state.R, A=state.A, L=state.L, E=state.E;
  var parts = [];

  // Souffrance
  var sPct = S / AXIS_MAX.S;
  if (sPct >= 0.6) parts.push("La souffrance psychique est cotée à " + (Math.round(S*10)/10) + "/" + AXIS_MAX.S + ", traduisant une détresse subjective intense avec sentiment d'impasse, de désespoir et/ou de dévalorisation sévère.");
  else if (sPct >= 0.25) parts.push("La souffrance psychique (" + (Math.round(S*10)/10) + "/" + AXIS_MAX.S + ") est présente à un niveau significatif, nécessitant une attention clinique soutenue.");
  else parts.push("La souffrance psychique apparaît actuellement modérée ou contrôlée (" + (Math.round(S*10)/10) + "/" + AXIS_MAX.S + ").");

  // Projet suicidaire
  var p2 = itemLevel('sP2') > 0;
  var planning = ['sP3','sP4','sP5','sP6'].some(function(id){return itemLevel(id)>0;});
  if (planning) {
    var pPct = P / AXIS_MAX.P;
    if (pPct >= 0.6) parts.push("Le projet suicidaire est préoccupant (" + (Math.round(P*10)/10) + "/" + AXIS_MAX.P + ") avec un degré d'organisation élevé suggérant un scénario partiellement ou totalement structuré. Ce niveau justifie une évaluation urgente.");
    else parts.push("Des éléments de planification suicidaire sont présents (" + (Math.round(P*10)/10) + "/" + AXIS_MAX.P + "), méritant un suivi rapproché et une réévaluation fréquente.");
  } else if (p2) {
    parts.push("Des idées passives de mort sont rapportées (" + (Math.round(P*10)/10) + "/" + AXIS_MAX.P + ") sans organisation formalisée à ce stade, mais méritant un suivi attentif de leur évolution.");
  } else {
    parts.push("Aucun projet suicidaire organisé n'est identifié à ce stade (" + (Math.round(P*10)/10) + "/" + AXIS_MAX.P + ").");
  }

  // Isolement
  var iPct = I / AXIS_MAX.I;
  if (iPct >= 0.75) parts.push("L'isolement social est critique (" + (Math.round(I*10)/10) + "/" + AXIS_MAX.I + ") : l'environnement présente une capacité de contenance faible ou nulle, augmentant significativement le risque.");
  else if (iPct >= 0.25) parts.push("Un isolement partiel est noté (" + (Math.round(I*10)/10) + "/" + AXIS_MAX.I + "), avec des liens sociaux fragilisés. Le renforcement du réseau de soutien est recommandé.");
  else parts.push("Le réseau social semble suffisamment présent (" + (Math.round(I*10)/10) + "/" + AXIS_MAX.I + ") pour assurer une fonction contenante.");

  // Ressources protectrices
  var rAbsentCount = AXIS_ITEMS.R.filter(function(id){ return itemLevel(id) === 0; }).length;
  var rProtectiveCount = AXIS_ITEMS.R.filter(function(id){ return itemLevel(id) > 0; }).length;

  if (R > 0) {
    parts.push("Aucune ressource protectrice n'a été identifiée à ce stade : les " + rAbsentCount + " items de l'axe R sont cotés Absent, ce qui constitue en soi un facteur aggravant (contribution de +" + (Math.round(R*10)/10) + " à l'indice de risque, soit +1 point par ressource absente). L'identification et la mobilisation de tout facteur d'ancrage disponible est prioritaire.");
  } else if (rProtectiveCount === 0) {
    parts.push("Aucune ressource protectrice particulière n'est identifiée à ce stade (R = " + (Math.round(R*10)/10) + ").");
  } else if (R <= -6) {
    parts.push("Des ressources protectrices significatives ont été identifiées (" + rProtectiveCount + " sur " + AXIS_ITEMS.R.length + " items, R = " + (Math.round(R*10)/10) + ") — enfants, projets, alliance thérapeutique — constituant des facteurs stabilisants à valoriser et à consolider.");
  } else {
    var rNote = rAbsentCount > 0 ? " (dont " + rAbsentCount + " ressource(s) cotée(s) Absent, contribuant chacune pour +1 à l'indice de risque)" : "";
    parts.push("Quelques ressources protectrices sont identifiées (" + rProtectiveCount + " sur " + AXIS_ITEMS.R.length + " items, R = " + (Math.round(R*10)/10) + ")" + rNote + ", à renforcer dans le plan de soins.");
  }

  // Antécédents / vulnérabilités
  var aPct = A / AXIS_MAX.A;
  if (aPct >= 0.5) parts.push("Le profil d'antécédents et de vulnérabilités est chargé (" + (Math.round(A*10)/10) + "/" + AXIS_MAX.A + ") : tentative(s) antérieure(s), comorbidités psychiatriques et/ou impulsivité marquée augmentent le risque de récidive ou de passage à l'acte.");
  else if (aPct >= 0.2) parts.push("Certains antécédents de vulnérabilité sont présents (" + (Math.round(A*10)/10) + "/" + AXIS_MAX.A + ") et doivent être pris en compte dans l'évaluation globale.");

  // Létalité
  var selectedL = AXIS_ITEMS.L.find(function(id){ return itemLevel(id) >= 2; });
  if (selectedL === 'sL4' || selectedL === 'sL5') {
    parts.push("La létalité potentielle est élevée (" + ITEM_LABELS[selectedL] + ") : un moyen fortement létal est envisagé et potentiellement accessible. Ce facteur à lui seul justifie des mesures de sécurisation immédiates.");
  } else if (selectedL === 'sL2' || selectedL === 'sL3') {
    parts.push("Un moyen suicidaire est évoqué (" + ITEM_LABELS[selectedL] + ") sans caractère immédiatement critique, mais sa disponibilité doit être évaluée et réduite si possible.");
  } else {
    parts.push("Aucun moyen suicidaire particulier n'est identifié à ce stade.");
  }

  // Éléments aggravants
  var eItems = listAxisItems('E');
  if (eItems.length >= 3) {
    parts.push("Sur le plan contextuel, une accumulation significative d'éléments aggravants est relevée (" + eItems.join(', ') + "), renforçant la vulnérabilité globale et nécessitant une prise en compte dans la stratégie thérapeutique.");
  } else if (eItems.length > 0) {
    parts.push("Sur le plan contextuel, on note la présence d'éléments aggravants (" + eItems.join(', ') + "), susceptibles de fragiliser la trajectoire clinique.");
  }

  return parts.join(' ');
}

function syncSpiralEdit() {
  var ta = document.getElementById('sp-synth-edit');
  if (ta) state.synthText = ta.value;
}

function copySpiralSynthesis() {
  var text = getSynthesisText();
  if (!text) return;
  navigator.clipboard.writeText(text).then(function() {
    showToast('Synthèse copiée dans le presse-papier', 'success');
  }).catch(function() {
    showToast('Copie non disponible — sélectionnez et copiez manuellement', 'warn');
  });
}

function getSynthesisText() {
  var sections = document.querySelectorAll('#sp-synthesis-output .sp-synth-section-body');
  if (!sections.length) return state.synthText || '';
  return Array.from(sections).map(function(s){return s.innerText||s.textContent;}).join('\n\n');
}

function printSpiralSynthesis() {
  var sections = document.querySelectorAll('#sp-synthesis-output .sp-synth-section');
  if (!sections.length) { showToast('Aucune synthèse générée.','warn'); return; }

  var html = Array.from(sections).map(function(s) {
    var title = s.querySelector('.sp-synth-section-title');
    var body = s.querySelector('.sp-synth-section-body');
    return '<h2>'+(title?title.textContent:'')+'</h2><p>'+(body?(body.innerText||body.textContent).replace(/\n/g,'<br>'):'')+'</p>';
  }).join('');

  var w = window.open('','_blank');
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>S.P.I.R.A.L.E. — Synthèse</title>' +
    '<style>@page{margin:2cm}body{font-family:"Times New Roman",serif;font-size:11pt;line-height:1.85;color:#111}' +
    'h1{font-size:14pt;text-align:center;color:#1a3a6a;margin-bottom:20px}' +
    'h2{font-size:9pt;font-weight:700;color:#1a3a6a;text-transform:uppercase;letter-spacing:.8px;margin:18px 0 5px;border-left:3px solid #1a3a6a;padding-left:8px}' +
    'p{margin:0 0 10px;text-align:justify}</style></head><body>' +
    '<h1>Matrice S.P.I.R.A.L.E. — Synthèse Clinique — Psydiag</h1>' + html + '</body></html>');
  w.document.close();
  setTimeout(function(){w.print();},400);
}

function exportSpiralPDF() {
  var sections = document.querySelectorAll('#sp-synthesis-output .sp-synth-section');
  if (!sections.length) { showToast('Aucune synthèse générée.','warn'); return; }

  var jsPDFLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDFLib) { printSpiralSynthesis(); return; }

  var doc = new jsPDFLib({orientation:'portrait',unit:'mm',format:'a4'});
  var pW=210, pH=297, mL=20, mR=20, mT=28, mB=22, cW=pW-mL-mR;
  var y=mT, pageNum=1;

  function addHeader() {
    doc.setDrawColor(79,124,255); doc.setLineWidth(.8);
    doc.line(mL,13,pW-mR,13);
    doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(79,124,255);
    doc.text('PSYDIAG — S.P.I.R.A.L.E.',mL,10);
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(80,90,110);
    doc.text(new Date().toLocaleDateString('fr-FR'),pW-mR,10,{align:'right'});
    if(pageNum>1){doc.text('Page '+pageNum,pW-mR,pH-10,{align:'right'});}
  }

  function checkY(need) {
    if(y+need > pH-mB){doc.addPage();pageNum++;y=mT;addHeader();}
  }

  addHeader();

  // Title
  doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.setTextColor(20,40,100);
  doc.text('S.P.I.R.A.L.E.',pW/2,y,{align:'center'}); y+=9;
  doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor(60,80,120);
  doc.text('Synthèse Clinique — Matrice d\'Évaluation du Risque Suicidaire',pW/2,y,{align:'center'}); y+=7;
  doc.setDrawColor(79,124,255); doc.setLineWidth(.4); doc.line(mL,y,pW-mR,y); y+=10;

  // Sections
  sections.forEach(function(sec) {
    var title = sec.querySelector('.sp-synth-section-title');
    var body = sec.querySelector('.sp-synth-section-body');
    if(!title && !body) return;

    checkY(16);
    if(title) {
      doc.setFillColor(230,238,252);
      doc.roundedRect(mL,y-4,cW,8,2,2,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(15,50,120);
      doc.text(title.textContent.trim(),mL+4,y+1); y+=10;
    }
    if(body) {
      var text=(body.innerText||body.textContent||'').trim();
      doc.setFont('helvetica','normal'); doc.setFontSize(9.5); doc.setTextColor(20,20,20);
      var lines=doc.splitTextToSize(text,cW);
      lines.forEach(function(line){checkY(6);doc.text(line,mL,y);y+=5.2;});
      y+=5;
    }
  });

  // Footer
  doc.setDrawColor(79,124,255); doc.setLineWidth(.3); doc.line(mL,pH-mB+3,pW-mR,pH-mB+3);
  doc.setFont('helvetica','italic'); doc.setFontSize(7); doc.setTextColor(80,90,110);
  doc.text('Généré par Psydiag S.P.I.R.A.L.E. — Outil d\'aide clinique. Ne constitue pas un acte médical.',pW/2,pH-mB+8,{align:'center'});
  doc.text('Page '+pageNum,pW-mR,pH-mB+8,{align:'right'});

  doc.save('Psydiag_SPIRAL_Synthese_'+new Date().toISOString().slice(0,10)+'.pdf');
  showToast('PDF téléchargé !','success');
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
function handleSpiralContact(e) {
  e.preventDefault();
  var nom   = (document.getElementById('sc-nom')||{}).value||'';
  var email = (document.getElementById('sc-email')||{}).value||'';
  var sujet = (document.getElementById('sc-sujet')||{}).value||'';
  var msg   = (document.getElementById('sc-msg')||{}).value||'';
  var fb    = document.getElementById('sp-contact-fb');
  if(!nom||!email||!sujet||!msg){
    if(fb){fb.style.display='block';fb.style.background='rgba(239,68,68,.12)';fb.style.border='1px solid rgba(239,68,68,.3)';fb.style.color='#f87171';fb.textContent='Veuillez remplir tous les champs obligatoires.';}
    return;
  }
  var subject=encodeURIComponent('[Psydiag SPIRAL] '+sujet+' — '+nom);
  var body=encodeURIComponent('Nom : '+nom+'\nEmail : '+email+'\nSujet : '+sujet+'\n\nMessage :\n'+msg+'\n\n---\nEnvoyé depuis Psydiag S.P.I.R.A.L.E.');
  window.location.href='mailto:appli.psymulation@gmail.com?subject='+subject+'&body='+body;
  setTimeout(function(){
    if(fb){fb.style.display='block';fb.style.background='rgba(34,197,94,.12)';fb.style.border='1px solid rgba(34,197,94,.3)';fb.style.color='#4ade80';fb.textContent='Votre client de messagerie s\'est ouvert. Envoyez le message pour finaliser.';}
  },800);
}

/* ── TOAST ───────────────────────────────────────────────────── */
function showToast(msg, type) {
  var t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:10px;font-size:13px;font-family:var(--font);font-weight:500;transition:opacity .3s;' +
    (type==='success' ? 'background:rgba(34,197,94,.18);border:1px solid rgba(34,197,94,.4);color:#4ade80;'
    :type==='warn'    ? 'background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);color:#fbbf24;'
    :                   'background:rgba(79,124,255,.15);border:1px solid rgba(79,124,255,.3);color:#7aa4ff;');
  document.body.appendChild(t);
  setTimeout(function(){t.style.opacity='0';setTimeout(function(){t.remove();},300);},2800);
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  showTab('presentation');

  // Ressources protectrices (R) : Présent par défaut (ressources existantes jusqu'à preuve du contraire)
  AXIS_ITEMS.R.forEach(function(id) { state.items[id] = 2; });

  // Rendu initial de tous les items A/M/P
  Object.keys(AXIS_ITEMS).forEach(function(ax) {
    AXIS_ITEMS[ax].forEach(function(id) {
      if (ax === 'L') {
        var wrap = document.querySelector('[data-item="' + id + '"]');
        if (wrap) wrap.classList.toggle('sp-item-active', itemLevel(id) >= 2);
      } else {
        renderItem(id);
      }
    });
  });
  updateGating();

  computeScore();
  drawRadar();
});
