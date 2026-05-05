import { ChevronDown } from "lucide-react";

export default function FAQItem({ item, open, onToggle }) {
  return (
    <button className="glass-card w-full rounded-[1.6rem] p-5 text-left transition hover:-translate-y-0.5" onClick={onToggle}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </div>
      {open ? <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p> : null}
    </button>
  );
}
