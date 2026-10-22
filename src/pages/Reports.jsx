import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { useStore } from "../store.jsx";
import { Field, PageHead } from "../components/ui.jsx";
import { money, readiness } from "../lib/calc.js";
import { buildCsv, downloadCsv, kpis, recommendations } from "../lib/report.js";

export default function Reports() {
  const { events } = useStore();
  const [id, setId] = useState(events[0]?.id || "");
  const e = events.find((x) => x.id === id) || events[0];
  if (!e) return <><PageHead title="Reports" /><div className="card">Create an event first.</div></>;
  const k = kpis(e);
  const rows = [["Attendance", e.targets.attendance, e.actual.attendance, k.attendance], ["Spending", money(e.targets.budget), money(e.actual.spend), k.spend], ["Beneficiaries", e.targets.beneficiaries, e.actual.beneficiaries, k.beneficiaries]];
  return (
    <>
      <PageHead title="Reports" sub="Generate a print-friendly report or export CSV.">
        <button className="btn primary" onClick={() => window.print()}><Printer size={16} /> Print / Save as PDF</button>
        <button className="btn" onClick={() => downloadCsv(e.name, buildCsv(e))}><Download size={16} /> Download CSV</button>
      </PageHead>
      <div className="card no-print"><Field label="Event"><select value={e.id} onChange={(x) => setId(x.target.value)}>{events.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></Field></div>
      <article className="card report">
        <h1>Event report: {e.name}</h1>
        <p className="muted">{e.type} · {e.date} · {e.venue || "Venue TBC"} · Generated {new Date().toLocaleDateString("en-GB")} · Sample data</p>
        <h3>Targets vs actual</h3>
        <table><thead><tr><th>Measure</th><th>Target</th><th>Actual</th><th>Achievement</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}%</td></tr>)}</tbody></table>
        <h3>Key indicators</h3>
        <div className="grid4">
          <div className="kpi"><b>{readiness(e)}%</b><span>Readiness</span></div>
          <div className="kpi"><b>{money(k.costPer)}</b><span>Cost per attendee</span></div>
          <div className="kpi"><b>{k.overdue}</b><span>Overdue tasks</span></div>
          <div className="kpi"><b>{e.tasks.filter((t) => t.status === "done").length}/{e.tasks.length}</b><span>Tasks done</span></div>
        </div>
        <h3>Preparation tasks</h3>
        <table><thead><tr><th>Task</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>{e.tasks.map((t) => <tr key={t.id}><td>{t.title}</td><td>{t.due}</td><td>{t.status === "done" ? "Done" : t.status === "doing" ? "In progress" : "To do"}</td></tr>)}</tbody></table>
        <h3>Recommendations</h3>
        <ol>{recommendations(e).map((r, i) => <li key={i}>{r}</li>)}</ol>
      </article>
    </>
  );
}
