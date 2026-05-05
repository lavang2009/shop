export default function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 className="page-title mt-2">{title}</h2>
        {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="w-fit">{action}</div> : null}
    </div>
  );
}
