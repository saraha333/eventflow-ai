export const iso = (d) => new Date(d).toISOString().slice(0, 10);
export const today = () => iso(Date.now());
export const addDays = (d, n) => iso(new Date(d).getTime() + n * 864e5);
export const daysFrom = (d) => Math.round((new Date(d) - new Date(today())) / 864e5);
export const money = (n) => "$" + Math.round(n || 0).toLocaleString("en-US");
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

export const taskProgress = (e) => pct(e.tasks.filter((t) => t.status === "done").length, e.tasks.length);
export const resProgress = (e) => pct(e.resources.filter((r) => r.have).length, e.resources.length);
export const readiness = (e) => Math.round((taskProgress(e) + resProgress(e)) / 2);
export const isOverdue = (t) => t.status !== "done" && t.due < today();
export const openTasks = (e) => e.tasks.filter((t) => t.status !== "done");
export const hasActuals = (e) => e.actual.attendance > 0 || e.actual.spend > 0 || e.actual.beneficiaries > 0;
