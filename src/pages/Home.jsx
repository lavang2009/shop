import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, Sparkles } from "lucide-react";
import SectionHero from "../components/SectionHero";
import ProductGrid from "../components/ProductGrid";
import LoadingScreen from "../components/LoadingScreen";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import EmptyState from "../components/EmptyState";
import { useProducts } from "../context/ProductContext";
import { categoryCards, faqs } from "../data/siteContent";

export default function Home() {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 6);

  return (
    <div>
      <SectionHero />

      <section className="section-shell py-16">
        <SectionHeader
          eyebrow="Tổng quan"
          title="Sân chơi bán hàng gọn gàng, đẹp và dễ mở rộng"
          subtitle="Bản này giữ phong cách bắt mắt của phiên bản đầu, đồng thời thêm nhiều trang hữu ích hơn cho shop thực tế."
          action={<Link to="/about" className="btn-secondary">Tìm hiểu thêm <ArrowRight className="h-4 w-4" /></Link>}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Tính năng" value="Frontend + Backend" hint="React + Firebase" />
          <StatCard label="Bảo mật" value="Role-based" hint="seller / admin" />
          <StatCard label="Hiển thị" value="Responsive" hint="Mobile / Desktop" />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Hiệu ứng mượt",
              desc: "Dùng framer-motion cho hover, transition và loading state.",
            },
            {
              icon: BadgeCheck,
              title: "Trang cá nhân",
              desc: "Người dùng có profile riêng, hiển thị vai trò và thông tin tài khoản.",
            },
            {
              icon: Flame,
              title: "Mở rộng nhanh",
              desc: "Có sẵn cart, checkout, orders, FAQ, policies và contact.",
            },
          ].map((item) => (
            <motion.div key={item.title} className="glass-card rounded-3xl p-6" whileHover={{ y: -4 }}>
              <item.icon className="h-6 w-6 text-sky-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-2">
        <SectionHeader
          eyebrow="Bộ sưu tập"
          title="Gợi ý theo nhu cầu da"
          subtitle="Không seed sản phẩm giả. Phần này giúp khách định hướng nhanh trước khi seller thêm hàng thật."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryCards.map((card) => (
            <Link key={card.slug} to="/categories" className="glass-card rounded-[2rem] p-6 transition hover:-translate-y-1">
              <card.icon className="h-7 w-7 text-sky-600" />
              <h3 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell py-16">
        <SectionHeader
          eyebrow="Sản phẩm mới"
          title="Khu vực trưng bày sản phẩm thật"
          subtitle="Nếu Firestore đang trống, hệ thống sẽ hiện trạng thái trống thay vì dùng dữ liệu giả."
          action={<Link to="/products" className="btn-secondary">Xem toàn bộ <ArrowRight className="h-4 w-4" /></Link>}
        />
        <div className="mt-8">
          {loading ? (
            <LoadingScreen label="Đang tải sản phẩm..." />
          ) : featured.length ? (
            <ProductGrid products={featured} />
          ) : (
            <EmptyState
              title="Chưa có sản phẩm nào"
              description="Seller/admin có thể vào trang quản trị để thêm sản phẩm thật, upload ảnh và công bố lên shop."
              actionLabel="Đi tới quản trị"
              actionTo="/admin"
            />
          )}
        </div>
      </section>

      <section className="section-shell pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="soft-panel p-6 md:p-8">
            <SectionHeader
              eyebrow="Lộ trình"
              title="Luồng sử dụng rõ ràng"
              subtitle="Từ đăng ký, đăng nhập, xem sản phẩm đến giỏ hàng và đơn hàng đều có sẵn trong project."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Đăng ký tài khoản mới",
                "Đăng nhập và xem hồ sơ",
                "Seller/admin quản lý sản phẩm",
                "Khách tạo đơn qua giỏ hàng",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="soft-panel p-6 md:p-8">
            <SectionHeader
              eyebrow="FAQ nhanh"
              title="Những điểm người dùng hay hỏi"
              subtitle="Phần trả lời ngắn giúp web trông trọn vẹn hơn và giảm băn khoăn khi sử dụng."
            />
            <div className="mt-6 space-y-4">
              {faqs.slice(0, 3).map((item) => (
                <div key={item.question} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <p className="font-semibold text-slate-900">{item.question}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
