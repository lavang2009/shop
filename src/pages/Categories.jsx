import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import { categoryCards } from "../data/siteContent";

export default function Categories() {
  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Khám phá"
        title="Bộ sưu tập theo nhu cầu da"
        subtitle="Trang này không dùng sản phẩm giả, chỉ là bản định hướng nhóm nhu cầu để khách chọn nhanh hơn."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categoryCards.map((card) => (
          <Link key={card.slug} to="/products" className="glass-card rounded-[2rem] p-6 transition hover:-translate-y-1">
            <card.icon className="h-7 w-7 text-sky-600" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
