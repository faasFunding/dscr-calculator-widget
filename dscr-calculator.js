/*! FAAS Funding DSCR Calculator widget v1.0.0 | https://faasfunding.com/dscr-calculator/ */
(function () {
  'use strict';
  if (window.__faasDscrWidget) { window.__faasDscrWidget.scan(); return; }

  var SITE = 'https://faasfunding.com';
  var HOST = (location.hostname || 'unknown').replace(/[^a-z0-9.-]/gi, '').slice(0, 60);
  function utm(path, content) {
    return SITE + path + '?utm_source=' + encodeURIComponent(HOST) +
      '&utm_medium=widget&utm_campaign=dscr_embed&utm_content=' + content;
  }
  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function safeColor(c, d) { return /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : d; }

  var CSS = [
    ':host{all:initial;display:block}',
    '.w{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1a2332;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;max-width:560px;box-sizing:border-box;line-height:1.5;font-size:15px}',
    '.w *{box-sizing:border-box}',
    'h3{margin:0 0 4px;font-size:20px;font-weight:700;color:#1a2332}',
    '.sub{margin:0 0 16px;font-size:13px;color:#64748b}',
    '.g{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '@media (max-width:340px){.g{grid-template-columns:1fr}}',
    'label{display:block;font-size:13px;font-weight:600;color:#334155}',
    'input[type=text]{display:block;width:100%;margin-top:4px;padding:9px 10px;font-size:15px;border:1px solid #cbd5e1;border-radius:8px;color:#1a2332;background:#fff;font-family:inherit}',
    'input[type=text]:focus{outline:2px solid var(--a);outline-offset:0;border-color:transparent}',
    '.chk{display:flex;align-items:center;gap:8px;margin-top:12px;font-weight:500}',
    '.r{margin-top:16px;padding:16px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0}',
    '.big{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
    '.big b{font-size:34px;line-height:1;color:var(--s)}',
    '.big span{font-size:14px;font-weight:600;color:var(--s)}',
    '.rows{margin-top:10px;font-size:14px;color:#334155}',
    '.rows div{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px dashed #e2e8f0}',
    '.note{margin-top:10px;font-size:13px;color:#475569}',
    '.cta{display:block;margin-top:14px;text-align:center;background:var(--a);color:#fff;text-decoration:none;font-weight:700;padding:12px 16px;border-radius:8px}',
    '.cta:hover{filter:brightness(.95)}',
    '.ft{margin-top:12px;font-size:11px;color:#94a3b8;line-height:1.4}',
    '.ft a{color:#64748b}'
  ].join('\n');

  var FIELDS = [
    ['rent', 'Monthly rent', '3,000'],
    ['loan', 'Loan amount', '300,000'],
    ['rate', 'Interest rate (%)', '7.5'],
    ['term', 'Term (years)', '30'],
    ['tax', 'Property taxes / month', '350'],
    ['ins', 'Insurance / month', '125'],
    ['hoa', 'HOA dues / month', '0']
  ];

  function mount(el) {
    if (el.__faasMounted) return;
    el.__faasMounted = true;
    var accent = safeColor(el.getAttribute('data-accent'), '#cc1e1e');
    var root = el.attachShadow ? el.attachShadow({ mode: 'open' }) : el;
    var f = FIELDS.map(function (x) {
      return '<label>' + x[1] + '<input type="text" inputmode="decimal" data-k="' + x[0] + '" value="' + x[2] + '"></label>';
    }).join('');
    root.innerHTML = '<style>' + CSS + '</style>' +
      '<div class="w" style="--a:' + accent + '">' +
      '<h3>DSCR Calculator</h3>' +
      '<p class="sub">Debt service coverage ratio = monthly rent ÷ monthly PITIA (principal, interest, taxes, insurance, HOA).</p>' +
      '<div class="g">' + f + '</div>' +
      '<label class="chk"><input type="checkbox" data-k="io"> Interest-only payment</label>' +
      '<div class="r" aria-live="polite">' +
      '<div class="big"><b data-o="dscr">–</b><span data-o="label"></span></div>' +
      '<div class="rows"><div><span>Principal &amp; interest</span><span data-o="pi">–</span></div>' +
      '<div><span>Total PITIA</span><span data-o="pitia">–</span></div>' +
      '<div><span>Monthly rent minus PITIA</span><span data-o="cf">–</span></div></div>' +
      '<p class="note" data-o="note"></p></div>' +
      '<a class="cta" target="_blank" rel="noopener" href="' + utm('/dscr-calculator/', 'cta') + '">Check your DSCR loan options →</a>' +
      '<p class="ft">Estimates for illustration only; not a rate quote, offer or commitment to lend. Lender DSCR methods and requirements vary. ' +
      'Calculator by <a target="_blank" rel="noopener" href="' + utm('/', 'credit') + '">FAAS Funding</a>.</p>' +
      '</div>';

    function q(s) { return root.querySelector(s); }
    function v(k) { return num(q('[data-k="' + k + '"]').value); }
    function out(k, t) { q('[data-o="' + k + '"]').textContent = t; }

    function calc() {
      var rent = v('rent'), loan = v('loan'), rate = v('rate') / 100 / 12, n = Math.round(v('term') * 12);
      var io = q('[data-k="io"]').checked, pi = 0;
      if (loan > 0) {
        if (io) pi = loan * rate;
        else if (n > 0) pi = rate > 0 ? loan * rate / (1 - Math.pow(1 + rate, -n)) : loan / n;
      }
      var pitia = pi + v('tax') + v('ins') + v('hoa');
      var w = q('.w');
      if (!(pitia > 0) || !(rent > 0)) {
        out('dscr', '–'); out('label', ''); out('pi', '–'); out('pitia', '–'); out('cf', '–');
        out('note', 'Enter rent and loan details to see your estimated DSCR.');
        return;
      }
      var d = rent / pitia, color, label, note;
      if (d >= 1.25) {
        color = '#15803d'; label = 'At or above 1.25';
        note = 'Rent covers the modeled PITIA with room to spare. 1.25 is a commonly referenced benchmark, though requirements vary by lender.';
      } else if (d >= 1) {
        color = '#b45309'; label = 'Between 1.00 and 1.24';
        note = 'Rent covers the modeled PITIA. Many programs accept ratios in this range; pricing and leverage may vary.';
      } else {
        color = '#b91c1c'; label = 'Below 1.00';
        note = 'Rent does not fully cover the modeled PITIA. Some programs consider lower ratios, often with more down payment or reserves.';
      }
      w.style.setProperty('--s', color);
      out('dscr', d.toFixed(2)); out('label', label); out('note', note);
      out('pi', money(pi)); out('pitia', money(pitia));
      out('cf', (rent - pitia < 0 ? '-' : '') + money(Math.abs(rent - pitia)));
    }
    root.addEventListener('input', calc);
    root.addEventListener('change', calc);
    calc();
  }

  function scan() {
    var els = document.querySelectorAll('#faas-dscr-calculator, .faas-dscr-widget');
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  window.__faasDscrWidget = { scan: scan, version: '1.0.0' };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
})();
