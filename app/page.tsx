'use client';

import { useEffect, useState } from 'react';

import { Activity, ArrowUpRight, CheckCircle2, CircleGauge, DatabaseZap, FileCheck2, FlaskConical, GitBranch, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const gates = [
  ['Provenance', 100, 'PASS'], ['Integrity', 100, 'PASS'], ['Freshness', 96, 'PASS'],
  ['Scope recall', 95, 'PASS'], ['Relevance', 98, 'PASS'], ['Replay agreement', 99, 'PASS'],
] as const;

const scenarios = [
  ['AWS scope omission', 'Detected', 'critical'], ['Kubernetes audit gap', 'Detected', 'critical'],
  ['Expired connector token', 'Recovered', 'high'], ['429 + partial pagination', 'Recovered', 'high'],
  ['Evidence prompt injection', 'Blocked', 'critical'], ['Framework mapping conflict', 'Escalated', 'medium'],
] as const;

const evidencePath = [
  ['01', 'Collect', 'AWS · Kubernetes · workflow APIs'], ['02', 'Qualify', 'scope · time · provenance · integrity'],
  ['03', 'Map', 'OSCAL · OLIR · 150+ framework-ready'], ['04', 'Decide', 'risk · alternatives · approval boundary'],
  ['05', 'Value', 'verified savings · Finance attribution'],
] as const;

function Metric({ value, label, note }: { value: string; label: string; note: string }) {
  return <div className="metric-card"><p className="metric-value">{value}</p><p className="mt-2 font-medium text-slate-100">{label}</p><p className="mt-1 text-sm text-slate-500">{note}</p></div>;
}

export default function Home() {
  const [activeView, setActiveView] = useState('scorecard');

  useEffect(() => {
    const controller = new AbortController();
    const modelContext = document.modelContext;
    if (!modelContext?.registerTool) return () => controller.abort();
    void modelContext.registerTool({
      name: 'select_benchmark_view',
      description: 'Select the visible GRCBench decision workspace view: scorecard, economics, or assurance.',
      inputSchema: { type: 'object', properties: { view: { enum: ['scorecard', 'economics', 'assurance'] } }, required: ['view'], additionalProperties: false },
      async execute(input: { view?: string }) {
        if (!input || !['scorecard', 'economics', 'assurance'].includes(input.view ?? '')) throw new Error('view must be scorecard, economics, or assurance');
        setActiveView(input.view!);
        return { selected_view: input.view };
      },
    }, { signal: controller.signal });
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#050a12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/8 text-cyan-300"><CircleGauge size={20} /></div><div><p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">Open benchmark</p><p className="text-lg font-semibold tracking-tight">GRCBench</p></div></div>
          <div className="hidden items-center gap-2 md:flex"><Badge className="border-emerald-300/25 bg-emerald-300/8 text-emerald-300">Reference run verified</Badge><span className="font-mono text-xs text-slate-500">GB-2026-09-001</span></div>
          <Button nativeButton={false} variant="outline" className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]" render={<a href="#method" />}>Methodology <ArrowUpRight data-icon="inline-end" /></Button>
        </div>
      </header>

      <div className="mx-auto max-w-[1480px] px-5 py-8 lg:px-8">
        <section className="grid gap-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,.55fr)]">
          <div className="hero-panel">
            <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">Agentic GRC reliability</span><Badge variant="outline" className="border-white/10 text-slate-400">Vendor-neutral</Badge><Badge variant="outline" className="border-white/10 text-slate-400">Reproducible</Badge></div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">Measure whether GRC automation is defensible—before an auditor, customer or board does.</h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">One execution harness for evidence reliability, control mapping, workflow resilience, agent safety and unit economics. A passed workflow is never treated as qualified evidence by default.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric value="18" label="Failure scenarios" note="Synthetic and credential-free" /><Metric value="10" label="Scoring dimensions" note="Raw measures stay visible" /><Metric value="150+" label="Framework-ready" note="CISO Assistant import contract" /><Metric value="0" label="Paid rankings" note="Execution evidence required" /></div>
          </div>

          <aside className="signal-panel">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Reference runner</p><h2 className="mt-2 text-2xl font-semibold text-white">Release gate</h2></div><div className="score-ring"><span>97.8</span><small>/100</small></div></div>
            <div className="mt-7 space-y-4">{gates.map(([label, value, status]) => <div key={label}><div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-300">{label}</span><span className="font-mono text-xs text-emerald-300">{status} · {value}%</span></div><Progress value={value} className="h-1.5 bg-white/7 [&_[data-slot=progress-indicator]]:bg-cyan-300" /></div>)}</div>
            <div className="mt-7 rounded-lg border border-amber-300/20 bg-amber-300/7 p-4"><div className="flex gap-3"><TriangleAlert className="mt-0.5 shrink-0 text-amber-300" size={18} /><p className="text-sm leading-6 text-amber-100/75">Synthetic reference result. Named products remain unranked until reproduced in an authorized tenant.</p></div></div>
          </aside>
        </section>

        <section className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="surface"><div className="section-heading"><div><p className="eyebrow">Evidence control plane</p><h2>From telemetry to a finance-safe decision</h2></div><GitBranch className="text-cyan-300" size={22} /></div><div className="mt-6 grid gap-3 lg:grid-cols-5">{evidencePath.map(([step, title, detail], index) => <div className="path-step" key={step}><div className="flex items-center justify-between"><span className="font-mono text-xs text-cyan-300">{step}</span>{index < evidencePath.length - 1 && <span className="hidden text-slate-700 lg:block">→</span>}</div><p className="mt-5 font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p></div>)}</div></div>
          <div className="surface"><div className="section-heading"><div><p className="eyebrow">Chaos run</p><h2>Failure injection</h2></div><FlaskConical className="text-violet-300" size={22} /></div><div className="mt-5 divide-y divide-white/7">{scenarios.map(([name, result, severity]) => <div className="flex items-center justify-between gap-4 py-3" key={name}><div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-300" size={16} /><span className="text-sm text-slate-300">{name}</span></div><div className="text-right"><p className="font-mono text-xs text-emerald-300">{result}</p><p className="mt-0.5 text-xs text-slate-600">{severity}</p></div></div>)}</div></div>
        </section>

        <section className="surface mt-7" id="method">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <div className="flex flex-col justify-between gap-5 border-b border-white/7 pb-5 lg:flex-row lg:items-center"><div><p className="eyebrow">Decision workspace</p><h2 className="mt-2 text-2xl font-semibold text-white">Results without marketing arithmetic</h2></div><TabsList className="bg-white/[0.04]"><TabsTrigger value="scorecard">Scorecard</TabsTrigger><TabsTrigger value="economics">Unit economics</TabsTrigger><TabsTrigger value="assurance">Assurance</TabsTrigger></TabsList></div>
            <TabsContent value="scorecard" className="mt-6"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="text-xs uppercase tracking-[0.12em] text-slate-600"><tr><th className="pb-4">Runner</th><th className="pb-4">Evidence</th><th className="pb-4">Mapping</th><th className="pb-4">Resilience</th><th className="pb-4">Safety</th><th className="pb-4">Evidence level</th></tr></thead><tbody className="divide-y divide-white/7 text-sm"><tr><td className="py-4 font-medium text-white">GRCBench reference</td><td>98.0</td><td>96.4</td><td>97.2</td><td>100</td><td><Badge className="bg-emerald-300/10 text-emerald-300">VERIFIED</Badge></td></tr><tr className="text-slate-500"><td className="py-4">Proprietary SaaS profile</td><td>—</td><td>—</td><td>—</td><td>—</td><td><Badge variant="outline">DOCUMENTED</Badge></td></tr><tr className="text-slate-500"><td className="py-4">Open-source profile</td><td>—</td><td>—</td><td>—</td><td>—</td><td><Badge variant="outline">AWAITING RUN</Badge></td></tr></tbody></table></div></TabsContent>
            <TabsContent value="economics" className="mt-6"><div className="grid gap-4 md:grid-cols-3"><div className="data-card"><span>Cost / qualified evidence</span><strong>$3.84</strong><small>Collector + model + review + rework</small></div><div className="data-card"><span>Net verified value</span><strong>$184K</strong><small>Savings and approved margin only</small></div><div className="data-card"><span>Break-even volume</span><strong>1,742</strong><small>Accepted evidence transactions</small></div></div><div className="mt-5 rounded-lg border border-white/8 bg-black/20 p-5 font-mono text-sm leading-7 text-slate-400">Net value = avoided labor + avoided rework + expected-loss reduction + Finance-approved attributable margin − total operating cost</div></TabsContent>
            <TabsContent value="assurance" className="mt-6"><div className="grid gap-4 md:grid-cols-3">{[[ShieldCheck, 'No unsupported ranking', 'Only reproduced runs receive numeric scores.'], [FileCheck2, 'Signed evidence receipt', 'Inputs, assertions and evaluator versions are hashed.'], [DatabaseZap, 'Portable artifacts', 'JSON, OSCAL-aligned records and Markdown board packs.']].map(([Icon, title, copy]) => { const AssuranceIcon = Icon as typeof ShieldCheck; return <div className="data-card" key={title as string}><AssuranceIcon className="text-cyan-300" size={21} /><strong className="!text-lg">{title as string}</strong><small>{copy as string}</small></div>; })}</div></TabsContent>
          </Tabs>
        </section>

        <footer className="flex flex-col justify-between gap-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center"><p>GRCBench · independent, reproducible and vendor-neutral</p><div className="flex items-center gap-4"><span className="flex items-center gap-2"><Activity size={14} /> Raw results preserved</span><span className="flex items-center gap-2"><FileCheck2 size={14} /> Apache-2.0</span></div></footer>
      </div>
    </main>
  );
}
