import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useStore } from "../store.jsx";
import { Link } from "../router.jsx";
import { PageHead } from "../components/ui.jsx";
import { hasActuals, money } from "../lib/calc.js";
import { kpis } from "../lib/report.js";

function Chart({ title, data }) {
  return (
    <section className="card"><h2>{title}</h2>
      <div className="chart"><ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
          <Bar dataKey="Target" fill="#94a3b8" /><Bar dataKey="Actual" fill="#2f5bea" /></BarChart>
      </ResponsiveContainer></div>
    </section>
  );
}

export default function Analytics() {
  const { events } = useStore();
  const done = events.filter(hasActuals);
  const short = (n) => (n.length > 16 ? n.slice(0, 15) + "…" : n);
  const d = (t, a) => done.map((e) => ({ name: short(e.name), Target: t(e), Actual: a(e) }));
  return (
    <>
      <PageHead title="Analytics" sub="Targets compared with actual results for completed events." />
      {done.length === 0 ? <div className="card"><p>No actual results yet. Enter results on an event page.</p></div> : (
        <>
          <div className="grid3">
            <Chart title="Attendance" data={d((e) => e.targets.attendance, (e) => e.actual.attendance)} />
            <Chart title="Spending ($)" data={d((e) => e.targets.budget, (e) => e.actual.spend)} />
            <Chart title="Beneficiaries" data={d((e) => e.targets.beneficiaries, (e) => e.actual.beneficiaries)} />
          </div>
          <section className="card"><h2>Achievement summary</h2>
            <div className="tablewrap"><table>
              <thead><tr><th>Event</th><th>Attendance</th><th>Spend vs budget</th><th>Beneficiaries</th><th>Cost per attendee</th></tr></thead>
              <tbody>{done.map((e) => { const k = kpis(e); return (
                <tr key={e.id}><td><Link to={"/event/" + e.id}>{e.name}</Link></td><td>{k.attendance}%</td>
                  <td className={k.spend > 100 ? "bad-text" : ""}>{k.spend}%</td><td>{k.beneficiaries}%</td><td>{money(k.costPer)}</td></tr>); })}</tbody>
            </table></div>
          </section>
        </>
      )}
    </>
  );
}
