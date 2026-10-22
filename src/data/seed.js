import { addDays, today } from "../lib/calc.js";
import { generatePlan, uid } from "../lib/plan.js";

function make(o, done, actual) {
  const p = generatePlan(o.type, o.date);
  const n = Math.round(p.tasks.length * done);
  p.tasks.forEach((t, i) => { t.status = i < n ? "done" : i === n ? "doing" : "todo"; });
  const rn = Math.round(p.resources.length * done);
  p.resources.forEach((r, i) => { r.have = i < rn; });
  return { id: uid(), ...o, ...p, actual: actual || { attendance: 0, spend: 0, beneficiaries: 0 } };
}

// All figures are illustrative demo data.
export function makeSeed() {
  const t = today();
  return {
    settings: { remind: true, remindDays: 3, alertIncomplete: true, alertDays: 10 },
    log: [],
    events: [
      make({ name: "Riverside Charity 5K Run", type: "Charity Run", date: addDays(t, 12), venue: "Riverside Park", description: "Annual 5K raising funds for the local youth centre.", targets: { attendance: 250, budget: 3000, beneficiaries: 120 } }, 0.55),
      make({ name: "Community Food Bank Gala", type: "Fundraiser", date: addDays(t, 35), venue: "Town Hall", description: "Charity dinner and silent auction.", targets: { attendance: 150, budget: 6000, beneficiaries: 400 } }, 0.2),
      make({ name: "Freshers’ Tech Skills Workshop", type: "Workshop", date: addDays(t, -20), venue: "Engineering Building, Room 2.14", description: "Intro workshop run by the Computing Society.", targets: { attendance: 80, budget: 600, beneficiaries: 80 } }, 1, { attendance: 92, spend: 540, beneficiaries: 71 }),
      make({ name: "Spring Charity Quiz Night", type: "Social", date: addDays(t, -60), venue: "Students’ Union Bar", description: "Quiz night raising money for a local shelter.", targets: { attendance: 100, budget: 800, beneficiaries: 60 } }, 1, { attendance: 84, spend: 910, beneficiaries: 55 }),
    ],
  };
}
