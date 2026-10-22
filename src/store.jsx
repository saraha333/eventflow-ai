import { createContext, useContext, useEffect, useState } from "react";
import { makeSeed } from "./data/seed.js";
import { generatePlan, uid } from "./lib/plan.js";
import { buildAlerts } from "./lib/checks.js";

const KEY = "eventflow-ai-v1";
const Ctx = createContext(null);
const load = () => {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && Array.isArray(s.events)) return s; } catch { /* ignore */ }
  return makeSeed();
};

export function StoreProvider({ children }) {
  const [s, setS] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }, [s]);
  const edit = (id, fn) => setS((p) => ({ ...p, events: p.events.map((e) => (e.id === id ? fn(e) : e)) }));
  const mapTasks = (id, fn) => edit(id, (e) => ({ ...e, tasks: fn(e.tasks) }));
  const mapRes = (id, fn) => edit(id, (e) => ({ ...e, resources: fn(e.resources) }));

  const api = {
    ...s,
    addEvent: (e) => setS((p) => ({ ...p, events: [e, ...p.events] })),
    patchEvent: (id, patch) => edit(id, (e) => ({ ...e, ...patch })),
    deleteEvent: (id) => setS((p) => ({ ...p, events: p.events.filter((e) => e.id !== id) })),
    regenerate: (id) => edit(id, (e) => ({ ...e, ...generatePlan(e.type, e.date) })),
    patchTask: (id, tid, patch) => mapTasks(id, (ts) => ts.map((t) => (t.id === tid ? { ...t, ...patch } : t))),
    addTask: (id, title, due) => mapTasks(id, (ts) => [...ts, { id: uid(), title, category: "Custom", due, status: "todo" }]),
    removeTask: (id, tid) => mapTasks(id, (ts) => ts.filter((t) => t.id !== tid)),
    toggleRes: (id, rid) => mapRes(id, (rs) => rs.map((r) => (r.id === rid ? { ...r, have: !r.have } : r))),
    addRes: (id, label) => mapRes(id, (rs) => [...rs, { id: uid(), label, have: false }]),
    setSettings: (patch) => setS((p) => ({ ...p, settings: { ...p.settings, ...patch } })),
    runChecks: () => setS((p) => {
      const found = buildAlerts(p.events, p.settings);
      const time = new Date().toLocaleString("en-GB");
      const list = found.length ? found : [{ kind: "Info", text: "No reminders or alerts are due." }];
      const entries = list.map((x) => ({ id: uid(), time, kind: x.kind, text: x.text }));
      return { ...p, log: [...entries, ...p.log].slice(0, 50) };
    }),
    clearLog: () => setS((p) => ({ ...p, log: [] })),
    resetDemo: () => setS(makeSeed()),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
