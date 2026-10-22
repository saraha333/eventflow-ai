import { daysFrom, openTasks } from "./calc.js";

// Builds the list of SIMULATED reminders/alerts. Nothing is ever sent anywhere.
export function buildAlerts(events, s) {
  const out = [];
  events.forEach((e) => {
    const left = daysFrom(e.date);
    if (left < 0) return;
    if (s.remind) {
      e.tasks.filter((t) => t.status !== "done").forEach((t) => {
        const d = daysFrom(t.due);
        if (d <= s.remindDays)
          out.push({ kind: "Reminder", eventId: e.id, text: `${e.name}: “${t.title}” ${d < 0 ? `is ${-d} day(s) overdue` : d === 0 ? "is due today" : `is due in ${d} day(s)`}` });
      });
    }
    if (s.alertIncomplete && left <= s.alertDays) {
      const missing = e.resources.filter((r) => !r.have).length;
      const open = openTasks(e).length;
      if (missing || open)
        out.push({ kind: "Alert", eventId: e.id, text: `${e.name} starts in ${left} day(s) with ${open} open task(s) and ${missing} missing resource(s)` });
    }
  });
  return out;
}
