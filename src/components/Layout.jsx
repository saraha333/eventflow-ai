import { useState } from "react";
import { BarChart3, FileText, Info, LayoutDashboard, Menu, PlusCircle, Zap } from "lucide-react";
import { Link } from "../router.jsx";
import { useStore } from "../store.jsx";

const NAV = [
  ["/", "Dashboard", LayoutDashboard],
  ["/new", "New event", PlusCircle],
  ["/automation", "Automation", Zap],
  ["/analytics", "Analytics", BarChart3],
  ["/reports", "Reports", FileText],
];

export default function Layout({ path, children }) {
  const [open, setOpen] = useState(false);
  const { resetDemo } = useStore();
  const active = (to) => (to === "/" ? path === "/" || path.startsWith("/event") : path.startsWith(to));
  return (
    <div className="app">
      <aside className={"side no-print" + (open ? " open" : "")}>
        <div className="brand">EventFlow <b>AI</b></div>
        <nav>
          {NAV.map(([to, label, Icon]) => (
            <Link key={to} to={to} className={active(to) ? "on" : ""} onClick={() => setOpen(false)}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <button className="ghost" onClick={() => window.confirm("Restore the original demo data? Your changes will be lost.") && resetDemo()}>
          Reset demo data
        </button>
      </aside>
      <div className="main">
        <button className="menu no-print" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><Menu size={20} /> Menu</button>
        <div className="notice no-print"><Info size={16} /> <span><b>Demo mode:</b> this app uses sample data stored in your browser. Reminders and alerts are simulated; no emails or messages are sent.</span></div>
        <div className="page">{children}</div>
      </div>
    </div>
  );
}
