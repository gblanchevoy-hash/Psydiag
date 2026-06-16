/* ================================================================
   PSYDIAG — Landing Page JavaScript
   Réseau neuronal, CAPTCHA, vérification, transition
   ================================================================ */

'use strict';

/* ── CURSOR HALO ─────────────────────────────────────────────── */
(function initCursorHalo() {
  var halo = document.getElementById('cursorHalo');
  if (!halo) return;

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var hx = mx, hy = my;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateHalo() {
    // Smooth follow with lag
    hx += (mx - hx) * 0.08;
    hy += (my - hy) * 0.08;
    halo.style.left = hx + 'px';
    halo.style.top  = hy + 'px';
    requestAnimationFrame(animateHalo);
  }
  animateHalo();
})();

/* ── CANVAS — RÉSEAU NEURONAL ────────────────────────────────── */
(function initNeuroCanvas() {
  var canvas = document.getElementById('neuroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var W, H;
  var nodes = [];
  var NODE_COUNT = 70;
  var MAX_DIST   = 160;

  /* ── Redimensionnement ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', function() {
    resize();
    buildNodes();
  });

  /* ── Création des nœuds ── */
  function buildNodes() {
    nodes = [];
    for (var i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 2.2 + 0.6,
        pulse: Math.random() * Math.PI * 2,  // phase de pulsation
        pulseSpeed: 0.02 + Math.random() * 0.03,
        // couleur : cyan, bleu, violet aléatoire
        hue: Math.random() < 0.5 ? 190 + Math.random() * 20 : 260 + Math.random() * 30
      });
    }
  }
  buildNodes();

  /* ── Boucle de rendu ── */
  var frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    /* ── Mise à jour positions ── */
    nodes.forEach(function(n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0)  n.x = W;
      if (n.x > W)  n.x = 0;
      if (n.y < 0)  n.y = H;
      if (n.y > H)  n.y = 0;
      n.pulse += n.pulseSpeed;
    });

    /* ── Connexions entre nœuds ── */
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          var alpha = (1 - dist / MAX_DIST) * 0.35;

          // Couleur de la connexion : gradient entre les deux nœuds
          var grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, 'hsla(' + nodes[i].hue + ',90%,65%,' + alpha + ')');
          grad.addColorStop(1, 'hsla(' + nodes[j].hue + ',90%,65%,' + (alpha * 0.5) + ')');

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.7;
          ctx.stroke();

          /* ── Impulsion lumineuse animée sur certaines connexions ── */
          if ((i + j + frame) % 120 === 0) {
            var t = ((frame * 0.015) % 1);
            var px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
            var py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + nodes[i].hue + ',100%,80%,0.9)';
            ctx.fill();
          }
        }
      }
    }

    /* ── Nœuds (neurones) ── */
    nodes.forEach(function(n) {
      var glow = 0.7 + 0.3 * Math.sin(n.pulse);
      var r    = n.r * (0.9 + 0.2 * Math.sin(n.pulse));

      // Halo externe
      var grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
      grad.addColorStop(0, 'hsla(' + n.hue + ',90%,65%,' + (glow * 0.25) + ')');
      grad.addColorStop(1, 'hsla(' + n.hue + ',90%,65%,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Nœud central
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + n.hue + ',90%,75%,' + glow + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── CAPTCHA ─────────────────────────────────────────────────── */
var captchaAnswer = 0;

function refreshCaptcha() {
  /* Génère un calcul aléatoire : addition, soustraction ou multiplication simple */
  var ops = ['+', '-', '×'];
  var op  = ops[Math.floor(Math.random() * ops.length)];
  var a, b;

  if (op === '+') {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 8) + 4;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    captchaAnswer = a - b;
  } else {
    a = Math.floor(Math.random() * 5) + 2;
    b = Math.floor(Math.random() * 4) + 2;
    captchaAnswer = a * b;
  }

  var questionEl = document.getElementById('captchaQuestion');
  if (questionEl) {
    questionEl.textContent = a + ' ' + op + ' ' + b;
  }

  /* Réinitialiser le champ */
  var inputEl = document.getElementById('captchaAnswer');
  if (inputEl) {
    inputEl.value = '';
    inputEl.className = 'lp-captcha-input';
  }

  /* Effacer le hint */
  var hint = document.getElementById('captchaHint');
  if (hint) { hint.textContent = ''; hint.className = 'lp-captcha-hint'; }

  updateAccessButton();
}

/* ── VALIDATION DU BOUTON ────────────────────────────────────── */
function updateAccessButton() {
  var checked  = document.getElementById('professionalCheck');
  var inputEl  = document.getElementById('captchaAnswer');
  var btn      = document.getElementById('accessBtn');
  var hint     = document.getElementById('captchaHint');

  if (!checked || !inputEl || !btn) return;

  var isChecked  = checked.checked;
  var disclaimer = document.getElementById('disclaimerCheck');
  var isDisclaimed = disclaimer ? disclaimer.checked : false;
  var userAnswer = parseInt(inputEl.value, 10);
  var isCorrect  = !isNaN(userAnswer) && userAnswer === captchaAnswer;

  /* Feedback captcha */
  if (inputEl.value.length > 0) {
    if (isCorrect) {
      inputEl.className = 'lp-captcha-input correct';
      hint.textContent  = '✓ Correct';
      hint.className    = 'lp-captcha-hint ok';
    } else {
      inputEl.className = 'lp-captcha-input wrong';
      hint.textContent  = '✗ Réponse incorrecte';
      hint.className    = 'lp-captcha-hint err';
    }
  }

  /* Activer / désactiver le bouton */
  var ready = isChecked && isDisclaimed && isCorrect;
  btn.disabled      = !ready;
  btn.setAttribute('aria-disabled', String(!ready));

  if (ready) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}

/* ── ACCÈS & TRANSITION ──────────────────────────────────────── */
function handleAccess() {
  var btn = document.getElementById('accessBtn');
  if (!btn || btn.disabled) return;

  /* Désactiver pour éviter double-clic */
  btn.disabled = true;

  /* Lancer l'overlay de transition */
  var overlay = document.getElementById('transitionOverlay');
  if (overlay) {
    overlay.classList.add('active');
  }

  /* Redirection après la transition */
  setTimeout(function() {
    window.location.href = 'eval/eval.html';
  }, 1400);
}

/* ── ANIMATION D'ENTRÉE DE LA CARTE ─────────────────────────── */
(function initScrollReveal() {
  var card = document.querySelector('.lp-access-card');
  var features = document.querySelectorAll('.lp-feature-item');
  if (!card) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(card);

  /* Apparition des features avec décalage */
  features.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ' + (i * 0.08) + 's ease, transform 0.5s ' + (i * 0.08) + 's ease';
    observer.observe(el);
    /* On ajoute la classe 'visible' dès que visible */
    el.dataset.obs = '1';
  });

  /* Observer séparé pour les features */
  var featObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        featObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  features.forEach(function(el) { featObs.observe(el); });
})();

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  refreshCaptcha();
});
