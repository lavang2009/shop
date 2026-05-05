export default function PolicyCard({ title, items }) {
  return (
    <article className="glass-card rounded-[2rem] p-6">
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-sky-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
