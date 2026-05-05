import { Link } from "react-router-dom";

export default function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="glass-card rounded-[2rem] p-10 text-center">
      <div className="mx-auto max-w-xl">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        {actionLabel && actionTo ? (
          <Link to={actionTo} className="btn-primary mt-6">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
