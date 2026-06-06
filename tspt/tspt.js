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
  'tab-conclusion':'Conclusion clinique'
};

let chartCtx = null;

// ── BOOT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
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
  if (localStorage.getItem(CONSENT_KEY)) { modal.classList.add('hidden'); return; }
  cb.addEventListener('change', () => { btnOk.disabled = !cb.checked; });
  btnOk.addEventListener('click', () => {
    if (!cb.checked) return;
    localStorage.setItem(CONSENT_KEY, '1');
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
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

function switchTab(tabId) {
  // Hide all panels and sections
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-section[id^="tab-"]').forEach(s => s.style.display = 'none');
  // Show target
  const t = document.getElementById(tabId);
  if (t) {
    if (t.classList.contains('tab-panel')) t.classList.add('active');
    else t.style.display = 'block';
  }
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
  let y=0,p=0,n=0;
  CRITERIA_IDS.forEach(c => {
    const v = (document.getElementById('c'+c)||{}).value||'no';
    if(v==='yes') y++; else if(v==='partial') p++; else n++;
  });
  setEl('sc-filled',y); setEl('sc-incomplete',p); setEl('sc-absent',n);
}

// ── DISSOCIATION TOGGLES ──────────────────────────────────────
function initDissocToggles() {
  const types = ['derealisation','depersonnalisation','fragmentation','emousse'];
  types.forEach(type => {
    const cb = document.getElementById('diss-'+type);
    const detail = document.getElementById('dd-'+type);
    const card   = document.getElementById('dc-'+type);
    if (!cb||!detail||!card) return;
    cb.addEventListener('change', () => {
      detail.classList.toggle('visible', cb.checked);
      card.classList.toggle('active-diss', cb.checked);
      
      updateProgress();
    });
  });
}

// ── COMPLEX ───────────────────────────────────────────────────
function initComplexSelects() {
  ['cx-d1','cx-d2','cx-d3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => { updateComplexScore();  });
  });
}

function updateComplexScore() {
  let count=0;
  ['cx-d1','cx-d2','cx-d3'].forEach(id => {
    const v=(document.getElementById(id)||{}).value||'';
    if(v==='yes') count+=2; if(v==='partial') count+=1;
  });
  const pct=Math.round((count/6)*100);
  const bar=document.getElementById('complex-bar');
  if(bar) bar.style.width=pct+'%';
  const txt=document.getElementById('complex-result-text');
  if(txt){
    if(pct===0) txt.textContent='Données insuffisantes.';
    else if(pct<40) txt.textContent='Éléments peu compatibles avec un tableau de TSPT complexe.';
    else if(pct<70) txt.textContent='Éléments partiellement compatibles avec un tableau de TSPT complexe.';
    else txt.textContent='Éléments largement compatibles avec un tableau pouvant évoquer un TSPT complexe.';
  }
}

// ── GRAPHIQUE FONCTIONNEL ─────────────────────────────────────
function initFuncChart() {
  const canvas=document.getElementById('func-chart');
  if(!canvas) return;
  chartCtx=canvas.getContext('2d');
  drawChart(chartCtx,[0,0,0,0,0,0]);
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
  const vals=['family','social','work','sleep','conc','global'].map(id=>parseInt((document.getElementById('fi-'+id)||{}).value||0));
  drawChart(chartCtx,vals);
}

function drawChart(ctx,values){
  const W=320,H=280;
  ctx.clearRect(0,0,W,H);
  const labels=['Famille','Social','Travail','Sommeil','Concentration','Global'];
  const N=labels.length,cx=W/2,cy=H/2,R=Math.min(W,H)*0.36;
  for(let r=1;r<=5;r++){
    ctx.beginPath();
    for(let i=0;i<N;i++){const a=(Math.PI*2*i/N)-Math.PI/2;const rr=R*r/5;i===0?ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a)):ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}
    ctx.closePath();ctx.strokeStyle='rgba(160,176,191,0.3)';ctx.lineWidth=1;ctx.stroke();
  }
  for(let i=0;i<N;i++){const a=(Math.PI*2*i/N)-Math.PI/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));ctx.strokeStyle='rgba(160,176,191,0.35)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();
  for(let i=0;i<N;i++){const a=(Math.PI*2*i/N)-Math.PI/2;const rr=R*values[i]/10;i===0?ctx.moveTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a)):ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}
  ctx.closePath();ctx.fillStyle='rgba(59,158,217,0.18)';ctx.fill();ctx.strokeStyle='rgba(45,107,158,0.85)';ctx.lineWidth=2;ctx.stroke();
  for(let i=0;i<N;i++){const a=(Math.PI*2*i/N)-Math.PI/2;const rr=R*values[i]/10;ctx.beginPath();ctx.arc(cx+rr*Math.cos(a),cy+rr*Math.sin(a),4,0,Math.PI*2);ctx.fillStyle='#2d6b9e';ctx.fill();}
  ctx.font='11px DM Sans,sans-serif';ctx.fillStyle='#607080';ctx.textAlign='center';
  for(let i=0;i<N;i++){const a=(Math.PI*2*i/N)-Math.PI/2;ctx.fillText(labels[i],cx+(R+22)*Math.cos(a),cy+(R+22)*Math.sin(a)+4);}
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
  add(`Nature : ${g('t-nature')||'—'}  |  Type : ${g('t-repeat')||'—'}  |  Date : ${tDateStr}`);
  const expLabels = checkedLabels(
    ['t-direct','t-witness','t-news','t-prof'],
    ['Exposition directe','Témoin direct','Apprentissage via un proche','Exposition professionnelle répétée']
  );
  if (expLabels.length) add('Mode d\'exposition : ' + expLabels.join(', '));
  if (g('t-narrative')) { add('Récit : ' + g('t-narrative')); }
  add('');

  // CRITÈRES CIM
  add('CRITÈRES TSPT (CIM-11)');
  add(sep);
  const critLabels = {A:'Exposition traumatisante',B:'Reviviscences persistantes',C:'Évitement',D:'Hypervigilance / Menace persistante',E:'Durée et début',F:'Altération fonctionnelle'};
  let hasAnyCrit = false;
  CRITERIA_IDS.forEach(c => {
    const v = g('c'+c);
    const sev = g('c'+c+'-sev') || '0';
    const status = v==='yes'?'✓ Présent':v==='partial'?'△ Partiel / incertain':'✗ Absent';
    add(`  Critère ${c} — ${critLabels[c]} : ${status}${sev!=='0'?' (sévérité : '+sev+'/10)':''}`);
    if (v==='yes'||v==='partial') hasAnyCrit=true;
    // Sous-items cochés
    const subs = {
      B: [['cB1','Flashbacks'],['cB2','Cauchemars'],['cB3','Détresse aux rappels'],['cB4','Réactions physiologiques']],
      C: [['cC1','Évitement interne'],['cC2','Évitement externe']],
      D: [['cD1','Hypervigilance'],['cD2','Sursaut exacerbé'],['cD3','Troubles du sommeil'],['cD4','Difficultés concentration'],['cD5','Irritabilité/colère']]
    };
    if (subs[c]) {
      const checked = subs[c].filter(([id]) => ck(id)).map(([,l]) => l);
      if (checked.length) add('    Éléments rapportés : ' + checked.join(', '));
    }
    const notes = g('c'+c+'-notes');
    if (notes) add('    Notes : ' + notes);
  });
  if (g('cB-freq')) add(`  Fréquence reviviscences : ${g('cB-freq')}`);
  if (g('cE-dur'))  add(`  Durée des symptômes     : ${g('cE-dur')}`);
  if (g('cF-level'))add(`  Niveau d'altération     : ${g('cF-level')}`);
  add('');

  // DISSOCIATION
  const dissocTypes = [
    {id:'diss-derealisation',   label:'Déréalisation',      freqId:'diss-derealisation-freq',   sevId:'diss-derealisation-sev'},
    {id:'diss-depersonnalisation',label:'Dépersonnalisation',freqId:'diss-depersonnalisation-freq',sevId:'diss-depersonnalisation-sev'},
    {id:'diss-fragmentation',   label:'Fragmentation psychique',freqId:null,sevId:'diss-fragmentation-sev'},
    {id:'diss-emousse',         label:'Émoussement affectif',freqId:null,sevId:'diss-emousse-sev'},
  ];
  const activeDiss = dissocTypes.filter(d => ck(d.id));
  if (activeDiss.length) {
    add('DISSOCIATION');
    add(sep);
    activeDiss.forEach(d => {
      let line = `  • ${d.label}`;
      if (d.freqId && g(d.freqId)) line += ` — fréquence : ${g(d.freqId)}`;
      const sev = d.sevId ? g(d.sevId) : '0';
      if (sev && sev !== '0') line += ` — sévérité : ${sev}/10`;
      add(line);
    });
    // Fragmentation sous-items
    const fragSubs = checkedLabels(
      ['diss-frag-amnesie','diss-frag-etats','diss-frag-memoire'],
      ['Amnésies dissociatives','États du moi distincts','Incohérence mémoire autobiographique']
    );
    if (fragSubs.length) add('    Fragmentation : ' + fragSubs.join(', '));
    // Émoussement sous-items
    const emSubs = checkedLabels(
      ['diss-em-joie','diss-em-lien','diss-em-flat'],
      ['Anhédonie','Détachement affectif','Affect plat']
    );
    if (emSubs.length) add('    Émoussement : ' + emSubs.join(', '));
    if (g('diss-notes')) add('  Observations : ' + g('diss-notes'));
    add('');
  }

  // TSPT COMPLEXE
  const cxDomains = [
    {id:'cx-d1',label:'Dysrégulation émotionnelle',sevId:'cx-d1-sev',
     subs:[['cx1','Difficultés de régulation'],['cx2','Réactivité intense'],['cx3','Épisodes dissociatifs émotionnels']]},
    {id:'cx-d2',label:'Altération de l\'image de soi',sevId:'cx-d2-sev',
     subs:[['cx4','Dévalorisation/honte'],['cx5','Culpabilité persistante'],['cx6','Sentiment irréparable']]},
    {id:'cx-d3',label:'Difficultés relationnelles',sevId:'cx-d3-sev',
     subs:[['cx7','Difficultés relationnelles proches'],['cx8','Méfiance envers autrui'],['cx9','Retrait social'],['cx10','Altération fonctionnement social']]},
  ];
  const activeCx = cxDomains.filter(d => { const v=g(d.id); return v==='yes'||v==='partial'; });
  if (activeCx.length) {
    add('ÉLÉMENTS DE TSPT COMPLEXE');
    add(sep);
    activeCx.forEach(d => {
      const v = g(d.id);
      const sev = g(d.sevId)||'0';
      add(`  • ${d.label} : ${v==='yes'?'Présent':'Partiel'}${sev!=='0'?' (sévérité : '+sev+'/10)':''}`);
      const activeSubs = d.subs.filter(([id]) => ck(id)).map(([,l]) => l);
      if (activeSubs.length) add('    Éléments cochés : ' + activeSubs.join(', '));
    });
    if (g('cx-notes')) add('  Observations : ' + g('cx-notes'));
    add('  → Les éléments recueillis apparaissent compatibles avec un tableau pouvant évoquer un TSPT complexe.');
    add('    Une évaluation clinique spécialisée reste nécessaire.');
    add('');
  }

  // TSPT ENFANT / ADO
  const chItems = checkedLabels(
    ['ch1','ch2','ch3','ch4','ch5','ch6','ch7','ch8','ch9','ch10'],
    ['Régressions comportementales','Jeux traumatiques répétitifs','Cauchemars/terreurs nocturnes',
     'Symptômes anxieux','Troubles scolaires','Hypervigilance/agitation',
     'Irritabilité/colère','Symptômes dissociatifs','Retrait social/apathie','Somatisations']
  );
  if (chItems.length || g('ch-age')) {
    add('TSPT PÉDIATRIQUE');
    add(sep);
    if (g('ch-age'))       add(`  Âge du patient             : ${g('ch-age')} ans`);
    if (g('ch-age-trauma')) add(`  Âge de survenue du trauma  : ${g('ch-age-trauma')} ans`);
    if (chItems.length)    add(`  Manifestations rapportées   : ${chItems.join(', ')}`);
    if (g('ch-context'))   add(`  Contexte familial           : ${g('ch-context')}`);
    if (g('ch-synthesis')) add(`  Observations cliniques      : ${g('ch-synthesis')}`);
    add('');
  }

  // TSPT PUERPÉRAL
  const pContext = checkedLabels(
    ['p1','p2','p3','p4','p5'],
    ['Traumatisme grossesse','Traumatisme accouchement','Trauma suites de couches','Hospitalisation néonatale','Deuil périnatal']
  );
  const pSymptoms = checkedLabels(
    ['p6','p7','p8','p9','p10','p11','p12'],
    ['Menace vitale','Perte de contrôle','Flashbacks accouchement','Évitement','Hyperactivation émotionnelle','Impact lien mère-enfant','Difficultés allaitement']
  );
  if (pContext.length || pSymptoms.length) {
    add('TSPT PUERPÉRAL');
    add(sep);
    if (pContext.length)  add(`  Contexte        : ${pContext.join(', ')}`);
    if (pSymptoms.length) add(`  Symptômes       : ${pSymptoms.join(', ')}`);
    if (g('p-bond'))      add(`  Lien mère-enfant : ${g('p-bond')}`);
    if (g('p-synthesis')) add(`  Observations     : ${g('p-synthesis')}`);
    add('');
  }

  // ANTÉCÉDENTS & ADDICTIONS
  const antecedents = checkedLabels(
    ['a1','a2','a3','a4','a5','a6'],
    ['Dépression','Trouble anxieux','Trouble bipolaire','Épisode psychotique','TSPT antérieur','Trouble de la personnalité']
  );
  const substances = [];
  [['tab','Tabac'],['alc','Alcool'],['can','Cannabis'],['opi','Opiacés'],['benzo','Benzodiazépines'],['stim','Stimulants']].forEach(([k,l]) => {
    const c=g('sub-'+k+'-curr');
    if(c==='Oui') substances.push(l+' ('+g('sub-'+k+'-freq')+(g('sub-'+k+'-sev')==='Oui'?', sevrage en cours':'')+')');
  });
  if (antecedents.length || substances.length) {
    add('FACTEURS ASSOCIÉS');
    add(sep);
    if (antecedents.length) add(`  Antécédents psychiatriques : ${antecedents.join(', ')}`);
    if (substances.length)  add(`  Addictions actives          : ${substances.join(' | ')}`);
    if (g('a-notes'))       add(`  Observations                : ${g('a-notes')}`);
    add('');
  }

  // RETENTISSEMENT
  const funcIds = ['family','social','work','sleep','conc','global'];
  const funcNames = ['Vie familiale','Vie sociale','Vie professionnelle','Sommeil','Concentration','Fonctionnement global'];
  add('RETENTISSEMENT FONCTIONNEL');
  add(sep);
  funcIds.forEach((id,i) => add(`  ${funcNames[i].padEnd(26)} : ${g('fi-'+id)||0}/10`));
  if (g('fi-notes')) add(`  Observations : ${g('fi-notes')}`);
  add('');

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

  let yes=0, partial=0;
  CRITERIA_IDS.forEach(c => {
    const v=g('c'+c);
    if(v==='yes') yes++; if(v==='partial') partial++;
  });
  const pct = Math.round(((yes + partial*0.5)/6)*100);
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
  add('NIVEAU DE COMPATIBILITÉ CLINIQUE : ' + niveau + ' (' + pct + '%)');
  add('');
  add('HYPOTHÈSE CLINIQUE');
  add(sep);
  add(texte);
  add('');
  add('CRITÈRES RENSEIGNÉS');
  add(sep);
  add(`Présents : ${yes}/6  |  Partiels : ${partial}/6  |  Absents/non évalués : ${6-yes-partial}/6`);
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
  const cxYes = ['cx-d1','cx-d2','cx-d3'].filter(id => { const v=g(id); return v==='yes'||v==='partial'; });
  if (cxYes.length) {
    extras.push('Éléments compatibles avec un tableau de TSPT complexe identifiés (' + cxYes.length + '/3 domaines). Une évaluation spécialisée est recommandée.');
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
  add('l\'évaluation médicale ou psychologique réalisée par un professionnel qualifié.');
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
  document.querySelectorAll('input:not([type=range]):not([type=checkbox]), select, textarea').forEach(el => {
    el.addEventListener('change', debounce(() => {  updateProgress(); }, 600));
  });
  document.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.addEventListener('change', () => {  updateProgress(); });
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
  updateNavBadge('dissoc',    ['diss-derealisation','diss-depersonnalisation','diss-fragmentation','diss-emousse']);
  updateNavBadge('complex',   ['cx-d1','cx-d2','cx-d3']);
  updateNavBadge('child',     ['ch1','ch2','ch3']);
  updateNavBadge('puerp',     ['p1','p2','p3']);
  updateNavBadge('assoc',     ['a1','a2','a3']);
  updateNavBadge('impact',    ['fi-family','fi-work','fi-global']);

  // Update signes badge
  const _signesIds = ['sg-voix-mono','sg-regard-fixe','sg-ralent-ideo','sg-automatismes','sg-sourires-para','sg-absence-emo','sg-etrangete','sg-vie-defile'];
  const _signesCount = _signesIds.filter(function(id) { var el = document.getElementById(id); return el && el.checked; }).length;
  var _signBadge = document.getElementById('badge-signes');
  if (_signBadge) { _signBadge.textContent = _signesCount || ''; _signBadge.style.display = _signesCount ? '' : 'none'; }
}

function updateNavBadge(name, fieldIds) {
  const badge = document.getElementById('badge-'+name);
  if (!badge) return;
  const filled = fieldIds.filter(id => { const v = getVal(id); return !!v && v !== '' && v !== 'no'; }).length;
  badge.className = 'nav-badge';
  if (filled > 0 && filled >= fieldIds.length) badge.classList.add('green');
  else if (filled > 0) badge.classList.add('orange');
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

    // Section headers (ALL CAPS lines or separator lines)
    if (line.match(/^[A-ZÀ-Ü’\s/,\-]{4,}$/) && line.trim().length > 3 && !line.startsWith('\u2500') && !line.startsWith('\u2550')) {
      y += 2;
      doc.setFillColor(240, 245, 252);
      doc.roundedRect(marginL, y - 4, contentW, 8, 2, 2, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 50, 120);
      doc.text(line.trim(), marginL + 3, y + 1);
      y += 9;
    } else if (line.startsWith('\u2500') || line.startsWith('\u2550') || line.startsWith('=')) {
      // Separator - thin line
      doc.setDrawColor(180, 190, 210);
      doc.setLineWidth(0.3);
      doc.line(marginL, y - 2, pageW - marginR, y - 2);
      y += 2;
    } else if (line.trim() === '') {
      y += 3;
    } else {
      // Normal content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      var wrapped = doc.splitTextToSize(line, contentW);
      wrapped.forEach(function(wl) {
        checkY(6);
        doc.text(wl, marginL, y);
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
  updateProgress();
}
