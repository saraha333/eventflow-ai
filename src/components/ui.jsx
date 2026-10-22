export const Stat = ({ label, value, hint }) => (
  <div className="card stat"><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div>
);
export const Progress = ({ value }) => (
  <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"><i style={{ width: value + "%" }} /></div>
);
export const Field = ({ label, children }) => (
  <label className="field"><span>{label}</span>{children}</label>
);
export const PageHead = ({ title, sub, children }) => (
  <div className="head no-print-actions">
    <div><h1>{title}</h1>{sub && <p className="muted">{sub}</p>}</div>
    <div className="row">{children}</div>
  </div>
);
