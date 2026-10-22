import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { useStore } from "../store.jsx";
import { Link } from "../router.jsx";
import { PageHead, Progress, Stat } from "../components/ui.jsx";
import { daysFrom, isOverdue, readiness, resProgress, taskProgress } from "../lib/calc.js";
import { buildAlerts } from "../lib/checks.js";

const COLORS = { todo: "#94a3b8", doing: "#f59e0b", done: "#16a34a" };
const LABELS = { todo: "To do", doing: "In progress", done: "Done" };

export default function Dashboard() {
  const { events, settings } = useStore();
  const upcoming = events.filter((e) => daysFrom(e.date) >= 0);
  const avg = upcoming.length ? Math.round(upcoming.reduce((s, e) => s + readiness(e), 0) / upcoming.length) : 0;
  const all = events.flatMap((e) => e.tasks.map((t) => ({ ...t, ev: e })));
  const open = all.filter((t) => t.status !== "done" && daysFrom(t.ev.date) >= 0);
  const deadlines = [...open].sort((a, b) => a.due.localeCompare(b.due)).slice(0, 7);
  const ready = events.map((e) => ({ name: e.name.length > 16 ? e.name.slice(0, 15) + "…" : e.name, Tasks: taskProgress(e), Resources: resProgress(e) }));
  const pie = ["todo", "doing", "done"].map((k) => ({ key: k, name: LABELS[k], value: all.filter((t) => t.status === k).length }));
  const alerts = buildAlerts(events, settings);

  return (
    <>
      <PageHead title="Dashboard" sub="Overview of your events, readiness and deadlines.">
        <Link to="/new" className="btn primary">+ New event</Link>
      </PageHead>
      <div className="grid4">
        <Stat label="Events" value={events.length} hint={`${upcoming.length} upcoming`} />
        <Stat label="Average readiness" value={avg + "%"} hint="Upcoming events" />
        <Stat label="Open tasks" value={open.length} hint="Upcoming events" />
        <Stat label="Overdue tasks" value={open.filter(isOverdue).length} hint="Needs attention" />
      </div>
      <div className="grid2">
        <section className="card"><h2>Readiness by event (%)</h2>
          <div className="chart"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={ready}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={11} /><YAxis domain={[0, 100]} fontSize={11} /><Tooltip /><Legend />
              <Bar dataKey="Tasks" fill="#2f5bea" /><Bar dataKey="Resources" fill="#0ea5a4" /></BarChart>
          </ResponsiveContainer></div>
        </section>
        <section className="card"><h2>Task status (all events)</h2>
          <div className="chart"><ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={pie} dataKey="value" nameKey="name" outerRadius={85} label>{pie.map((p) => <Cell key={p.key} fill={COLORS[p.key]} />)}</Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer></div>
        </section>
      </div>
      <div className="grid2">
        <section className="card"><h2><CalendarClock size={18} /> Upcoming deadlines</h2>
          {deadlines.length === 0 && <p className="muted">No open deadlines.</p>}
          <ul className="list">{deadlines.map((t) => (
            <li key={t.id}><Link to={"/event/" + t.ev.id}>{t.title}</Link><small className="muted">{t.ev.name}</small>
              <span className={isOverdue(t) ? "tag bad" : "tag"}>{isOverdue(t) ? "Overdue · " : ""}{t.due}</span></li>
          ))}</ul>
        </section>
        <section className="card"><h2><AlertTriangle size={18} /> Simulated alerts ({alerts.length})</h2>
          {alerts.length === 0 && <p className="muted">Nothing to flag right now.</p>}
          <ul className="list">{alerts.slice(0, 6).map((a, i) => <li key={i}><span className={"tag " + (a.kind === "Alert" ? "bad" : "")}>{a.kind}</span> {a.text}</li>)}</ul>
          <Link to="/automation">Manage automation →</Link>
        </section>
      </div>
      <section className="card"><h2>Events</h2>
        <ul className="list">{events.map((e) => (
          <li key={e.id}><Link to={"/event/" + e.id}><b>{e.name}</b></Link><small className="muted">{e.type} · {e.date}</small>
            <div className="grow"><Progress value={readiness(e)} /></div><span>{readiness(e)}%</span></li>
        ))}</ul>
      </section>
    </>
  );
}
