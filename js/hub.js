'use strict';

/* ── PARTICLES ───────────────────────────────────────────── */
(function initParticles() {
  var canvas = document.getElementById('hub-particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  var pts = [];
  for (var i = 0; i < 65; i++) {
    pts.push({ x: Math.random()*1600, y: Math.random()*900, vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35, r: Math.random()*1.5+.4 });
  }
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(79,124,255,0.5)'; ctx.fill();
    });
    for (var i = 0; i < pts.length; i++) {
      for (var j = i+1; j < pts.length; j++) {
        var dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
        var d = Math.sqrt(dx*dx+dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = 'rgba(79,124,255,'+(0.15*(1-d/120))+')';
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ── SMOOTH SCROLL TO MODULES ────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href="#modules"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
    });
  });
  document.querySelectorAll('a[href="#legal"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector('.hub-footer').scrollIntoView({ behavior: 'smooth' });
    });
  });
});
