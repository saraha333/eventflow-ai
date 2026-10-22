import { useStore } from "../store.jsx";
import { Field, PageHead } from "../components/ui.jsx";
import { buildAlerts } from "../lib/checks.js";

export default function Automation() {
  const { settings: s, setSettings, events, log, runChecks, clearLog } = useStore();
  const queue = buildAlerts(events, s);
  const num = (k) => (e) => setSettings({ [k]: Math.max(0, Number(e.target.value) || 0) });
  return (
    <>
      <PageHead title="Workflow automation" sub="Configure simulated reminders and alerts. Nothing is sent outside this browser." />
      <section className="card"><h2>Rules</h2>
        <label className="check"><input type="checkbox" checked={s.remind} onChange={(e) => setSettings({ remind: e.target.checked })} /> Deadline reminders for open tasks</label>
        <Field label="Remind when a task is due within (days)"><input type="number" min="0" value={s.remindDays} onChange={num("remindDays")} /></Field>
        <label className="check"><input type="checkbox" checked={s.alertIncomplete} onChange={(e) => setSettings({ alertIncomplete: e.target.checked })} /> Incomplete requirement alerts (open tasks or missing resources)</label>
        <Field label="Alert when the event is within (days)"><input type="number" min="0" value={s.alertDays} onChange={num("alertDays")} /></Field>
      </section>
      <section className="card"><h2>Current queue ({queue.length})</h2>
        {queue.length === 0 ? <p className="muted">Nothing would be triggered with the current settings.</p> :
          <ul className="list">{queue.map((a, i) => <li key={i}><span className={"tag " + (a.kind === "Alert" ? "bad" : "")}>{a.kind}</span> {a.text}</li>)}</ul>}
        <button className="btn primary" onClick={runChecks}>Run simulated check</button>
      </section>
      <section className="card"><h2>Simulation log</h2>
        {log.length === 0 ? <p className="muted">No simulated notifications yet. Click “Run simulated check”.</p> :
          <ul className="list">{log.map((l) => <li key={l.id}><small className="muted">{l.time}</small><span className="tag">{l.kind}</span> {l.text} <em className="muted">(simulated)</em></li>)}</ul>}
        {log.length > 0 && <button className="btn" onClick={clearLog}>Clear log</button>}
      </section>
    </>
  );
}
