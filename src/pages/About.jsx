import SectionHeader from "../components/SectionHeader";
import { categoryCards } from "../data/siteContent";

export default function About() {
  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Giới thiệu"
        title="Về FreshGlow Store"
        subtitle="Một demo shop bán sữa rửa mặt với giao diện sáng, hiện đại và cấu trúc dễ mở rộng cho cửa hàng thật."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="soft-panel p-8">
          <h3 className="text-2xl font-bold text-slate-900">Mục tiêu dự án</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Dự án này mô phỏng một website bán hàng đầy đủ luồng cơ bản: người dùng, quản trị, sản phẩm, ảnh upload, cart và đơn hàng.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Thiết kế tập trung vào sự gọn gàng, màu sáng, card nổi bật và animation vừa đủ để nhìn đẹp mà không rối.
          </p>
        </div>
        <div className="soft-panel p-8">
          <h3 className="text-2xl font-bold text-slate-900">Điểm mạnh</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Responsive toàn bộ trang",
              "Firebase Authentication",
              "Firestore + Storage",
              "Role seller/admin",
              "Trang cá nhân riêng",
              "Trang đơn hàng, cart, checkout",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categoryCards.map((card) => (
          <div key={card.slug} className="glass-card rounded-[2rem] p-6">
            <card.icon className="h-7 w-7 text-sky-600" />
            <h3 className="mt-4 text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
