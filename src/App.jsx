import React, { useMemo, useState } from 'react';
import axe from 'axe-core';
import {
  Accessibility, Activity, AlertTriangle, ArrowUpRight, CheckCircle2, ChevronDown,
  ClipboardCheck, Download, FileText, FlaskConical, Gauge, LayoutDashboard,
  ListChecks, Search, ShieldCheck, Sparkles, XCircle
} from 'lucide-react';
import DefectLab from './components/DefectLab.jsx';
import { manualCases, categories } from './data/testCases.js';

const labCategories = ['Forms', 'Keyboard', 'Images & links', 'Dialogs & menus', 'Dynamic content', 'Responsive & zoom'];

function downloadFile(filename, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><Icon size={18} aria-hidden="true" /></div>
      <strong>{value}</strong>
      <p>{hint}</p>
    </article>
  );
}

function FindingRow({ finding, index }) {
  const target = finding.nodes?.[0];
  return (
    <details className="finding-row">
      <summary>
        <span className={`severity severity-${finding.impact || 'unknown'}`}>{finding.impact || 'review'}</span>
        <span className="finding-title">{finding.help}</span>
        <span className="finding-count">{finding.nodes?.length || 0} element(s)</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <div className="finding-detail">
        <p>{finding.description}</p>
        <p><strong>Rule:</strong> <code>{finding.id}</code></p>
        <p><strong>Guidance:</strong> <a href={finding.helpUrl} target="_blank" rel="noreferrer">Read rule guidance <ArrowUpRight size={13} aria-hidden="true" /></a></p>
        {target && <div className="code-panel"><span>Example affected element</span><pre><code>{target.html}</code></pre><p>{target.failureSummary || 'Inspect the element and verify the proposed correction.'}</p></div>}
        <p className="small-note">This is automated guidance. Review the element in context and retest the fix before marking it resolved.</p>
      </div>
    </details>
  );
}

function App() {
  const [page, setPage] = useState('Overview');
  const [labCategory, setLabCategory] = useState('Forms');
  const [fixed, setFixed] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle');
  const [findings, setFindings] = useState([]);
  const [scanMeta, setScanMeta] = useState(null);
  const [manualStatus, setManualStatus] = useState(() => Object.fromEntries(manualCases.map((c) => [c.id, 'Not tested'])));
  const [manualFilter, setManualFilter] = useState('All');
  const [manualSearch, setManualSearch] = useState('');
  const [toast, setToast] = useState('');

  const violationCount = findings.length;
  const affectedElements = findings.reduce((sum, f) => sum + (f.nodes?.length || 0), 0);
  const manualPassed = Object.values(manualStatus).filter((v) => v === 'Pass').length;

  async function runAudit() {
    const target = document.getElementById('lab-audit-root');
    if (!target) {
      setToast('Open the Defect Lab before running an audit.');
      return;
    }
    setScanStatus('running');
    setFindings([]);
    setToast('');
    try {
      const result = await axe.run(target, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }
      });
      setFindings(result.violations);
      setScanMeta({
        date: new Date().toISOString(),
        page: labCategory,
        mode: fixed ? 'Corrected example' : 'Seeded defects',
        passes: result.passes.length,
        incomplete: result.incomplete.length,
        inapplicable: result.inapplicable.length,
        violations: result.violations.length,
        testedNodes: result.violations.reduce((n, item) => n + item.nodes.length, 0),
        engine: 'axe-core'
      });
      setScanStatus('done');
      setPage('Audit report');
    } catch (error) {
      setScanStatus('error');
      setToast(`Audit could not complete: ${error.message}`);
    }
  }

  const filteredCases = useMemo(() => manualCases.filter((item) => {
    const matchesCategory = manualFilter === 'All' || item.category === manualFilter;
    const term = manualSearch.trim().toLowerCase();
    const matchesSearch = !term || `${item.id} ${item.title} ${item.steps} ${item.wcag}`.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  }), [manualFilter, manualSearch]);

  function exportReport() {
    const report = {
      product: 'AccessLens',
      generatedAt: new Date().toISOString(),
      note: 'Automated findings are not a conformance determination. Manual testing is also required.',
      scan: scanMeta,
      violations: findings.map((f) => ({
        id: f.id, impact: f.impact, help: f.help, description: f.description,
        helpUrl: f.helpUrl, nodes: f.nodes.map((n) => ({ target: n.target, html: n.html, failureSummary: n.failureSummary }))
      })),
      manualChecklist: manualCases.map((c) => ({ ...c, status: manualStatus[c.id] }))
    };
    downloadFile('accesslens-audit-report.json', JSON.stringify(report, null, 2));
  }

  const nav = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Defect Lab', icon: FlaskConical },
    { label: 'Audit report', icon: FileText },
    { label: 'Manual checks', icon: ListChecks },
    { label: 'Methodology', icon: ShieldCheck }
  ];

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark"><Accessibility size={23} aria-hidden="true" /></div>
          <div><strong>AccessLens</strong><span>ACCESSIBILITY ENGINEERING</span></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className={`nav-item ${page === label ? 'active' : ''}`} onClick={() => setPage(label)} aria-current={page === label ? 'page' : undefined}>
              <Icon size={18} aria-hidden="true" /><span>{label}</span>{label === 'Audit report' && violationCount > 0 && <span className="nav-count">{violationCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="status-dot" aria-hidden="true" />
          <div><strong>Local testing workspace</strong><span>No external site data sent</span></div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span aria-hidden="true">/</span><strong>{page}</strong></div>
          <div className="topbar-right"><span className="standard-pill">WCAG 2.2 reference</span><div className="avatar" aria-label="AccessLens workspace">AL</div></div>
        </header>

        <main id="main-content" className="main-content">
          {toast && <div className="toast" role="status"><AlertTriangle size={17} aria-hidden="true" />{toast}<button type="button" onClick={() => setToast('')} aria-label="Dismiss message"><XCircle size={16} /></button></div>}

          {page === 'Overview' && (
            <>
              <section className="hero">
                <div className="hero-copy">
                  <p className="eyebrow"><Sparkles size={14} aria-hidden="true" /> ACCESSIBILITY QUALITY WORKSPACE</p>
                  <h1>Build experiences<br /><span>everyone can use.</span></h1>
                  <p className="hero-description">Find barriers, understand their causes, and verify fixes with a repeatable accessibility engineering workflow.</p>
                  <div className="hero-actions">
                    <button type="button" className="button-primary" onClick={() => setPage('Defect Lab')}><FlaskConical size={17} aria-hidden="true" /> Open defect lab</button>
                    <button type="button" className="button-secondary" onClick={() => setPage('Methodology')}>Read methodology <ArrowUpRight size={15} aria-hidden="true" /></button>
                  </div>
                </div>
                <div className="hero-graphic" aria-hidden="true">
                  <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
                  <div className="graphic-core"><Accessibility size={45} /></div>
                  <div className="floating-card floating-one"><CheckCircle2 size={17} /><span>Inclusive by design</span></div>
                  <div className="floating-card floating-two"><Activity size={17} /><span>Verify every fix</span></div>
                  <div className="graphic-dot dot-one"></div><div className="graphic-dot dot-two"></div>
                </div>
              </section>

              <section className="section-heading">
                <div><h2>Workspace snapshot</h2><p>Results update when you run an audit or record manual checks.</p></div>
                <span className="live-label"><span></span> Local session</span>
              </section>
              <div className="stats-grid">
                <StatCard label="Automated violations" value={scanMeta ? violationCount : '—'} hint={scanMeta ? 'From the latest audit' : 'Run your first audit'} icon={AlertTriangle} />
                <StatCard label="Affected elements" value={scanMeta ? affectedElements : '—'} hint="Across reported violations" icon={Search} />
                <StatCard label="Manual checks passed" value={`${manualPassed}/${manualCases.length}`} hint="Recorded checklist outcomes" icon={ClipboardCheck} />
                <StatCard label="Latest scan" value={scanMeta ? new Date(scanMeta.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not run'} hint={scanMeta ? `${scanMeta.page} · ${scanMeta.mode}` : 'No scan results yet'} icon={Gauge} />
              </div>

              <section className="section-heading"><div><h2>Suggested workflow</h2><p>Work through the evidence, not just the score.</p></div></section>
              <div className="workflow-grid">
                <button className="workflow-card" type="button" onClick={() => setPage('Defect Lab')}><div className="workflow-icon violet"><FlaskConical size={20} /></div><span className="workflow-number">01 / INVESTIGATE</span><h3>Reproduce a defect</h3><p>Switch between seeded defects and corrected examples.</p><span className="card-link">Open lab <ArrowUpRight size={14} /></span></button>
                <button className="workflow-card" type="button" onClick={() => setPage('Audit report')}><div className="workflow-icon blue"><Activity size={20} /></div><span className="workflow-number">02 / TEST</span><h3>Run an automated audit</h3><p>Inspect real axe-core findings for the selected scenario.</p><span className="card-link">View report <ArrowUpRight size={14} /></span></button>
                <button className="workflow-card" type="button" onClick={() => setPage('Manual checks')}><div className="workflow-icon green"><ClipboardCheck size={20} /></div><span className="workflow-number">03 / VERIFY</span><h3>Complete manual checks</h3><p>Record keyboard, screen-reader, zoom, and usability observations.</p><span className="card-link">Open checklist <ArrowUpRight size={14} /></span></button>
              </div>
              <p className="footnote"><ShieldCheck size={15} aria-hidden="true" /> Automated scans help identify issues but do not prove WCAG conformance. Manual evaluation remains necessary.</p>
            </>
          )}

          {page === 'Defect Lab' && (
            <>
              <div className="page-intro"><p className="eyebrow">INVESTIGATION WORKBENCH</p><h1>Accessibility defect lab</h1><p>Reproduce a seeded issue, compare the corrected implementation, and run the scanner against the active example.</p></div>
              <div className="lab-toolbar">
                <div className="select-field"><label htmlFor="lab-category">Test scenario</label><select id="lab-category" value={labCategory} onChange={(e) => { setLabCategory(e.target.value); setScanStatus('idle'); }}><option>Forms</option><option>Keyboard</option><option>Images & links</option><option>Dialogs & menus</option><option>Dynamic content</option><option>Responsive & zoom</option></select></div>
                <div className="mode-switch" role="group" aria-label="Implementation mode">
                  <button type="button" className={!fixed ? 'selected' : ''} onClick={() => { setFixed(false); setScanStatus('idle'); }} aria-pressed={!fixed}>Seeded defects</button>
                  <button type="button" className={fixed ? 'selected' : ''} onClick={() => { setFixed(true); setScanStatus('idle'); }} aria-pressed={fixed}>Corrected example</button>
                </div>
                <button type="button" className="button-primary" onClick={runAudit} disabled={scanStatus === 'running'}><Search size={16} aria-hidden="true" />{scanStatus === 'running' ? 'Scanning…' : 'Run accessibility audit'}</button>
              </div>
              <div className="lab-layout">
                <div id="lab-audit-root" className="lab-preview">
                  <div className="preview-header"><span className="preview-indicator"></span><span>LOCAL TEST FIXTURE</span><span className={`mode-tag ${fixed ? 'mode-fixed' : 'mode-defect'}`}>{fixed ? 'Corrected' : 'Seeded defects'}</span></div>
                  <DefectLab category={labCategory} fixed={fixed} />
                </div>
                <aside className="lab-aside">
                  <div className="aside-icon"><FlaskConical size={20} /></div>
                  <h3>Investigation notes</h3>
                  <p className="muted">Use the same process you would follow when reviewing an unfamiliar application.</p>
                  <ol className="investigation-list">
                    <li><span>1</span><div><strong>Reproduce</strong><p>Follow the expected steps and observe the behavior.</p></div></li>
                    <li><span>2</span><div><strong>Inspect</strong><p>Use browser developer tools and the accessibility tree.</p></div></li>
                    <li><span>3</span><div><strong>Explain</strong><p>Record user impact, root cause, and relevant WCAG guidance.</p></div></li>
                    <li><span>4</span><div><strong>Retest</strong><p>Switch to the corrected example and run checks again.</p></div></li>
                  </ol>
                  <div className="notice"><strong>Testing boundary</strong><p>Automated results apply only to the active fixture. Keyboard, screen-reader, meaning, and usability checks need manual evaluation.</p></div>
                </aside>
              </div>
            </>
          )}

          {page === 'Audit report' && (
            <>
              <div className="page-intro report-intro"><div><p className="eyebrow">TEST EVIDENCE</p><h1>Audit report</h1><p>Results from the most recent axe-core scan of the selected local fixture.</p></div><button className="button-primary" type="button" onClick={exportReport} disabled={!scanMeta}><Download size={16} /> Export report</button></div>
              {!scanMeta ? (
                <div className="empty-state"><div className="empty-icon"><FileText size={28} /></div><h2>No audit results yet</h2><p>Open the Defect Lab, select a scenario, and run an accessibility audit to populate this report.</p><button className="button-primary" type="button" onClick={() => setPage('Defect Lab')}>Go to defect lab</button></div>
              ) : (
                <>
                  <div className="report-summary">
                    <div><span className="eyebrow">LATEST RUN</span><h2>{scanMeta.page} · {scanMeta.mode}</h2><p>{new Date(scanMeta.date).toLocaleString()} · Engine: {scanMeta.engine}</p></div>
                    <div className="summary-metric"><strong>{scanMeta.violations}</strong><span>violations</span></div>
                    <div className="summary-metric"><strong>{scanMeta.passes}</strong><span>rules passed</span></div>
                    <div className="summary-metric"><strong>{scanMeta.incomplete}</strong><span>needs review</span></div>
                  </div>
                  <div className="report-warning"><AlertTriangle size={18} /><p><strong>Interpret results carefully.</strong> A rule pass is not proof of complete accessibility. Review incomplete results, test with a keyboard and screen reader, and assess content meaning manually.</p></div>
                  <div className="section-heading"><div><h2>Detected violations</h2><p>{violationCount} violation rule(s), affecting {affectedElements} reported element instance(s).</p></div></div>
                  {findings.length ? <div className="finding-list">{findings.map((f, i) => <FindingRow key={`${f.id}-${i}`} finding={f} index={i} />)}</div> : <div className="empty-state compact"><CheckCircle2 size={30} /><h2>No violations reported by the selected rules</h2><p>This is not a statement of WCAG conformance. Complete the manual checks and review any incomplete results.</p></div>}
                </>
              )}
            </>
          )}

          {page === 'Manual checks' && (
            <>
              <div className="page-intro"><p className="eyebrow">HUMAN EVALUATION</p><h1>Manual test checklist</h1><p>Automated tools cannot judge every accessibility requirement. Record observations from keyboard, screen-reader, zoom, and contextual testing.</p></div>
              <div className="checklist-summary"><div><strong>{manualCases.length}</strong><span>test cases</span></div><div><strong>{manualPassed}</strong><span>passed</span></div><div><strong>{Object.values(manualStatus).filter((v) => v === 'Fail').length}</strong><span>failed</span></div><div><strong>{Object.values(manualStatus).filter((v) => v === 'Not tested').length}</strong><span>not tested</span></div></div>
              <div className="checklist-tools"><div className="search-box"><Search size={16} /><label className="sr-only" htmlFor="case-search">Search test cases</label><input id="case-search" placeholder="Search test cases…" value={manualSearch} onChange={(e) => setManualSearch(e.target.value)} /></div><label className="sr-only" htmlFor="case-category">Filter category</label><select id="case-category" value={manualFilter} onChange={(e) => setManualFilter(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="manual-list">{filteredCases.map((item) => (
                <article className="manual-card" key={item.id}>
                  <div className="manual-card-main"><div className="case-id">{item.id}</div><div><span className="category-tag">{item.category}</span><h3>{item.title}</h3><p>{item.steps}</p><p className="expected"><strong>Expected:</strong> {item.expected}</p><span className="wcag-ref">{item.wcag}</span></div></div>
                  <div className="manual-result"><label htmlFor={`status-${item.id}`}>Result</label><select id={`status-${item.id}`} value={manualStatus[item.id]} onChange={(e) => setManualStatus((prev) => ({ ...prev, [item.id]: e.target.value }))}><option>Not tested</option><option>Pass</option><option>Fail</option><option>Needs review</option></select></div>
                </article>
              ))}</div>
              <div className="checklist-footer"><span>Record actual observations; do not mark a test passed without performing it.</span><button className="button-secondary" type="button" onClick={() => downloadFile('accesslens-manual-checklist.json', JSON.stringify(manualCases.map((c) => ({ ...c, status: manualStatus[c.id] })), null, 2))}><Download size={15} /> Export checklist</button></div>
            </>
          )}

          {page === 'Methodology' && (
            <>
              <div className="page-intro"><p className="eyebrow">TRANSPARENT TESTING</p><h1>Methodology & limitations</h1><p>AccessLens is designed to support an evidence-based evaluation process, not to replace expert judgement.</p></div>
              <div className="method-grid">
                <article className="method-card"><div className="workflow-icon blue"><Activity size={20} /></div><h2>1. Automated evaluation</h2><p>axe-core runs against the selected local test fixture using WCAG-related and best-practice tags. The report records violations, passes, incomplete checks, and inapplicable checks.</p><a href="https://github.com/dequelabs/axe-core" target="_blank" rel="noreferrer">axe-core project <ArrowUpRight size={14} /></a></article>
                <article className="method-card"><div className="workflow-icon violet"><Search size={20} /></div><h2>2. Investigation</h2><p>Inspect the affected element, reproduce the issue, review the DOM and accessibility tree, and determine whether the finding is valid in its context.</p><a href="https://www.w3.org/WAI/test-evaluate/" target="_blank" rel="noreferrer">W3C evaluation guidance <ArrowUpRight size={14} /></a></article>
                <article className="method-card"><div className="workflow-icon green"><ClipboardCheck size={20} /></div><h2>3. Manual verification</h2><p>Test keyboard interaction, focus order, screen-reader output, zoom/reflow, content meaning, and other aspects that cannot be fully verified by automation.</p><a href="https://www.w3.org/WAI/WCAG22/Understanding/" target="_blank" rel="noreferrer">WCAG 2.2 understanding docs <ArrowUpRight size={14} /></a></article>
              </div>
              <section className="content-panel"><h2>What this project does not claim</h2><ul><li>It does not certify a website as WCAG conformant.</li><li>Automated checks cover only rules supported by axe-core and the chosen configuration.</li><li>Manual checklist statuses are user-entered and are not independently verified by the app.</li><li>The seeded examples are teaching fixtures, not a complete representation of every real-world accessibility defect.</li><li>AI-generated fixes are intentionally not applied automatically; human review and retesting are required.</li></ul></section>
              <section className="content-panel"><h2>References</h2><ul><li><a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">Web Content Accessibility Guidelines (WCAG) 2.2</a></li><li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer">W3C WCAG overview</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">ARIA Authoring Practices Guide</a></li><li><a href="https://www.nvaccess.org/download/" target="_blank" rel="noreferrer">NVDA screen reader for Windows</a></li></ul></section>
            </>
          )}
        </main>
        <footer className="app-footer"><span>AccessLens · Accessibility Engineering Workspace</span><span>Built for investigation, not certification.</span></footer>
      </div>
    </div>
  );
}

export default App;
