export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}
