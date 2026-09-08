'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, BadgeDollarSign, BarChart3, BookOpenCheck,
  Bot, Boxes, CheckCircle2, ChevronRight, CircleGauge, CloudCog, DatabaseZap,
  FileCheck2, FlaskConical, GitBranch, Network, RefreshCw, ShieldCheck, Target,
  TriangleAlert, Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type View = 'command' | 'workflows' | 'economics' | 'evolution';

const releaseGates = [
  { label: 'Evidence precision', value: 98, target: '≥98%', status: 'pass' },
  { label: 'Scope recall', value: 95, target: '≥95%', status: 'pass' },
  { label: 'Replay agreement', value: 99, target: '≥99%', status: 'pass' },
  { label: 'Freshness SLA', value: 96, target: '≥98%', status: 'watch' },
] as const;

const workflows = [
  { id: 'contract', name: 'Priority contract assurance', signal: 'Questionnaire + obligations', outcome: 'Customer-ready evidence room', sla: '4h', state: 'pilot', value: 'Revenue velocity' },
  { id: 'audit', name: 'Audit PBC response', signal: 'Auditor request', outcome: 'Signed, scoped evidence bundle', sla: '8h', state: 'ready', value: 'Audit efficiency' },
  { id: 'drift', name: 'Continuous control drift', signal: 'Cloud or Kubernetes event', outcome: 'Qualified gap + routed owner', sla: '15m', state: 'ready', value: 'Risk reduction' },
  { id: 'ai', name: 'AI system governance', signal: 'New model or material change', outcome: 'ISO 42001 / AI RMF decision', sla: '1d', state: 'shadow', value: 'Safe innovation' },
  { id: 'vendor', name: 'Vendor & subprocessor change', signal: 'Inventory or contract event', outcome: 'Impact analysis + approval', sla: '1d', state: 'shadow', value: 'Third-party resilience' },
] as const;

const scenarios = [
  ['Wrong account or region', 'Blocked', 'critical'], ['Stale audit evidence', 'Rejected', 'high'],
  ['Partial API pagination', 'Detected', 'high'], ['Evidence prompt injection', 'Blocked', 'critical'],
  ['Conflicting framework map', 'Escalated', 'medium'], ['Unapproved agent write', 'Denied', 'critical'],
] as const;

const scoreDimensions = [
  ['Evidence reliability', 20, '98.0'], ['Decision correctness', 15, '96.8'],
  ['Control mapping', 10, '95.4'], ['Agent safety', 15, '100'],
  ['Workflow resilience', 10, '97.2'], ['Auditability', 10, '99.1'],
  ['Business velocity', 10, '94.0'], ['Unit economics', 10, '92.6'],
] as const;

const evolutionSteps = [
  ['01', 'Observe', 'Capture accepted outcomes, overrides, latency and cost.'],
  ['02', 'Classify', 'Turn exceptions and near misses into durable test cases.'],
  ['03', 'Challenge', 'Replay prompts, rules, models and mappings offline.'],
  ['04', 'Canary', 'Run shadow traffic with bounded authorization.'],
  ['05', 'Promote', 'Require quality, safety and economic gates—or roll back.'],
] as const;

function money(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function Metric({ value, label, note, tone = 'cyan' }: { value: string; label: string; note: string; tone?: 'cyan' | 'violet' | 'emerald' }) {
  return <div className="metric-card"><p className={`metric-value tone-${tone}`}>{value}</p><p className="mt-2 font-medium text-slate-100">{label}</p><p className="mt-1 text-sm leading-5 text-slate-500">{note}</p></div>;
}

function InputRow({ label, value, min, max, step = 1, suffix, onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void }) {
  return <div className="input-row"><div className="flex items-center justify-between gap-4"><span>{label}</span><strong>{value.toLocaleString()}{suffix}</strong></div><Slider value={[value]} min={min} max={max} step={step} onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)} aria-label={label} /></div>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>('command');
  const [selectedWorkflow, setSelectedWorkflow] = useState('contract');
  const [contractValue, setContractValue] = useState(500000);
  const [daysAccelerated, setDaysAccelerated] = useState(21);
  const [criticalPath, setCriticalPath] = useState(70);
  const [passProbability, setPassProbability] = useState(85);
  const [margin, setMargin] = useState(65);
  const [monthlyVolume, setMonthlyVolume] = useState(180);
  const [minutesSaved, setMinutesSaved] = useState(42);
  const [laborRate, setLaborRate] = useState(95);
  const [monthlyRunCost, setMonthlyRunCost] = useState(6200);
  const [buildCost, setBuildCost] = useState(45000);

  const economics = useMemo(() => {
    const acceleration = contractValue * (daysAccelerated / 365) * (criticalPath / 100) * (passProbability / 100) * (margin / 100);
    const labor = monthlyVolume * (minutesSaved / 60) * laborRate * 12;
    const annualRunCost = monthlyRunCost * 12;
    const contribution = acceleration + labor - annualRunCost;
    const payback = contribution > 0 ? Math.max(1, Math.round(buildCost / (contribution / 365))) : 0;
    return { acceleration, labor, annualRunCost, contribution, payback };
  }, [contractValue, daysAccelerated, criticalPath, passProbability, margin, monthlyVolume, minutesSaved, laborRate, monthlyRunCost, buildCost]);

  useEffect(() => {
    const controller = new AbortController();
    const modelContext = document.modelContext;
    if (!modelContext?.registerTool) return () => controller.abort();
    void modelContext.registerTool({
      name: 'select_grc_control_plane_view',
      description: 'Select the visible A2Z GRC Autonomy Lab view.',
      inputSchema: { type: 'object', properties: { view: { enum: ['command', 'workflows', 'economics', 'evolution'] } }, required: ['view'], additionalProperties: false },
      async execute(input: { view?: string }) {
        if (!input?.view || !['command', 'workflows', 'economics', 'evolution'].includes(input.view)) throw new Error('Invalid view');
        setActiveView(input.view as View);
        return { selected_view: input.view };
      },
    }, { signal: controller.signal });
    return () => controller.abort();
  }, []);

  const workflow = workflows.find((item) => item.id === selectedWorkflow) ?? workflows[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#0f172a]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-3"><div className="brand-mark"><ShieldCheck size={20} /></div><div><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-400">A2Z SOC / GRCBENCH</p><p className="text-lg font-semibold tracking-tight">GRC Autonomy Lab</p></div></div>
          <div className="hidden items-center gap-2 lg:flex"><Badge className="border-emerald-300/25 bg-emerald-300/8 text-emerald-300">Synthetic reference run</Badge><span className="font-mono text-xs text-slate-500">AUT-2026-09-008</span></div>
          <Button nativeButton={false} variant="outline" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]" render={<a href="https://github.com/AAH20/ai-grc-automation-benchmark" target="_blank" rel="noreferrer" aria-label="Open the GRCBench GitHub repository" />}>Open benchmark <ArrowUpRight data-icon="inline-end" /></Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1540px] px-5 py-7 lg:px-8">
        <section className="command-hero">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">Enterprise AI GRC automation control plane</span><Badge variant="outline" className="border-white/10 text-slate-400">Vendor-neutral</Badge><Badge variant="outline" className="border-white/10 text-slate-400">Finance-gated</Badge></div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.01] tracking-[-0.05em] text-white sm:text-5xl xl:text-[4.25rem]">Prove every control, agent decision and business outcome.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">An executable control-to-cash system for qualified evidence, continuous compliance, safe agentic workflows, contract acceleration and board-level cyber-risk decisions.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => setActiveView('workflows')} className="bg-sky-600 text-white hover:bg-sky-500">Inspect workflows <ArrowRight data-icon="inline-end" /></Button><Button onClick={() => setActiveView('economics')} variant="outline" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]">Model economics</Button></div>
          </div>
          <aside className="executive-signal">
            <div className="flex items-start justify-between"><div><p className="eyebrow">Decision confidence</p><h2 className="mt-2 text-xl font-semibold text-white">Release posture</h2></div><div className="score-ring"><span>97.1</span><small>/100</small></div></div>
            <div className="mt-6 grid grid-cols-2 gap-3"><div className="mini-stat"><span>0</span><small>critical safety escapes</small></div><div className="mini-stat"><span>99.1%</span><small>receipt completeness</small></div><div className="mini-stat"><span>12</span><small>proposed workflow scenarios</small></div><div className="mini-stat"><span>150+</span><small>framework-ready</small></div></div>
            <p className="mt-5 border-t border-white/8 pt-4 text-xs leading-5 text-slate-500">Demonstration values are synthetic release targets—not production claims or vendor rankings.</p>
          </aside>
        </section>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as View)} className="mt-7">
          <TabsList className="view-tabs"><TabsTrigger value="command"><CircleGauge size={16} /> Command</TabsTrigger><TabsTrigger value="workflows"><GitBranch size={16} /> Workflows</TabsTrigger><TabsTrigger value="economics"><BadgeDollarSign size={16} /> Economics</TabsTrigger><TabsTrigger value="evolution"><RefreshCw size={16} /> Evolution</TabsTrigger></TabsList>

          <TabsContent value="command" className="mt-5 space-y-5">
            <section className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
              <div className="surface"><div className="section-heading"><div><p className="eyebrow">Control-to-cash</p><h2>One trace from signal to accepted outcome</h2></div><Network className="text-cyan-300" size={22} /></div><div className="pipeline mt-6">{[
                ['01', 'Observe', 'Cloud · identity · business'], ['02', 'Qualify', 'Evidence gates'], ['03', 'Map', 'Controls · 150+ frameworks'], ['04', 'Decide', 'Risk · authorization'], ['05', 'Act', 'Human-gated remediation'], ['06', 'Verify', 'Auditor · customer · Finance'],
              ].map(([step, title, copy], i) => <div className="pipeline-step" key={step}><div className="flex items-center justify-between"><span>{step}</span>{i < 5 && <ChevronRight className="hidden text-slate-700 xl:block" size={15} />}</div><strong>{title}</strong><small>{copy}</small></div>)}</div></div>
              <div className="surface"><div className="section-heading"><div><p className="eyebrow">Hard release gates</p><h2>Quality cannot average away risk</h2></div><ShieldCheck className="text-emerald-300" size={22} /></div><div className="mt-5 space-y-4">{releaseGates.map((gate) => <div key={gate.label}><div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-300">{gate.label}</span><span className={`font-mono text-xs ${gate.status === 'pass' ? 'text-emerald-300' : 'text-amber-300'}`}>{gate.value}% / {gate.target}</span></div><Progress value={gate.value} className={`h-1.5 bg-white/7 ${gate.status === 'pass' ? '[&_[data-slot=progress-indicator]]:bg-cyan-300' : '[&_[data-slot=progress-indicator]]:bg-amber-300'}`} /></div>)}</div></div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric value="≥98%" label="Evidence precision" note="Qualified artifacts accepted by the target consumer" /><Metric value="≥60%" label="Cycle-time reduction" note="Proposed 90-day questionnaire gate" tone="violet" /><Metric value="0" label="Unsafe autonomous writes" note="Non-negotiable release condition" tone="emerald" /><Metric value="100%" label="Traceable executive claims" note="Board statement to evidence receipt" /></section>

            <section className="surface"><div className="section-heading"><div><p className="eyebrow">Executive decision system</p><h2>Three lenses. One governed source of truth.</h2></div><BarChart3 className="text-violet-300" size={22} /></div><div className="mt-6 grid gap-4 lg:grid-cols-3">{[
              [CloudCog, 'Engineering truth', 'Account, region, asset, event, configuration, test and remediation receipts.'],
              [BookOpenCheck, 'Assurance truth', 'Control effectiveness, evidence sufficiency, exceptions, mappings and acceptance.'],
              [BadgeDollarSign, 'Business truth', 'Contract delay, attributable margin, expected loss, operating cost and payback.'],
            ].map(([Icon, title, copy]) => { const CardIcon = Icon as typeof CloudCog; return <div className="lens-card" key={title as string}><CardIcon size={21} /><h3>{title as string}</h3><p>{copy as string}</p></div>; })}</div></section>
          </TabsContent>

          <TabsContent value="workflows" className="mt-5">
            <section className="grid gap-5 xl:grid-cols-[390px_1fr]">
              <div className="surface"><p className="eyebrow">Workflow portfolio</p><h2 className="mt-2 text-xl font-semibold text-white">Prioritize by material outcome</h2><div className="mt-5 space-y-2">{workflows.map((item) => <button className={`workflow-button ${selectedWorkflow === item.id ? 'active' : ''}`} key={item.id} onClick={() => setSelectedWorkflow(item.id)}><span><strong>{item.name}</strong><small>{item.value}</small></span><ChevronRight size={17} /></button>)}</div></div>
              <div className="space-y-5">
                <div className="surface"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><div className="flex flex-wrap gap-2"><Badge className="border-sky-300/20 bg-sky-300/8 text-sky-300">{workflow.state.toUpperCase()}</Badge><Badge variant="outline" className="border-white/10 text-slate-400">SLA {workflow.sla}</Badge></div><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{workflow.name}</h2><p className="mt-2 text-slate-400">{workflow.signal} <ArrowRight className="mx-2 inline" size={15} /> {workflow.outcome}</p></div><Target className="text-cyan-300" size={28} /></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
                  ['Trigger', workflow.signal], ['Evidence', 'Provenance · scope · freshness'], ['Decision', 'Policy gate + named approver'], ['Proof', workflow.outcome],
                ].map(([label, copy]) => <div className="path-card" key={label}><span>{label}</span><p>{copy}</p></div>)}</div></div>
                <div className="grid gap-5 lg:grid-cols-2"><div className="surface"><div className="section-heading"><div><p className="eyebrow">Failure laboratory</p><h2>Real breakpoints, injected safely</h2></div><FlaskConical className="text-violet-300" size={22} /></div><div className="mt-4 divide-y divide-white/7">{scenarios.map(([name, result, severity]) => <div className="flex items-center justify-between gap-4 py-3" key={name}><div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-300" size={16} /><span className="text-sm text-slate-300">{name}</span></div><div className="text-right"><p className="font-mono text-xs text-emerald-300">{result}</p><p className="mt-0.5 text-xs text-slate-600">{severity}</p></div></div>)}</div></div>
                  <div className="surface"><div className="section-heading"><div><p className="eyebrow">Integration plane</p><h2>Portable, not platform-bound</h2></div><Boxes className="text-cyan-300" size={22} /></div><div className="mt-5 flex flex-wrap gap-2">{['AWS', 'Azure', 'GCP', 'Kubernetes', 'CI/CD', 'SIEM', 'GRC system', 'Work tracker', 'HRIS', 'Vendor systems', 'n8n', 'Zapier', 'OSCAL', 'CISO Assistant'].map((item) => <Badge variant="outline" className="border-white/10 bg-white/[0.025] px-3 py-1.5 text-slate-300" key={item}>{item}</Badge>)}</div><p className="mt-5 text-sm leading-6 text-slate-500">Adapters normalize authorized records. The benchmark evaluates qualified outcomes, not connector availability.</p></div></div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="economics" className="mt-5">
            <section className="grid gap-5 xl:grid-cols-[.82fr_1.18fr]">
              <div className="surface"><div className="section-heading"><div><p className="eyebrow">Finance-safe assumptions</p><h2>Change an input. Challenge the claim.</h2></div><BadgeDollarSign className="text-emerald-300" size={22} /></div><div className="mt-6 space-y-5"><InputRow label="Contract value in scope" value={contractValue} min={50000} max={3000000} step={50000} suffix=" USD" onChange={setContractValue} /><InputRow label="Days accelerated" value={daysAccelerated} min={1} max={120} suffix=" days" onChange={setDaysAccelerated} /><InputRow label="GRC on critical path" value={criticalPath} min={5} max={100} step={5} suffix="%" onChange={setCriticalPath} /><InputRow label="Successful completion probability" value={passProbability} min={5} max={100} step={5} suffix="%" onChange={setPassProbability} /><InputRow label="Contribution margin" value={margin} min={5} max={95} step={5} suffix="%" onChange={setMargin} /></div></div>
              <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Metric value={money(economics.acceleration)} label="Modeled acceleration value" note="Not booked revenue; probability and margin adjusted" tone="emerald" /><Metric value={money(economics.labor)} label="Annual capacity value" note="Volume × minutes saved × loaded rate" /><Metric value={money(economics.contribution)} label="Annual contribution" note="Acceleration + capacity − recurring run cost" tone="violet" /><Metric value={economics.payback ? `${economics.payback} days` : 'No payback'} label="Modeled payback" note="Build cost divided by daily contribution" /></div><div className="surface"><p className="eyebrow">Transparent equation</p><div className="formula mt-4">Acceleration value = contract value × GRC critical-path probability × pass probability × days accelerated / 365 × contribution margin</div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="path-card"><span>Confirmed</span><p>Contract value demonstrably unblocked</p></div><div className="path-card"><span>Modeled</span><p>Probability-weighted pipeline influence</p></div><div className="path-card"><span>Attributable</span><p>Finance-approved margin admitted to ROI</p></div></div></div></div>
            </section>
            <section className="surface mt-5"><div className="section-heading"><div><p className="eyebrow">Operating model</p><h2>Capacity and cost sensitivity</h2></div><Activity className="text-cyan-300" size={22} /></div><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5"><InputRow label="Monthly outcomes" value={monthlyVolume} min={10} max={2000} step={10} suffix="" onChange={setMonthlyVolume} /><InputRow label="Minutes saved" value={minutesSaved} min={5} max={240} step={5} suffix=" min" onChange={setMinutesSaved} /><InputRow label="Loaded labor rate" value={laborRate} min={25} max={250} step={5} suffix=" USD/h" onChange={setLaborRate} /><InputRow label="Monthly run cost" value={monthlyRunCost} min={500} max={50000} step={500} suffix=" USD" onChange={setMonthlyRunCost} /><InputRow label="Initial build cost" value={buildCost} min={5000} max={250000} step={5000} suffix=" USD" onChange={setBuildCost} /></div></section>
          </TabsContent>

          <TabsContent value="evolution" className="mt-5 space-y-5">
            <section className="surface"><div className="section-heading"><div><p className="eyebrow">Governed evolution loop</p><h2>Every exception makes the system harder to fool</h2></div><RefreshCw className="text-violet-300" size={22} /></div><div className="mt-6 grid gap-3 lg:grid-cols-5">{evolutionSteps.map(([step, title, copy]) => <div className="evolution-card" key={step}><span>{step}</span><Bot size={20} /><h3>{title}</h3><p>{copy}</p></div>)}</div></section>
            <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><div className="surface"><div className="section-heading"><div><p className="eyebrow">Champion / challenger</p><h2>Promotion decision</h2></div><CircleGauge className="text-cyan-300" size={22} /></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead><tr><th>Dimension</th><th>Weight</th><th>Champion</th><th>Challenger</th><th>Gate</th></tr></thead><tbody>{scoreDimensions.map(([name, weight, score], index) => { const challenger = Math.min(100, Number(score) + (index % 3 === 0 ? 0.6 : 1.2)).toFixed(1); return <tr key={name}><td>{name}</td><td>{weight}%</td><td>{score}</td><td className="text-cyan-300">{challenger}</td><td><Badge className="bg-emerald-300/10 text-emerald-300">PASS</Badge></td></tr>; })}</tbody></table></div></div>
              <div className="surface"><p className="eyebrow">Non-negotiable promotion gates</p><h2 className="mt-2 text-xl font-semibold text-white">Better must also be safer</h2><div className="mt-5 space-y-3">{['Zero critical authorization regressions', '100% provenance on decision-grade evidence', 'Historic failures replay successfully', 'No material tenant or workflow disparity', 'Lower cost or approved quality/cost tradeoff', 'Named owner, approver and rollback plan'].map((item) => <div className="gate-row" key={item}><CheckCircle2 size={17} /><span>{item}</span></div>)}</div><div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/7 p-4 text-sm leading-6 text-amber-100/75"><TriangleAlert className="mr-2 inline text-amber-300" size={17} />A higher aggregate score never overrides a failed safety, authorization, provenance or Finance-attribution gate.</div></div></section>
            <section className="surface"><div className="section-heading"><div><p className="eyebrow">Executive access gates</p><h2>From 90-day operator to decision partner</h2></div><Users className="text-emerald-300" size={22} /></div><div className="mt-6 grid gap-3 md:grid-cols-3"><div className="phase-card"><span>Days 1–30</span><h3>Baseline with leadership</h3><p>Agree workflows, risk appetite, financial attribution, acceptance criteria and current-state measures.</p></div><div className="phase-card"><span>Days 31–90</span><h3>Prove controlled outcomes</h3><p>Shadow, canary and operate priority contract and audit workflows with replayable receipts.</p></div><div className="phase-card featured"><span>Quarter 2 gate</span><h3>Board, auditor & priority customer</h3><p>Participate after safety, accuracy, attribution and two material workflow gates are accepted by leadership.</p></div></div></section>
          </TabsContent>
        </Tabs>

        <footer className="flex flex-col justify-between gap-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center"><p>A2Z GRC Autonomy Lab · open benchmark, private evidence</p><div className="flex flex-wrap items-center gap-4"><span className="flex items-center gap-2"><DatabaseZap size={14} /> Qualified outcomes</span><span className="flex items-center gap-2"><FileCheck2 size={14} /> Signed receipts</span><span className="flex items-center gap-2"><ShieldCheck size={14} /> Human-governed</span></div></footer>
      </div>
    </main>
  );
}
