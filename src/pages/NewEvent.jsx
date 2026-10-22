import { useState } from "react";
import { useStore } from "../store.jsx";
import { go } from "../router.jsx";
import { Field, PageHead } from "../components/ui.jsx";
import { addDays, today } from "../lib/calc.js";
import { EVENT_TYPES, generatePlan, uid } from "../lib/plan.js";

export default function NewEvent() {
  const { addEvent } = useStore();
  const [f, setF] = useState({ name: "", type: EVENT_TYPES[0], date: addDays(today(), 30), venue: "", description: "", attendance: 100, budget: 1000, beneficiaries: 50, auto: true });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) || 0 : e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.date) return setErr("Please enter an event name and date.");
    const plan = f.auto ? generatePlan(f.type, f.date) : { tasks: [], resources: [] };
    const ev = { id: uid(), name: f.name.trim(), type: f.type, date: f.date, venue: f.venue, description: f.description,
      targets: { attendance: f.attendance, budget: f.budget, beneficiaries: f.beneficiaries },
      actual: { attendance: 0, spend: 0, beneficiaries: 0 }, ...plan };
    addEvent(ev);
    go("/event/" + ev.id);
  };

  return (
    <>
      <PageHead title="Create event" sub="Enter the details and let the plan generator suggest tasks, deadlines and resources." />
      <form className="card form" onSubmit={submit}>
        <div className="grid2">
          <Field label="Event name"><input value={f.name} onChange={set("name")} placeholder="e.g. Autumn Charity Bake Sale" /></Field>
          <Field label="Event type"><select value={f.type} onChange={set("type")}>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Date"><input type="date" value={f.date} onChange={set("date")} /></Field>
          <Field label="Venue"><input value={f.venue} onChange={set("venue")} /></Field>
        </div>
        <Field label="Description"><textarea rows="2" value={f.description} onChange={set("description")} /></Field>
        <h3>Targets</h3>
        <div className="grid3">
          <Field label="Target attendance"><input type="number" min="0" value={f.attendance} onChange={set("attendance")} /></Field>
          <Field label="Budget ($)"><input type="number" min="0" value={f.budget} onChange={set("budget")} /></Field>
          <Field label="Target beneficiaries"><input type="number" min="0" value={f.beneficiaries} onChange={set("beneficiaries")} /></Field>
        </div>
        <label className="check"><input type="checkbox" checked={f.auto} onChange={set("auto")} /> Generate a preparation plan for this event type</label>
        {err && <p className="bad-text">{err}</p>}
        <button className="btn primary" type="submit">Create event</button>
      </form>
    </>
  );
}
