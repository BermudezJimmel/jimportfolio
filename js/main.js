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
  $$('[data-diagram]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-diagram]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $('#d-org').classList.toggle('hidden', b.dataset.diagram !== 'org');
      $('#d-web').classList.toggle('hidden', b.dataset.diagram !== 'web');
    });
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
})();
