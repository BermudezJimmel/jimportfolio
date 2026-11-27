(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  function toggleTheme() {
    var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  $('#theme').addEventListener('click', toggleTheme);
  $('#yr').textContent = new Date().getFullYear();

  // Terminal typing. The full text stays in the page if JS or motion is off.
  var term = $('#term'), full = term.textContent, timer = null;
  function finish() { clearInterval(timer); term.textContent = full; }
  $('#skip-term').addEventListener('click', finish);
  if (!reduce) {
    var i = 0, cur = document.createElement('span');
    cur.className = 'cur';
    term.setAttribute('aria-label', full);
    term.textContent = '';
    timer = setInterval(function () {
      i += 2;
      if (i >= full.length) { finish(); return; }
      term.textContent = full.slice(0, i);
      term.appendChild(cur);
    }, 18);
  }

  // Scroll reveal and counters.
  var els = $$('.reveal'), counts = $$('.count');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, to = +el.dataset.to, suf = el.dataset.suffix || '', n = 0, step = Math.max(1, Math.round(to / 30));
        var t = setInterval(function () {
          n += step;
          if (n >= to) { n = to; clearInterval(t); }
          el.textContent = n + (n === to ? suf : '');
        }, 30);
      });
    });
    counts.forEach(function (c) { co.observe(c); });
  }

  // Filter buttons. data-target is the list id; items carry data-group or data-cat.
  $$('.filters[data-target]').forEach(function (bar) {
    var list = document.getElementById(bar.dataset.target);
    bar.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;
      $$('button', bar).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.f || b.dataset.cat;
      Array.prototype.forEach.call(list.children, function (it) {
        var key = it.dataset.group || it.dataset.cat || '';
        it.classList.toggle('hidden', f !== '*' && key.split(' ').indexOf(f) < 0);
      });
    });
  });

  // Architecture explorer.
  var info = {
    mgmt: ['Management account', ['AWS Organizations with 55+ accounts', 'Control Tower setup and assessments', 'Account structure and billing']],
    audit: ['Audit and security account', ['Central place for security tooling', 'Security Hub and GuardDuty practices']],
    logs: ['Log archive account', ['Central, protected log storage', 'Supports audits and investigations']],
    scp: ['SCP guardrails', ['Service control policies that set limits for member accounts', 'Applied at the OU level so new accounts inherit them']],
    prod: ['Workload accounts', ['Separate accounts for Production, Staging and Dev', 'ECS Fargate, ALB and Cloud Map microservices', 'WordPress on Auto Scaling']],
    backup: ['Backup and DR', ['Backup strategies for EC2, RDS and ElastiCache', 'Scheduling and retention policies', 'Recovery procedures that are tested']],
    cost: ['Cost visibility', ['Cost optimization analysis', 'Architecture options priced in the AWS Calculator']],
    dns: ['Route 53 and CloudFront', ['DNS and domain setup', 'CloudFront in front of web workloads', 'SSL/TLS certificates']],
    waf: ['AWS WAF', ['WAF assessments: web ACLs, rules and protected resources', 'Findings and remediation roadmap', 'VAPT remediation support']],
    alb: ['Application Load Balancer', ['Path-based routing for microservices', 'Health checks and target groups']],
    asg: ['Auto Scaling Group', ['Replatforming WordPress to an Auto Scaling Group', 'Scheduled scaling', 'ECS Fargate for containerized services']],
    rds: ['RDS', ['Database migrations to RDS', 'Multi-AZ options in high-availability designs']],
    vpc: ['Separate VPCs', ['Staging and Production in separate VPCs', 'VPC peering where needed', 'Session Manager for access']],
    bk2: ['Backups', ['Automated snapshots and retention', 'Restore tested before go-live']]
  };
  var panel = $('#panel');
  function show(id) {
    var d = info[id];
    if (!d) return;
    panel.innerHTML = '';
    var h = document.createElement('h3'), ul = document.createElement('ul');
    h.textContent = d[0];
    d[1].forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    panel.appendChild(h);
    panel.appendChild(ul);
    $$('.node').forEach(function (n) { n.classList.toggle('on', n.dataset.id === id); });
  }
  $$('.node').forEach(function (n) {
    n.addEventListener('click', function () { show(n.dataset.id); });
    n.addEventListener('focus', function () { show(n.dataset.id); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n.dataset.id); }
    });
  });
  function setDiagram(d) {
    $$('[data-diagram]').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.diagram === d ? 'true' : 'false'); });
    $('#d-org').classList.toggle('hidden', d !== 'org');
    $('#d-web').classList.toggle('hidden', d !== 'web');
  }
  $$('[data-diagram]').forEach(function (b) {
    b.addEventListener('click', function () { setDiagram(b.dataset.diagram); });
  });

  // Command palette: / or Ctrl/Cmd+K.
  var dlg = $('#palette'), q = $('#pq'), pl = $('#pl'), sel = 0, shown = [];
  function open(u) { window.open(u, '_blank', 'noopener'); }
  var cmds = $$('header nav a').map(function (a) {
    return { t: 'Go to ' + a.textContent, run: function () { location.hash = a.getAttribute('href'); } };
  }).concat([
    { t: 'Toggle dark / light theme', run: toggleTheme },
    { t: 'Open LinkedIn', run: function () { open('https://www.linkedin.com/in/jimmelber/'); } },
    { t: 'Open GitHub', run: function () { open('https://github.com/BermudezJimmel'); } },
    { t: 'Verify certifications on Credly', run: function () { open('https://www.credly.com/users/jimmel-bermudez/badges'); } }
  ]);
  function exec(c) { dlg.close(); c.run(); }
  function render() {
    var s = q.value.toLowerCase();
    shown = cmds.filter(function (c) { return c.t.toLowerCase().indexOf(s) >= 0; });
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    pl.innerHTML = '';
    shown.forEach(function (c, i) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', i === sel ? 'true' : 'false');
      li.textContent = c.t;
      li.addEventListener('click', function () { exec(c); });
      pl.appendChild(li);
    });
  }
  function openPalette() { q.value = ''; sel = 0; render(); if (dlg.showModal) dlg.showModal(); q.focus(); }
  $('#palette-btn').addEventListener('click', openPalette);
  q.addEventListener('input', function () { sel = 0; render(); });
  q.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    else if (e.key === 'Enter' && shown[sel]) { exec(shown[sel]); }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && tag !== 'input' && tag !== 'textarea')) {
      e.preventDefault();
      openPalette();
    }
  });

  // Active nav link on scroll.
  var links = $$('header nav a'), secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }

  // Case study cards: staggered reveal and modal.
  var cards = $$('.case');
  cards.forEach(function (c, n) {
    if (reduce) return;
    c.classList.add('reveal');
    c.style.transitionDelay = (n % 3) * 80 + 'ms';
    if ('IntersectionObserver' in window) io.observe(c); else c.classList.add('in');
  });
  var cm = $('#case-modal'), idx = -1, curCard = null, opener = null;
  function visible(card) { return $$('.case', card.parentNode).filter(function (c) { return !c.classList.contains('hidden'); }); }
  function fill(card) {
    var list = visible(card), n = list.indexOf(card);
    $('#cm-title').textContent = $('h3', card).textContent;
    $('#cm-sub').textContent = $('.sub', card).textContent;
    var g = (card.dataset.group || '').split(' ').filter(function (x) { return x !== 'cloud'; }).join(' / ');
    $('#cm-kind').textContent = card.classList.contains('svc') ? 'Service' : (g || 'cloud');
    var body = $('#cm-body'); body.innerHTML = '';
    body.appendChild($('template', card).content.cloneNode(true));
    var tags = $('#cm-tags'); tags.innerHTML = '';
    var tools = $('[data-tools]', body);
    $$('li', tools || card.querySelector('.tags')).forEach(function (li) { var x = document.createElement('li'); x.textContent = li.textContent; tags.appendChild(x); });
    if (tools) tools.remove();
    var ab = $('#cm-arch'); ab.hidden = !card.dataset.arch; ab.dataset.arch = card.dataset.arch || '';
    $('#cm-count').textContent = (n + 1) + ' of ' + list.length;
    idx = n;
    curCard = card; $('#cm-prev').disabled = list.length < 2; $('#cm-next').disabled = list.length < 2;
  }
  function openCase(card) {
    opener = document.activeElement;
    fill(card);
    document.body.classList.add('lock');
    cm.showModal();
    requestAnimationFrame(function () { cm.classList.add('show'); });
    $('#cm-close').focus();
  }
  function closeCase() {
    function done() { cm.close(); document.body.classList.remove('lock'); if (opener && opener.focus) opener.focus(); }
    cm.classList.remove('show');
    if (reduce) done(); else setTimeout(done, 220);
  }
  function step(d) {
    var list = visible(curCard); if (list.length < 2) return;
    fill(list[(idx + d + list.length) % list.length]);
    $('#cm-title').scrollIntoView({ block: 'nearest' });
  }
  cards.forEach(function (c) {
    c.addEventListener('click', function () { openCase(c); });
  });
  $('#cm-body').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-case]');
    if (!b) return;
    var t = cards.filter(function (c) { return !c.classList.contains('svc') && $('h3', c).textContent === b.dataset.case; })[0];
    if (t) { fill(t); $('#cm-title').scrollIntoView({ block: 'nearest' }); }
  });
  $('#cm-close').addEventListener('click', closeCase);
  $('#cm-prev').addEventListener('click', function () { step(-1); });
  $('#cm-next').addEventListener('click', function () { step(1); });
  $('#cm-arch').addEventListener('click', function () {
    var d = $('#cm-arch').dataset.arch; closeCase(); opener = null; setDiagram(d);
    setTimeout(function () { $('#architecture').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, 240);
  });
  cm.addEventListener('cancel', function (e) { e.preventDefault(); closeCase(); });
  cm.addEventListener('click', function (e) { if (e.target === cm) closeCase(); });
  cm.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();
