/* ============================================================
   PSYDIAG-TSPT — Script principal v1.1
   ============================================================ */
'use strict';

const CONSENT_KEY   = 'psydiag_consent';
const CRITERIA_IDS  = ['A','B','C','D','E','F'];
const TAB_TITLES = {
  'tab-general':'Informations générales','tab-trauma':'Événement traumatique',
  'tab-criteria':'Critères TSPT (CIM)','tab-dissoc':'Dissociation',
  'tab-complex':'TSPT complexe','tab-child':'TSPT enfant / adolescent',
  'tab-puerp':'TSPT puerpéral','tab-assoc':'Facteurs associés',
  'tab-impact':'Retentissement fonctionnel','tab-synthesis':'Synthèse clinique',
  'tab-conclusion':'Conclusion clinique',
  'tab-contact':'Contact & Support'
};

let chartCtx = null;

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Date d'évaluation par défaut = aujourd'hui
  (function() {
    var gDate = document.getElementById('g-date');
    if (gDate && !gDate.value) {
      var t = new Date();
      gDate.value = t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
    }
  })();
  initConsent();
  initHomePage();
  initNavigation();
  initAllSliders();
  initCriteriaSelects();
  initDissocToggles();
  initFuncChart();
  initFuncSliders();
  initComplexSelects();
  initButtons();
  initDisclaimerClose();
  initTopbarDate();
  initAutoSave();
});

// ── DATE ──────────────────────────────────────────────────────
function initTopbarDate() {
  const el = document.getElementById('topbar-date');
  if (el) el.textContent = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  // Peupler le select années : de 1950 à l'année courante
  const yearSel = document.getElementById('t-date-year');
  if (yearSel) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1950; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSel.appendChild(opt);
    }
  }
}

// ── CONSENT ───────────────────────────────────────────────────
function initConsent() {
  const modal  = document.getElementById('modal-rgpd');
  const cb     = document.getElementById('consent-check');
  const btnOk  = document.getElementById('btn-consent');
  // Éléments optionnels — ne pas planter s'ils sont absents
  if (!modal) return;
  try { if (localStorage.getItem(CONSENT_KEY)) { modal.classList.add('hidden'); return; } } catch(e) {}
  if (cb) cb.addEventListener('change', () => { if (btnOk) btnOk.disabled = !cb.checked; });
  if (btnOk) btnOk.addEventListener('click', () => {
    if (cb && !cb.checked) return;
    try { localStorage.setItem(CONSENT_KEY, '1'); } catch(e) {}
    modal.classList.add('hidden');
    showToast('Bienvenue dans PsyDiag-TSPT');
  });
}

// ── HOME PAGE ─────────────────────────────────────────────────
function initHomePage() {
  // App starts directly on tab-general (no home page)
  var appPage = document.getElementById('page-app');
  if (appPage) appPage.classList.add('active');
  switchTab('tab-general');
}

function showPage(name) {
  // page-home removed — always show page-app
  var appPage = document.getElementById('page-app');
  if (appPage) appPage.classList.add('active');
}

function startNewEval() {
  clearAllFields();
  // Pré-remplir date
  const dateInput = document.getElementById('g-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  // Critères à "absent" par défaut
  CRITERIA_IDS.forEach(c => {
    const sel = document.getElementById('c'+c);
    if (sel) sel.value = 'no';
    updateCriteriaCard(c, 'no');
  });
  showPage('app');
  switchTab('tab-general');
  updateCriteriaScore();
  updateProgress();
  if (chartCtx) drawChart(chartCtx, [0,0,0,0,0,0]);
}


// ── HISTORY ───────────────────────────────────────────────────











// ── NAVIGATION ────────────────────────────────────────────────
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      switchTab(item.dataset.tab);
      if (window.innerWidth <= 700) document.getElementById('sidebar').classList.remove('open');
    });
  });
  const _sidebarToggle = document.getElementById('sidebar-toggle');
  if (_sidebarToggle) _sidebarToggle.addEventListener('click', () => {
    const _sidebar = document.getElementById('sidebar');
    if (_sidebar) _sidebar.classList.toggle('open');
  });
}

function switchTab(tabId) {
  // Hide all tab panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // Show target
  const t = document.getElementById(tabId);
  if (t) t.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const a = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if (a) a.classList.add('active');
  const title = document.getElementById('topbar-title');
  if (title) title.textContent = TAB_TITLES[tabId] || '';
}

// ── SLIDERS — valeur en temps réel ────────────────────────────
function initAllSliders() {
  document.querySelectorAll('.slider').forEach(slider => {
    // Chercher le span inline dans le même .slider-group ou .form-group
    const updateVal = () => {
      // chercher le span slider-val-inline le plus proche
      const group = slider.closest('.slider-group') || slider.closest('.form-group');
      if (group) {
        const span = group.querySelector('.slider-val-inline');
        if (span) span.textContent = slider.value;
      }
      // Ancienne logique pour les spans avec id
      const valEl = document.getElementById(slider.id + '-val');
      if (valEl) valEl.textContent = slider.value;
    };
    slider.addEventListener('input', () => { updateVal();  });
    updateVal(); // init
  });
}

// ── CRITÈRES ──────────────────────────────────────────────────
function initCriteriaSelects() {
  document.querySelectorAll('.criteria-select').forEach(sel => {
    sel.addEventListener('change', () => {
      updateCriteriaCard(sel.dataset.crit, sel.value);
      updateCriteriaScore();
      updateProgress();
      
    });
  });
  // Init état par défaut "absent"
  CRITERIA_IDS.forEach(c => updateCriteriaCard(c, 'no'));
}

function updateCriteriaCard(crit, val) {
  const card = document.getElementById('cc-'+crit);
  const dot  = document.getElementById('dot-'+crit);
  if (!card||!dot) return;
  card.classList.remove('status-yes','status-partial','status-no');
  dot.classList.remove('green','orange','red');
  if (val==='yes')     { card.classList.add('status-yes');    dot.classList.add('green'); }
  if (val==='partial') { card.classList.add('status-partial'); dot.classList.add('orange'); }
  if (val==='no'||!val){ card.classList.add('status-no');     dot.classList.add('red'); }
}

function updateCriteriaScore() {
  let y=0, n=0;
  CRITERIA_IDS.forEach(c => {
    const v = (document.getElementById('c'+c)||{}).value||'no';
    if(v==='yes') y++; else n++;
  });
  setEl('sc-filled', y);
  setEl('sc-absent', n);
}

// ── DISSOCIATION TOGGLES ──────────────────────────────────────
function initDissocToggles() {
  // Anciens types + nouveaux signes caractéristiques intégrés dans dissoc
  const types = [
    'diss-derealisation','diss-depersonnalisation','diss-fragmentation','diss-emousse',
    'sg-voix-mono','sg-absence-emo','sg-ralent-ideo',
    'sg-regard-fixe','sg-automatismes','sg-etrangete','sg-sourires-para',
    'sg-vie-defile'
  ];
  types.forEach(id => {
    const cb = document.getElementById(id);
    const detail = document.getElementById('dd-'+id);
    const card   = document.getElementById('dc-'+id.replace('diss-','').replace('sg-',''));
    if (!cb) return;
    cb.addEventListener('change', () => {
      if (detail) detail.classList.toggle('visible', cb.checked);
      if (card)   card.classList.toggle('active-diss', cb.checked);
      updateProgress();
    });
  });
}

function toggleDissocDetail(id) {
  var cb = document.getElementById(id);
  var detail = document.getElementById('dd-'+id);
  var dcId = id.replace('diss-','').replace('sg-','');
  var card = document.getElementById('dc-'+dcId);
  if (!cb) return;
  if (detail) detail.classList.toggle('visible', cb.checked);
  if (card)   card.classList.toggle('active-diss', cb.checked);
  updateProgress();
}

// ── COMPLEX ───────────────────────────────────────────────────
function initComplexSelects() {
  var domainGroups = {
    'cx-domain-1': ['cx1','cx2','cx3'],
    'cx-domain-2': ['cx4','cx5','cx6','cx7'],
    'cx-domain-3': ['cx8','cx9','cx10']
  };
  var allCxIds = ['cx1','cx2','cx3','cx4','cx5','cx6','cx7','cx8','cx9','cx10'];
  allCxIds.forEach(function(ckId) {
    var cb = document.getElementById(ckId);
    if (!cb) return;
    cb.addEventListener('change', function() {
      // Show/hide sev slider
      var sevRow = document.getElementById(ckId + '-sev-row');
      if (sevRow) sevRow.style.display = cb.checked ? 'flex' : 'none';
      if (!cb.checked) {
        var sev = document.getElementById(ckId + '-sev');
        var sevVal = document.getElementById(ckId + '-sev-val');
        if (sev) sev.value = 0;
        if (sevVal) sevVal.textContent = '0';
      }
      // Update domain card green highlight
      Object.keys(domainGroups).forEach(function(domId) {
        var ids = domainGroups[domId];
        var anyChecked = ids.some(function(id){ var el=document.getElementById(id); return el&&el.checked; });
        var domCard = document.getElementById(domId);
        if (domCard) {
          domCard.classList.toggle('cx-domain-active', anyChecked);
        }
      });
      updateComplexScore();
      updateProgress();
    });
  });
}

function updateComplexScore() {
  var domains = [
    ['cx1','cx2','cx3'],
    ['cx4','cx5','cx6','cx7'],
    ['cx8','cx9','cx10']
  ];
  var count = 0, totalChecked = 0;
  domains.forEach(function(ids) {
    var checked = ids.filter(function(id){ var el=document.getElementById(id); return el&&el.checked; });
    if (checked.length > 0) count++;
    totalChecked += checked.length;
  });
  var pct = Math.round((count/3)*100);
  var bar = document.getElementById('complex-bar');
  if (bar) bar.style.width = pct + '%';
  var txt = document.getElementById('complex-result-text');
  if (txt) {
    if (count === 0) { txt.textContent = 'En attente de saisie…'; txt.style.color = 'rgba(200,220,255,0.7)'; }
    else if (count === 1) { txt.textContent = 'Un domaine affecté (' + totalChecked + ' item(s)) — compatibilité partielle.'; txt.style.color = '#f59e0b'; }
    else if (count === 2) { txt.textContent = 'Deux domaines affectés (' + totalChecked + ' items) — TSPT complexe probable.'; txt.style.color = '#f97316'; }
    else { txt.textContent = 'Trois domaines affectés (' + totalChecked + ' items) — hautement compatible avec un TSPT complexe (CIM-11 6B41).'; txt.style.color = '#ef4444'; }
  }
}

// ── GRAPHIQUE FONCTIONNEL ─────────────────────────────────────
function initFuncChart() {
  const canvas=document.getElementById('func-chart');
  if(!canvas) return;
  chartCtx=canvas.getContext('2d');
  drawChart(chartCtx,[0,0,0,0,0,0,0,0,0]);
}

function initFuncSliders() {
  ['family','social','work','sleep','conc','global'].forEach(id => {
    const s=document.getElementById('fi-'+id);
    const v=document.getElementById('fi-'+id+'-val');
    if(!s) return;
    s.addEventListener('input',()=>{ if(v) v.textContent=s.value; updateFuncChart();  });
  });
}

function updateFuncChart() {
  if(!chartCtx) return;
  const vals=['family','social','work','sleep','conc','global','food','sex','love'].map(id=>parseInt((document.getElementById('fi-'+id)||{}).value||0));
  drawChart(chartCtx,vals);
}

function drawChart(ctx, values) {
  const W = 456, H = 456;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0a0f1c';
  ctx.fillRect(0, 0, W, H);
  const labels = ['Famille', 'Social', 'Travail', 'Sommeil', 'Concentration', 'Global', 'Aliment.', 'Sexuelle', 'Sentim.'];
  const N = labels.length, cx = W/2, cy = H/2, R = Math.min(W,H)*0.30;
  const avg = values.reduce((a,b) => a+b, 0) / N;
  let fR = 34, fG = 197, fB = 94;
  if (avg <= 3.3) { const t = avg/3.3; fR=Math.round(34+t*(249-34)); fG=Math.round(197+t*(115-197)); fB=Math.round(94+t*(22-94)); }
  else if (avg <= 6.6) { const t=(avg-3.3)/3.3; fR=Math.round(249+t*(239-249)); fG=Math.round(115+t*(68-115)); fB=22; }
  else { const t=(avg-6.6)/3.4; fR=Math.round(239-t*100); fG=Math.round(68-t*50); fB=22; }
  const fillC   = `rgba(${fR},${fG},${fB},0.22)`;
  const strokeC = `rgba(${fR},${fG},${fB},0.85)`;
  const dotC    = `rgb(${fR},${fG},${fB})`;
  for (let r = 1; r <= 5; r++) {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const a = (Math.PI*2*i/N)-Math.PI/2, rr = R*r/5;
      i===0 ? ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a)) : ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));
    }
    ctx.closePath();
    ctx.strokeStyle = r===5 ? `rgba(${fR},${fG},${fB},0.4)` : 'rgba(59,130,200,0.15)';
    ctx.lineWidth = r===5 ? 1.5 : 0.8; ctx.stroke();
  }
  for (let i = 0; i < N; i++) {
    const a=(Math.PI*2*i/N)-Math.PI/2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));
    ctx.strokeStyle='rgba(59,130,200,0.2)'; ctx.lineWidth=1; ctx.stroke();
  }
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const a=(Math.PI*2*i/N)-Math.PI/2, rr=R*values[i]/10;
    i===0 ? ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a)) : ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));
  }
  ctx.closePath(); ctx.fillStyle=fillC; ctx.fill(); ctx.strokeStyle=strokeC; ctx.lineWidth=2.5; ctx.stroke();
  for (let i = 0; i < N; i++) {
    const a=(Math.PI*2*i/N)-Math.PI/2, rr=R*values[i]/10;
    const grd=ctx.createRadialGradient(cx+rr*Math.cos(a),cy+rr*Math.sin(a),0,cx+rr*Math.cos(a),cy+rr*Math.sin(a),12);
    grd.addColorStop(0,dotC); grd.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.arc(cx+rr*Math.cos(a),cy+rr*Math.sin(a),12,0,Math.PI*2); ctx.fillStyle=grd; ctx.fill();
    ctx.beginPath(); ctx.arc(cx+rr*Math.cos(a),cy+rr*Math.sin(a),5,0,Math.PI*2);
    ctx.fillStyle=dotC; ctx.fill(); ctx.strokeStyle='#0a0f1c'; ctx.lineWidth=1.5; ctx.stroke();
    if (values[i]>0) {
      ctx.fillStyle=dotC; ctx.font='bold 10px Outfit,sans-serif'; ctx.textAlign='center';
      ctx.fillText(values[i],cx+rr*Math.cos(a),cy+rr*Math.sin(a)-10);
    }
  }
  ctx.font='bold 12px Outfit,sans-serif'; ctx.textAlign='center';
  for (let i = 0; i < N; i++) {
    const a=(Math.PI*2*i/N)-Math.PI/2;
    ctx.fillStyle='#c8d8f0'; ctx.fillText(labels[i],cx+(R+32)*Math.cos(a),cy+(R+32)*Math.sin(a)+4);
  }
  ctx.font='bold 20px Outfit,sans-serif'; ctx.fillStyle=dotC; ctx.textAlign='center';
  ctx.fillText(avg.toFixed(1),cx,cy+7);
  ctx.font='10px Outfit,sans-serif'; ctx.fillStyle='rgba(128,144,184,0.6)'; ctx.fillText('/10',cx,cy+22);
}

// ── SYNTHÈSE COMPLÈTE ─────────────────────────────────────────
function generateSynthesis() {
  const g = id => (document.getElementById(id)||{}).value||'';
  const ck= id => !!((document.getElementById(id)||{}).checked);
  const checkedLabels = (ids, labels) => ids.map((id,i) => ck(id) ? labels[i] : null).filter(Boolean);

  const lines = [];
  const sep   = '─'.repeat(52);
  const add   = (s) => lines.push(s);

  add('SYNTHÈSE CLINIQUE — PsyDiag-TSPT');
  add('═'.repeat(52));
  add('');

  // GÉNÉRAL
  add('IDENTIFICATION');
  add(sep);
  add(`Date d'évaluation  : ${g('g-date') || '(non renseignée)'}`);
  add(`Identifiant patient : ${g('g-id') || '(non renseigné)'}`);
  add(`Âge / Sexe          : ${g('g-age')||'?'} ans — ${g('g-sex')||'non renseigné'}`);
  add(`Situation familiale : ${g('g-family')||'—'}  |  Professionnelle : ${g('g-work')||'—'}`);
  add(`Référent médical    : ${g('g-referent')||'—'}`);
  add(`Motif               : ${g('g-motif')||'—'}`);
  add('');
  if (g('g-resume')) { add('Résumé clinique :'); add(g('g-resume')); add(''); }

  // TRAUMA
  add('ÉVÉNEMENT TRAUMATIQUE');
  add(sep);
  const tMonth = g('t-date-month');
  const tYear  = g('t-date-year');
  const tDateStr = (tMonth && tYear) ? tMonth+'/'+tYear : (tYear || tMonth || '—');
  add('  Nature\u00a0: ' + (g('t-nature')||'\u2014') + ' | Type\u00a0: ' + (g('t-repeat')||'\u2014') + ' | Date\u00a0: ' + tDateStr);
  const expLabels = checkedLabels(
    ['t-direct','t-witness','t-news','t-prof'],
    ['Exposition directe','Témoin direct','Apprentissage via un proche','Exposition professionnelle répétée']
  );
  if (expLabels.length) add('  Mode d\u2019exposition : ' + expLabels.join(', '));
  if (g('t-narrative')) add('  Description : ' + g('t-narrative'));
  add('');

    // CRITÈRES CIM
  

  // SIGNES CARACTÉRISTIQUES
  const signesPresent = ['sg-voix-mono','sg-regard-fixe','sg-ralent-ideo','sg-automatismes','sg-sourires-para','sg-absence-emo'];
  const signesDisc    = ['sg-etrangete','sg-vie-defile'];
  const labelsSignesP = ['Voix monocorde','Regard fixe','Ralentissement idéo-moteur','Automatismes','Sourires paradoxaux','Absence apparente d\'émotion'];
  const labelsSignesD = ['Sentiment d\'étrangeté à soi-même','Sentiment de voir la vie qui défile sans réellement arriver à vivre'];
  const signesPChecked = signesPresent.map((id,i) => ck(id) ? labelsSignesP[i] : null).filter(Boolean);
  const signesDChecked = signesDisc.map((id,i) => ck(id) ? labelsSignesD[i] : null).filter(Boolean);
  const presNotes = g('sg-pres-notes');
  const discNotes = g('sg-disc-notes');
  if (signesPChecked.length || signesDChecked.length || presNotes || discNotes) {
    add('');
    add('SIGNES CARACTÉRISTIQUES');
    add(sep);
    if (signesPChecked.length) {
      add('Présentation clinique :');
      signesPChecked.forEach(s => add('  • ' + s));
    }
    if (presNotes) add('Notes présentation : ' + presNotes);
    if (signesDChecked.length) {
      add('');
      add('Contenu du discours :');
      signesDChecked.forEach(s => add('  • ' + s));
    }
    if (discNotes) add('Notes discours : ' + discNotes);
  }


  // ── CRITÈRES TSPT (CIM-11) ────────────────────────────────
  add('CRITÈRES TSPT (CIM-11)');
  add(sep);
  const critLabels2 = {A:'Exposition traumatisante',B:'Reviviscences persistantes',C:'Évitement',D:'Hypervigilance / Menace persistante',E:'Durée et début',F:'Altération fonctionnelle'};
  const critDesc2 = {
    A:"Le patient a été exposé à un événement d'une nature exceptionnellement menaçante ou horrifiante.",
    B:"Des symptômes de reviviscence persistante de l'événement traumatique sont identifiés.",
    C:"Des conduites d'évitement actif des stimuli associés au trauma sont rapportées.",
    D:"Un état d'hyperactivation neurovégétative avec sentiment de menace persistante est présent.",
    E:"Les symptômes perdurent au-delà du délai requis et suivent l'exposition au trauma.",
    F:"Le tableau clinique entraîne une altération significative du fonctionnement personnel, social ou professionnel."
  };
  const subDefs2 = {
    B:[['cB1','Flashbacks / reviviscences'],['cB2','Cauchemars récurrents'],['cB3','Détresse aux rappels'],['cB4','Réactions physiologiques']],
    C:[['cC1','Évitement interne'],['cC2','Évitement externe']],
    D:[['cD1','Hypervigilance'],['cD2','Réaction de sursaut'],['cD3','Troubles du sommeil'],['cD4','Difficultés de concentration'],['cD5','Irritabilité']]
  };
  var presentCrits = [], absentCrits = [];
  CRITERIA_IDS.forEach(function(c) {
    var v = g('c'+c);
    if (v==='yes') presentCrits.push(c); else absentCrits.push(c);
  });
  if (presentCrits.length > 0) {
    add('  Critères satisfaits :');
    presentCrits.forEach(function(c) {
      var sev = g('c'+c+'-sev') || '0';
      var sevTxt = sev !== '0' ? ' (sévérité : '+sev+'/10)' : '';
      add('');
      add('  \u2022 Critère '+c+' \u2014 '+critLabels2[c]+sevTxt);
      add('    '+critDesc2[c]);
      if (subDefs2[c]) {
        var checked2 = subDefs2[c].filter(function(x){ return ck(x[0]); }).map(function(x){ return x[1]; });
        if (checked2.length) add('    Manifestations : '+checked2.join(' / ')+'.');
      }
      var notes2 = g('c'+c+'-notes');
      if (notes2) add('    Observation clinique : '+notes2);
    });
    add('');
  }
  if (absentCrits.length > 0 && absentCrits.length < 6) {
    add('  Critères non satisfaits : '+absentCrits.map(function(c){ return critLabels2[c]; }).join(', ')+'.');
    add('');
  }
  if (presentCrits.length >= 4) {
    add("  Le tableau clinique, avec "+presentCrits.length+"/6 critères présents, est compatible avec le diagnostic de TSPT selon la CIM-11. Ce diagnostic de probabilité nécessite confirmation par un clinicien habilité.");
  } else if (presentCrits.length > 0) {
    add("  "+presentCrits.length+" critère(s) sur 6 satisfait(s). Le tableau ne configure pas encore un TSPT complet selon la CIM-11.");
  }
  add('');

  // ── TSPT COMPLEXE ──────────────────────────────────────────
  var cxSynDomains = [
    {ids:['cx1','cx2','cx3'],       label:'Dysrégulation émotionnelle'},
    {ids:['cx4','cx5','cx6','cx7'], label:"Altération de l'image de soi"},
    {ids:['cx8','cx9','cx10'],      label:'Difficultés relationnelles persistantes'}
  ];
  var cxSynActive = cxSynDomains.filter(function(d){
    return d.ids.some(function(id){ var el=document.getElementById(id); return el&&el.checked; });
  });
  if (cxSynActive.length > 0) {
    add('TSPT COMPLEXE (CIM-11 6B41)');
    add(sep);
    cxSynActive.forEach(function(d){
      var items = d.ids.filter(function(id){ var el=document.getElementById(id); return el&&el.checked; });
      var sevs = items.map(function(id){ return parseInt((document.getElementById(id+'-sev')||{}).value||0); }).filter(function(s){ return s>0; });
      var sevTxt = sevs.length ? ' (sév. moy. '+Math.round(sevs.reduce(function(a,b){return a+b;},0)/sevs.length*10)/10+'/5)' : '';
      add('  \u2022 '+d.label+sevTxt+' : '+items.length+' item(s).');
    });
    add('');
    if (cxSynActive.length === 1) {
      add("  Un domaine du TSPT complexe est affecté. Ce tableau partiel suggère une vulnérabilité spécifique sans configurer à ce stade un TSPT complexe complet. Surveillance clinique rapprochée recommandée.");
    } else if (cxSynActive.length === 2) {
      add("  Deux des trois domaines du TSPT complexe sont affectés. Ce tableau est compatible avec un TSPT complexe probable selon la CIM-11 (6B41). Une évaluation psychiatrique spécialisée est fortement recommandée.");
    } else {
      add("  Les trois domaines sont atteints, configurant un tableau hautement compatible avec le TSPT complexe (CIM-11 6B41 — probabilité clinique élevée). Prise en charge traumatologique spécialisée recommandée.");
    }
    add('');
  }

  // ── RETENTISSEMENT FONCTIONNEL ─────────────────────────────
  var funcDef = [
    {id:'family', name:'vie familiale',       high:"des perturbations relationnelles majeures au sein de la cellule familiale",                  mod:"un retentissement notable sur la qualité des relations familiales",                low:"un impact modéré sur la vie familiale"},
    {id:'social', name:'vie sociale',          high:"un isolement social significatif avec réduction marquée des interactions",                   mod:"une restriction du réseau social et diminution des activités collectives",          low:"une limitation partielle des activités sociales"},
    {id:'work',   name:'vie professionnelle',  high:"une altération majeure de la capacité de travail",                                           mod:"des difficultés professionnelles nécessitant des aménagements",                     low:"un impact limité sur le rendement professionnel"},
    {id:'sleep',  name:'sommeil',              high:"des troubles sévères du sommeil (insomnie / cauchemars / éveils nocturnes)",                  mod:"une perturbation modérée du cycle veille-sommeil avec répercussions diurnes",      low:"des difficultés intermittentes du sommeil"},
    {id:'conc',   name:'concentration',        high:"une atteinte sévère des fonctions attentionnelles et mnésiques",                             mod:"des difficultés de concentration affectant les performances quotidiennes",         low:"une légère diminution des capacités attentionnelles"},
    {id:'global', name:'fonctionnement global',high:"une dégradation globale du fonctionnement psychosocial",                                     mod:"une altération modérée nécessitant une prise en charge soutenue",                  low:"un retentissement global limité mais à surveiller"},
    {id:'food',   name:'conduites alimentaires',high:"des perturbations sévères des conduites alimentaires (restriction / hyperphagie / conduites purgatives) pouvant traduire une régulation émotionnelle dysphagique", mod:"des modifications notables du comportement alimentaire en lien possible avec le trauma", low:"des perturbations légères et intermittentes des conduites alimentaires"},
    {id:'sex',    name:'conduites sexuelles',  high:"une altération majeure de la vie sexuelle (évitement / hypersexualité / difficultés de plaisir) en lien cliniquement probable avec le vécu traumatique", mod:"des répercussions modérées sur la sexualité nécessitant une attention clinique", low:"quelques difficultés ponctuelles dans la sphère sexuelle"},
    {id:'love',   name:'vie sentimentale',     high:"une détérioration sévère des liens affectifs et sentimentaux avec pattern d'attachement perturbé", mod:"un retentissement modéré sur la vie affective avec difficultés de confiance", low:"quelques difficultés relationnelles affectives ponctuelles"}
  ];
  var funcVals = funcDef.map(function(f){ return parseInt(g('fi-'+f.id)||'0'); });
  var funcAvg = funcVals.reduce(function(a,b){ return a+b; },0) / funcVals.length;
  var highImpact = funcDef.filter(function(_,i){ return funcVals[i]>=7; });
  var modImpact  = funcDef.filter(function(_,i){ return funcVals[i]>=4 && funcVals[i]<7; });
  var lowImpact  = funcDef.filter(function(_,i){ return funcVals[i]>=1 && funcVals[i]<4; });

  if (highImpact.length > 0 || modImpact.length > 0 || lowImpact.length > 0) {
    add('RETENTISSEMENT FONCTIONNEL');
    add(sep);
    var avgLabel = funcAvg >= 7 ? 'sévère' : funcAvg >= 4 ? 'modéré' : 'léger';
    add("  L'évaluation du retentissement fonctionnel objective un impact " + avgLabel + " (score moyen : " + funcAvg.toFixed(1) + "/10) sur les principales sphères de vie.");
    add('');
    if (highImpact.length > 0) {
      add('  Impact sévère (\u2265 7/10) :');
      highImpact.forEach(function(f, idx2) {
        var score = funcVals[funcDef.indexOf(f)];
        add('  \u2022 Sur la '+f.name+' ('+score+'/10) : '+f.high+'.');
      });
      add('');
    }
    if (modImpact.length > 0) {
      add('  Impact modéré (4\u20136/10) :');
      modImpact.forEach(function(f) {
        var score = funcVals[funcDef.indexOf(f)];
        add('  \u2022 Sur la '+f.name+' ('+score+'/10) : '+f.mod+'.');
      });
      add('');
    }
    if (lowImpact.length > 0) {
      add('  Impact léger (1\u20133/10) :');
      lowImpact.forEach(function(f) {
        var score = funcVals[funcDef.indexOf(f)];
        add('  \u2022 Sur la '+f.name+' ('+score+'/10) : '+f.low+'.');
      });
      add('');
    }
    if (funcAvg >= 7) {
      add("  Ce tableau de retentissement sévère justifie une prise en charge pluridisciplinaire intensive et une évaluation de l'autonomie dans les activités de vie quotidienne.");
    } else if (funcAvg >= 4) {
      add("  Ce niveau de retentissement justifie le renforcement d'un suivi structuré et l'adaptation des modalités de soins.");
    } else if (funcAvg >= 1) {
      add("  Un suivi régulier permettra de s'assurer de la stabilité ou de l'amélioration de ce retentissement fonctionnel.");
    }
    if (g('fi-notes')) add('  Observations : '+g('fi-notes'));
    add('');
  }

  // PIED DE PAGE
  add('═'.repeat(52));
  add('NOTE : Synthèse générée automatiquement à partir des données saisies.');
  add('Ce document est modifiable par le clinicien et ne constitue pas un compte-rendu médical validé.');
  add('Référence de classification : CIM-11, OMS 2019.');

  document.getElementById('synthesis-text').value = lines.join('\n');
  showToast('Synthèse complète générée');
}

// ── CONCLUSION ────────────────────────────────────────────────
function generateConclusion() {
  const g = id => (document.getElementById(id)||{}).value||'';
  const ck= id => !!((document.getElementById(id)||{}).checked);

  let yes=0;
  CRITERIA_IDS.forEach(c => {
    const v=g('c'+c);
    if(v==='yes') yes++;
  });
  const pct = Math.round((yes/6)*100);
  const gauge=document.getElementById('gauge-fill');
  const gaugeLabel=document.getElementById('gauge-label');
  if(gauge) gauge.style.width=pct+'%';

  let niveau='', texte='';
  if(pct===0){
    niveau='Données insuffisantes';
    texte='Les données saisies à ce stade sont insuffisantes pour permettre une appréciation clinique structurée.';
  } else if(pct<35){
    niveau='Compatibilité faible';
    texte='Les informations recueillies montrent peu d\'éléments compatibles avec un trouble de stress post-traumatique selon les critères de la CIM-11. D\'autres hypothèses diagnostiques méritent d\'être explorées par un professionnel qualifié.';
  } else if(pct<65){
    niveau='Compatibilité modérée';
    texte='Les informations recueillies lors de cet entretien montrent plusieurs éléments pouvant être compatibles avec un trouble de stress post-traumatique selon les critères de la CIM-11. L\'hypothèse clinique d\'un TSPT apparaît plausible au vu des éléments rapportés, sans permettre de conclusion diagnostique définitive. Une évaluation clinique spécialisée est recommandée.';
  } else if(pct<90){
    niveau='Compatibilité élevée';
    texte='Les données saisies suggèrent une probabilité clinique élevée de trouble de stress post-traumatique, sous réserve d\'une évaluation spécialisée et du jugement clinique du professionnel. Les critères principaux rapportés apparaissent compatibles avec le tableau de TSPT selon la CIM-11.';
  } else {
    niveau='Compatibilité très élevée';
    texte='Les informations recueillies montrent des éléments largement compatibles avec un trouble de stress post-traumatique selon les critères de la CIM-11. La majorité des critères diagnostiques apparaît présente. Cette hypothèse de haute probabilité nécessite confirmation par un professionnel habilité.';
  }
  if(gaugeLabel) gaugeLabel.textContent = niveau + ' — ' + pct + '%';

  const lines = [];
  const add = s => lines.push(s);
  const sep = '─'.repeat(52);

  add('CONCLUSION CLINIQUE — PsyDiag-TSPT');
  add('═'.repeat(52));
  add('');
  add("NIVEAU DE COMPATIBILIT\u00c9 CLINIQUE : " + niveau + " (" + pct + "%)");
  add('');
  add('HYPOTHÈSE CLINIQUE');
  add(sep);
  add(texte);
  add('');
  add('CRITÈRES RENSEIGNÉS');
  add(sep);
  add(`Crit\u00e8res pr\u00e9sents : ${yes}/6  |  Crit\u00e8res absents/non \u00e9valu\u00e9s : ${6-yes}/6`);
  add('');

  // Éléments complémentaires
  const extras = [];
  // Dissociation
  const dissNames=['derealisation','depersonnalisation','fragmentation','emousse'];
  const dissLabels=['Déréalisation','Dépersonnalisation','Fragmentation psychique','Émoussement affectif'];
  const activeDiss = dissNames.filter((n,i) => ck('diss-'+n));
  if (activeDiss.length) {
    extras.push('Symptômes dissociatifs rapportés : ' + activeDiss.map((n,i) => dissLabels[dissNames.indexOf(n)]).join(', ') + '.');
  }

  // Complexe
  var cxDomainsC = [
    {ids:['cx1','cx2','cx3'],       label:'dysrégulation \u00e9motionnelle'},
    {ids:['cx4','cx5','cx6','cx7'], label:'alt\u00e9ration de l\u2019image de soi'},
    {ids:['cx8','cx9','cx10'],      label:'difficult\u00e9s relationnelles'}
  ];
  var cxCountC = cxDomainsC.filter(function(d){ return d.ids.some(function(id){ var el=document.getElementById(id); return el&&el.checked; }); }).length;
  if (cxCountC > 0) {
    var cxMsg = cxCountC === 1
      ? 'Un domaine du TSPT complexe identifi\u00e9. Compatibilit\u00e9 partielle, surveillance recommand\u00e9e.'
      : cxCountC === 2
        ? 'Deux domaines affect\u00e9s. Tableau compatible avec un TSPT complexe probable (CIM-11 6B41). \u00c9valuation sp\u00e9cialis\u00e9e indiqu\u00e9e.'
        : 'Trois domaines affect\u00e9s. Haute probabilit\u00e9 de TSPT complexe (CIM-11 6B41). Prise en charge sp\u00e9cialis\u00e9e urgente recommand\u00e9e.';
    extras.push(cxMsg);
  }

  // Pédiatrique
  const chChecked = ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8','ch9','ch10'].filter(id => ck(id));
  if (chChecked.length) extras.push('Manifestations pédiatriques rapportées (' + chChecked.length + ' éléments). Évaluation développementale spécialisée recommandée.');

  // Puerpéral
  const pChecked = ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12'].filter(id => ck(id));
  if (pChecked.length) extras.push('Éléments traumatiques d\'ordre périnatal rapportés (' + pChecked.length + ' éléments). Un bilan spécialisé en périnatalité est recommandé.');

  if (extras.length) {
    add('ÉLÉMENTS COMPLÉMENTAIRES');
    add(sep);
    extras.forEach(e => add('  • ' + e));
    add('');
  }

  add('MENTION OBLIGATOIRE');
  add(sep);
  add('Cet outil constitue une aide à la structuration clinique et ne remplace pas');
  add("l\'évaluation médicale ou psychologique réalisée par un professionnel qualifié.");
  add('Aucune affirmation diagnostique certaine ne saurait être fondée sur les seuls');
  add('résultats de cet outil.');
  add('');
  add('Référence : Classification Internationale des Maladies, CIM-11 (OMS, 2019).');
  add('═'.repeat(52));

  document.getElementById('concl-text').value = lines.join('\n');
  showToast('Conclusion clinique générée');
}

// ── SAUVEGARDE AUTO ───────────────────────────────────────────
function initAutoSave() {
  // Mapping sous-critères → critère parent
  var subCritMap = {
    'cB1':'B','cB2':'B','cB3':'B','cB4':'B',
    'cC1':'C','cC2':'C',
    'cD1':'D','cD2':'D','cD3':'D','cD4':'D','cD5':'D'
  };
  document.querySelectorAll('input:not([type=range]):not([type=checkbox]), select, textarea').forEach(function(el) {
    el.addEventListener('change', debounce(function() { updateProgress(); }, 600));
  });
  document.querySelectorAll('input[type=checkbox]').forEach(function(el) {
    el.addEventListener('change', function() {
      // Si c'est un sous-critère, mettre à jour le critère parent
      var parentCrit = subCritMap[el.id];
      if (parentCrit) {
        var toggle = document.getElementById('crit-toggle-' + parentCrit);
        var hidden = document.getElementById('c' + parentCrit);
        // Vérifier si au moins un sous-critère du même parent est coché
        var siblings = Object.keys(subCritMap).filter(function(k){ return subCritMap[k]===parentCrit; });
        var anyChecked = siblings.some(function(id){ var e=document.getElementById(id); return e&&e.checked; });
        var newVal = anyChecked ? 'yes' : 'no';
        if (toggle) {
          toggle.dataset.value = newVal;
          toggle.querySelectorAll('.crit-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.val === newVal);
          });
        }
        if (hidden) hidden.value = newVal;
        updateCriteriaCard(parentCrit, newVal);
      }
      updateProgress();
      updateCriteriaScore();
    });
  });
}

function collectAllData() {
  const data = {};
  document.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
    if (el.type === 'checkbox') data[el.id] = el.checked;
    else data[el.id] = el.value;
  });
  return data;
}

function applyData(data) {
  Object.entries(data).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = val;
    else el.value = val;
    // Mise à jour inline slider val
    if (el.type === 'range') {
      const group = el.closest('.slider-group') || el.closest('.form-group');
      if (group) { const sp = group.querySelector('.slider-val-inline'); if (sp) sp.textContent = val; }
      const sp2 = document.getElementById(el.id+'-val'); if (sp2) sp2.textContent = val;
    }
    // Dissociation toggles
    if (el.type === 'checkbox' && el.id.startsWith('diss-') && !el.id.includes('-freq') && !el.id.includes('-sev') && !el.id.includes('frag-') && !el.id.includes('em-')) {
      const typeName = el.id.replace('diss-','');
      const detail = document.getElementById('dd-'+typeName);
      const card   = document.getElementById('dc-'+typeName);
      if (detail) detail.classList.toggle('visible', val);
      if (card)   card.classList.toggle('active-diss', val);
    }
  });
}

function clearAllFields() {
  document.querySelectorAll('input[id], select[id], textarea[id]').forEach(el => {
    if (el.type === 'checkbox') el.checked = false;
    else if (el.type === 'range') { el.value = 0; }
    else el.value = '';
  });
  // Reset dissoc details
  document.querySelectorAll('.dissoc-detail').forEach(d => d.classList.remove('visible'));
  document.querySelectorAll('.dissoc-card').forEach(c => c.classList.remove('active-diss'));
  // Sliders inline
  document.querySelectorAll('.slider-val-inline').forEach(sp => sp.textContent = '0');
  document.querySelectorAll('.func-score span').forEach(sp => sp.textContent = '0');
}

// ── PROGRESSION ───────────────────────────────────────────────
function updateProgress() {
  const checks = [
    () => !!getVal('g-date'), () => !!getVal('g-id'), () => !!getVal('g-age'), () => !!getVal('g-sex'),
    () => !!getVal('t-nature'), () => !!getVal('t-repeat'),
    ...CRITERIA_IDS.map(c => () => !!getVal('c'+c) && getVal('c'+c) !== 'no'),
    () => !!getVal('fi-family'), () => !!getVal('fi-work'), () => !!getVal('fi-global'),
  ];
  const total = checks.length;
  const filled = checks.filter(fn => fn()).length;
  const pct = Math.round((filled/total)*100);
  const bar = document.getElementById('global-progress');
  const txt = document.getElementById('progress-text');
  if (bar) bar.style.width = pct+'%';
  if (txt) txt.textContent = pct+'%';
  // Badges
  updateNavBadge('general',   ['g-date','g-id','g-age','g-sex']);
  updateNavBadge('trauma',    ['t-nature','t-repeat']);
  updateNavBadge('criteria',  CRITERIA_IDS.map(c => 'c'+c));
  updateNavBadge('complex',   ['cx1','cx2','cx3','cx4','cx5','cx6','cx7','cx8','cx9','cx10']);
  updateNavBadge('child',     ['ch1','ch2','ch3']);
  updateNavBadge('puerp',     ['p1','p2','p3']);
  updateNavBadge('assoc',     ['a1','a2','a3']);
  updateNavBadge('impact',    ['fi-family','fi-work','fi-global']);

  // Badge dissociation — couleur orange/vert comme les autres (pas de nombre)
  var _dissocCardIds = [
    'dc-voix-mono','dc-absence-emo','dc-ralent-ideo','dc-regard-fixe',
    'dc-automatismes','dc-etrangete','dc-sourires-para','dc-vie-defile',
    'dc-derealisation','dc-fragmentation'
  ];
  var _checkedDissoc = _dissocCardIds.filter(function(id) {
    var card = document.getElementById(id);
    return card && card.classList.contains('active-diss');
  }).length;
  // Fallback: check toggle inputs directly
  if (_checkedDissoc === 0) {
    var _toggleIds = ['diss-voix-mono','diss-absence-emo','diss-ralent-ideo','diss-regard-fixe',
      'diss-automatismes','diss-etrangete','diss-sourires-para','diss-vie-defile',
      'diss-derealisation','diss-fragmentation'];
    _checkedDissoc = _toggleIds.filter(function(id){
      var el=document.getElementById(id); return el&&el.checked;
    }).length;
  }
  var _dissBadge = document.getElementById('badge-dissoc');
  if (_dissBadge) {
    _dissBadge.textContent = '';
    _dissBadge.className = 'nav-badge';
    if (_checkedDissoc > 0 && _checkedDissoc >= 5) _dissBadge.classList.add('green');
    else if (_checkedDissoc > 0) _dissBadge.classList.add('orange');
    _dissBadge.style.display = _checkedDissoc > 0 ? '' : 'none';
  }
}

function updateNavBadge(name, fieldIds) {
  var badge = document.getElementById('badge-'+name);
  if (!badge) return;
  // Count: checkboxes checked OR select/input non-empty and not 'no'
  var filled = fieldIds.filter(function(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (el.type === 'checkbox') return el.checked;
    var v = el.value || '';
    return v !== '' && v !== 'no';
  }).length;
  badge.className = 'nav-badge';
  badge.textContent = '';
  if (filled === 0) {
    badge.style.display = 'none';
  } else if (filled === 1) {
    badge.classList.add('orange');
    badge.style.display = '';
  } else {
    badge.classList.add('green');
    badge.style.display = '';
  }
}

// ── BOUTONS ───────────────────────────────────────────────────
function initButtons() {
  const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  on('btn-generate-synth', () => { generateSynthesis(); switchTab('tab-synthesis'); });
  on('btn-generate-concl', generateConclusion);
  on('btn-save', () => {  showToast('Évaluation sauvegardée'); });
  on('btn-print', () => { generateSynthesis(); generateConclusion(); setTimeout(() => window.print(), 300); });
  on('btn-clear', () => {
    if (confirm('Effacer toutes les données de cette évaluation ?')) {
      clearAllFields();
      CRITERIA_IDS.forEach(c => updateCriteriaCard(c, 'no'));
      updateCriteriaScore(); updateComplexScore(); updateFuncChart(); updateProgress();
      showToast('Données effacées');
    }
  });
}

// ── DISCLAIMER ───────────────────────────────────────────────
function initDisclaimerClose() {
  const btn = document.getElementById('disclaimer-close');
  if (btn) btn.addEventListener('click', () => document.getElementById('disclaimer-banner').classList.add('hidden'));
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 2800);
}

// ── UTILS ─────────────────────────────────────────────────────
function setEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function debounce(fn, d) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), d); }; }

/* ================================================================
   EXPORT PDF — Psydiag-TSPT (jsPDF)
   ================================================================ */
function exportTSPTPDF() {
  var textEl = document.getElementById('synthesis-text');
  if (!textEl || !textEl.value.trim()) {
    showToast("Aucune synth\u00e8se g\u00e9n\u00e9r\u00e9e.", "error");
    return;
  }

  if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
    // Fallback: print window
    var w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Synth\u00e8se TSPT</title>' +
      '<style>body{font-family:"Courier New",monospace;font-size:10pt;margin:2cm;line-height:1.6;color:#111}' +
      'pre{white-space:pre-wrap}h1{font-size:13pt;color:#1a3a6a;margin-bottom:12px}</style></head><body>' +
      '<h1>Psydiag-TSPT \u2014 Synth\u00e8se Clinique</h1><pre>' +
      textEl.value.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></body></html>');
    w.document.close();
    setTimeout(function(){w.print();}, 400);
    return;
  }

  var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  var pageW = 210, pageH = 297;
  var marginL = 20, marginR = 20, marginT = 28, marginB = 22;
  var contentW = pageW - marginL - marginR;
  var y = marginT;
  var pageNum = 1;

  function addPageHeader() {
    doc.setDrawColor(15, 50, 120);
    doc.setLineWidth(0.8);
    doc.line(marginL, 14, pageW - marginR, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 50, 120);
    doc.text("PSYDIAG-TSPT", marginL, 11);
    var now = new Date();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(80, 90, 110);
    doc.text(now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), pageW - marginR, 11, {align:'right'});
    if (pageNum > 1) {
      doc.text("Page " + pageNum, pageW - marginR, pageH - 10, {align:'right'});
    }
  }

  function checkY(needed) {
    if (y + needed > pageH - marginB) {
      doc.addPage();
      pageNum++;
      y = marginT;
      addPageHeader();
    }
  }

  addPageHeader();

  // Title block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 50, 120);
  doc.text("Psydiag-TSPT", marginL, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 60, 80);
  doc.text("\u00c9valuation Clinique du Trouble de Stress Post-Traumatique", marginL, y);
  y += 7;
  doc.setDrawColor(15, 50, 120);
  doc.setLineWidth(0.4);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  // Parse synthesis text into sections
  var rawText = textEl.value;
  var lines = rawText.split('\n');

  lines.forEach(function(line) {
    checkY(7);

    var trimmed = line.trim();

    // ── Titre principal (ligne MAJUSCULES sans caractères spéciaux) ──
    // Détection stricte: 4+ chars, uniquement A-Z + accents + espaces + ( ) / - :
    if (/^[A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ()\/\-\s:,.]{4,}$/.test(trimmed) &&
        trimmed.length > 3 && trimmed.length < 80 &&
        !trimmed.startsWith('─') && !trimmed.startsWith('═') &&
        !trimmed.startsWith('▸') && !trimmed.startsWith('•')) {
      y += 2;
      doc.setFillColor(225, 235, 252);
      doc.roundedRect(marginL, y - 4, contentW, 8.5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 50, 120);
      doc.text(trimmed, marginL + 4, y + 1);
      y += 10;

    // ── Sous-titre avec ▸ ──
    } else if (trimmed.startsWith('\u25b8') || trimmed.startsWith('\u2023')) {
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(59, 100, 180);
      var subText = trimmed.replace(/^[\u25b8\u2023]\s*/, '').replace(/ :$/, '');
      doc.text('\u203a ' + subText, marginL + 2, y);
      y += 7;

    // ── Séparateur ─── ou ═══ ──
    } else if (/^[\u2500\u2550\-=]{3,}/.test(trimmed)) {
      doc.setDrawColor(180, 195, 220);
      doc.setLineWidth(0.25);
      doc.line(marginL + 2, y - 2, pageW - marginR - 2, y - 2);
      y += 2;

    // ── Ligne vide ──
    } else if (trimmed === '') {
      y += 2.5;

    // ── Bullet • ──
    } else if (trimmed.startsWith('\u2022') || trimmed.startsWith('•')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      var bulletText = trimmed.replace(/^[•\u2022]\s*/, '');
      var bulletWrapped = doc.splitTextToSize(bulletText, contentW - 8);
      bulletWrapped.forEach(function(wl, wi) {
        checkY(6);
        if (wi === 0) doc.text('•', marginL + 2, y);
        doc.text(wl, marginL + 8, y);
        y += 5.2;
      });

    // ── Texte normal ──
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      // Indent si commence par espaces
      var indent = (line.match(/^(\s+)/) || ['',''])[1].length;
      var xPos = marginL + Math.min(indent * 1.5, 16);
      var wrapped = doc.splitTextToSize(trimmed, contentW - (xPos - marginL));
      wrapped.forEach(function(wl) {
        checkY(6);
        doc.text(wl, xPos, y);
        y += 5.2;
      });
    }
  });

  // Footer
  doc.setDrawColor(15, 50, 120);
  doc.setLineWidth(0.3);
  doc.line(marginL, pageH - marginB + 3, pageW - marginR, pageH - marginB + 3);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(80, 90, 110);
  doc.text("G\u00e9n\u00e9r\u00e9 par Psydiag-TSPT \u2014 Outil d'aide clinique. Ne constitue pas un acte m\u00e9dical. R\u00e9f. CIM-11, OMS 2019.", pageW/2, pageH - marginB + 8, {align:'center'});
  doc.text("Page " + pageNum, pageW - marginR, pageH - marginB + 8, {align:'right'});

  var patId = (document.getElementById('g-id') || {}).value || 'patient';
  var dateStamp = new Date().toISOString().slice(0,10);
  doc.save('PsydiagTSPT_Synthese_' + patId + '_' + dateStamp + '.pdf');
  showToast("PDF t\u00e9l\u00e9charg\u00e9 !", "success");
}


/* ================================================================
   CONTACT FORM — envoi vers appli.psymulation@gmail.com
   ================================================================ */
function handleContactSubmit(e) {
  e.preventDefault();

  const nom      = (document.getElementById('ct-nom')        || {}).value || '';
  const email    = (document.getElementById('ct-email')      || {}).value || '';
  const prof     = (document.getElementById('ct-profession') || {}).value || '';
  const sujet    = (document.getElementById('ct-sujet')      || {}).value || '';
  const message  = (document.getElementById('ct-message')    || {}).value || '';
  const feedback = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contactForm') ?
    document.getElementById('contactForm').querySelector('button[type="submit"]') : null;

  if (!nom || !email || !sujet || !message) {
    showFeedback('Veuillez remplir tous les champs obligatoires (*).', 'error');
    return;
  }

  // Build mailto link with pre-filled fields
  const subject = encodeURIComponent('[Psydiag-TSPT] ' + sujet + ' — ' + nom);
  const body = encodeURIComponent(
    'Nom : ' + nom + '\n' +
    'Email : ' + email + '\n' +
    'Profession : ' + (prof || 'Non renseignée') + '\n' +
    'Sujet : ' + sujet + '\n\n' +
    'Message :\n' + message + '\n\n' +
    '---\nEnvoyé depuis Psydiag-TSPT'
  );

  const mailtoLink = 'mailto:appli.psymulation@gmail.com?subject=' + subject + '&body=' + body;

  // Disable button during action
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Ouverture du client mail…'; }

  // Open mailto (opens user's mail client)
  window.location.href = mailtoLink;

  // Feedback after slight delay
  setTimeout(function() {
    showFeedback("Votre client de messagerie s'est ouvert. Envoyez le message pour finaliser votre demande.", "success");
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg> Envoyer le message'; }
  }, 1200);
}

function showFeedback(msg, type) {
  const el = document.getElementById('contact-feedback');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'success'
    ? 'rgba(34,197,94,0.12)'   : 'rgba(239,68,68,0.12)';
  el.style.border = type === 'success'
    ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)';
  el.style.color = type === 'success' ? '#22c55e' : '#ef4444';
}

/* ================================================================
   TOGGLE CRITÈRE — Présent / Absent
   ================================================================ */
function toggleCriteria(wrapper) {
  var current = wrapper.dataset.value;
  var newVal = (current === 'no') ? 'yes' : 'no';
  wrapper.dataset.value = newVal;

  // Update button states
  wrapper.querySelectorAll('.crit-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.val === newVal);
  });

  // Update hidden input (read by updateCriteriaScore)
  var hidden = wrapper.querySelector('input.criteria-select');
  if (hidden) hidden.value = newVal;

  // Update criteria card visual status
  var crit = wrapper.dataset.crit;
  updateCriteriaCard(crit, newVal);
  updateCriteriaScore();
  updateProgress();
}
