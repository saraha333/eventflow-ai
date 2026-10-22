import { money, pct, readiness, openTasks, isOverdue } from "./calc.js";

export function kpis(e) {
  const a = e.actual, t = e.targets;
  return {
    attendance: pct(a.attendance, t.attendance),
    spend: pct(a.spend, t.budget),
    beneficiaries: pct(a.beneficiaries, t.beneficiaries),
    costPer: a.attendance ? a.spend / a.attendance : 0,
    readiness: readiness(e),
    overdue: e.tasks.filter(isOverdue).length,
  };
}

export function recommendations(e) {
  const k = kpis(e), a = e.actual, t = e.targets, r = [];
  r.push(k.attendance >= 100 ? `Attendance target met (${a.attendance} vs ${t.attendance}). Keep the promotion channels that worked.` : `Attendance reached ${k.attendance}% of target. Start promotion earlier and add a second reminder.`);
  r.push(a.spend <= t.budget ? `Spending stayed within budget (${money(a.spend)} of ${money(t.budget)}).` : `Spending exceeded budget by ${money(a.spend - t.budget)}. Set per-category limits before ordering.`);
  r.push(k.beneficiaries >= 100 ? `Beneficiary goal met (${a.beneficiaries}). Record outcome stories for funders.` : `Beneficiary reach was ${k.beneficiaries}% of target. Work with partners to reach more people.`);
  if (openTasks(e).length) r.push(`${openTasks(e).length} task(s) were still open. Assign owners earlier next time.`);
  if (k.costPer) r.push(`Cost per attendee was ${money(k.costPer)}; use it as the benchmark for the next event.`);
  return r;
}

const q = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';

export function buildCsv(e) {
  const k = kpis(e);
  const rows = [
    ["EventFlow AI report (sample data)"], ["Event", e.name], ["Type", e.type], ["Date", e.date], ["Venue", e.venue], [],
    ["Measure", "Target", "Actual", "Achievement %"],
    ["Attendance", e.targets.attendance, e.actual.attendance, k.attendance],
    ["Spending ($)", e.targets.budget, e.actual.spend, k.spend],
    ["Beneficiaries", e.targets.beneficiaries, e.actual.beneficiaries, k.beneficiaries], [],
    ["Task", "Category", "Due", "Status"], ...e.tasks.map((t) => [t.title, t.category, t.due, t.status]), [],
    ["Resource", "Ready"], ...e.resources.map((r) => [r.label, r.have ? "Yes" : "No"]), [],
    ["Recommendations"], ...recommendations(e).map((x) => [x]),
  ];
  return rows.map((r) => r.map(q).join(",")).join("\n");
}

export function downloadCsv(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-report.csv";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
