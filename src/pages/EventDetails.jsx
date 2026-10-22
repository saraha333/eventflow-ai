import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useStore } from "../store.jsx";
import { Link, go } from "../router.jsx";
import { Field, PageHead, Progress, Stat } from "../components/ui.jsx";
import { addDays, isOverdue, readiness, resProgress, taskProgress } from "../lib/calc.js";
import { EVENT_TYPES } from "../lib/plan.js";

export default function EventDetails({ id }) {
  const s = useStore();
  const e = s.events.find((x) => x.id === id);
  const [title, setTitle] = useState("");
  const [res, setRes] = useState("");
  if (!e) return <><PageHead title="Event not found" /><Link to="/">Back to dashboard</Link></>;
  const num = (v) => Math.max(0, Number(v) || 0);
  const patchIn = (key, k) => (ev) => s.patchEvent(e.id, { [key]: { ...e[key], [k]: num(ev.target.value) } });

  return (
    <>
      <PageHead title={e.name} sub={`${e.type} · ${e.date} · ${e.venue || "Venue TBC"}`}>
        <Link to="/reports" className="btn">Report</Link>
        <button className="btn" onClick={() => window.confirm("Replace all tasks and resources with a new generated plan?") && s.regenerate(e.id)}>Regenerate plan</button>
        <button className="btn danger" onClick={() => { if (window.confirm("Delete this event?")) { s.deleteEvent(e.id); go("/"); } }}><Trash2 size={16} /> Delete</button>
      </PageHead>
      <div className="grid4">
        <Stat label="Overall readiness" value={readiness(e) + "%"} />
        <Stat label="Tasks done" value={`${e.tasks.filter((t) => t.status === "done").length}/${e.tasks.length}`} hint={taskProgress(e) + "%"} />
        <Stat label="Resources ready" value={`${e.resources.filter((r) => r.have).length}/${e.resources.length}`} hint={resProgress(e) + "%"} />
        <Stat label="Overdue" value={e.tasks.filter(isOverdue).length} />
      </div>
      <Progress value={readiness(e)} />

      <section className="card"><h2>Details and targets</h2>
        <div className="grid3">
          <Field label="Name"><input value={e.name} onChange={(x) => s.patchEvent(e.id, { name: x.target.value })} /></Field>
          <Field label="Type"><select value={e.type} onChange={(x) => s.patchEvent(e.id, { type: x.target.value })}>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Date"><input type="date" value={e.date} onChange={(x) => s.patchEvent(e.id, { date: x.target.value })} /></Field>
          <Field label="Venue"><input value={e.venue} onChange={(x) => s.patchEvent(e.id, { venue: x.target.value })} /></Field>
          <Field label="Target attendance"><input type="number" min="0" value={e.targets.attendance} onChange={patchIn("targets", "attendance")} /></Field>
          <Field label="Budget ($)"><input type="number" min="0" value={e.targets.budget} onChange={patchIn("targets", "budget")} /></Field>
          <Field label="Target beneficiaries"><input type="number" min="0" value={e.targets.beneficiaries} onChange={patchIn("targets", "beneficiaries")} /></Field>
        </div>
      </section>

      <section className="card"><h2>Preparation tasks</h2>
        <div className="tablewrap"><table>
          <thead><tr><th>Task</th><th>Category</th><th>Due</th><th>Status</th><th></th></tr></thead>
          <tbody>{e.tasks.map((t) => (
            <tr key={t.id} className={t.status === "done" ? "done" : ""}>
              <td>{t.title}{isOverdue(t) && <span className="tag bad">Overdue</span>}</td><td>{t.category}</td>
              <td><input type="date" value={t.due} onChange={(x) => s.patchTask(e.id, t.id, { due: x.target.value })} /></td>
              <td><select value={t.status} onChange={(x) => s.patchTask(e.id, t.id, { status: x.target.value })}>
                <option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option></select></td>
              <td><button className="icon" aria-label="Remove task" onClick={() => s.removeTask(e.id, t.id)}><Trash2 size={16} /></button></td>
            </tr>))}</tbody>
        </table></div>
        <form className="inline" onSubmit={(x) => { x.preventDefault(); if (title.trim()) { s.addTask(e.id, title.trim(), addDays(e.date, -7)); setTitle(""); } }}>
          <input placeholder="Add a custom task (due 7 days before the event)" value={title} onChange={(x) => setTitle(x.target.value)} />
          <button className="btn" type="submit">Add task</button>
        </form>
      </section>

      <section className="card"><h2>Resource checklist</h2>
        <ul className="checks">{e.resources.map((r) => (
          <li key={r.id}><label className="check"><input type="checkbox" checked={r.have} onChange={() => s.toggleRes(e.id, r.id)} /> {r.label}</label></li>))}</ul>
        <form className="inline" onSubmit={(x) => { x.preventDefault(); if (res.trim()) { s.addRes(e.id, res.trim()); setRes(""); } }}>
          <input placeholder="Add a resource" value={res} onChange={(x) => setRes(x.target.value)} />
          <button className="btn" type="submit">Add resource</button>
        </form>
      </section>

      <section className="card"><h2>Actual results</h2><p className="muted">Enter results after the event. They feed the Analytics and Reports pages.</p>
        <div className="grid3">
          <Field label="Actual attendance"><input type="number" min="0" value={e.actual.attendance} onChange={patchIn("actual", "attendance")} /></Field>
          <Field label="Actual spending ($)"><input type="number" min="0" value={e.actual.spend} onChange={patchIn("actual", "spend")} /></Field>
          <Field label="Actual beneficiaries"><input type="number" min="0" value={e.actual.beneficiaries} onChange={patchIn("actual", "beneficiaries")} /></Field>
        </div>
      </section>
    </>
  );
}
