import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Sparkles, Leaf, Droplet, HeartHandshake } from "lucide-react";
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
          eyebrow="Đồng hành cùng bạn"
          title="Chăm sóc làn da mỗi ngày"
          subtitle="Khám phá các dòng sữa rửa mặt chính hãng, an toàn và phù hợp với mọi loại da để mang lại vẻ rạng rỡ tự nhiên."
          action={<Link to="/about" className="btn-secondary">Tìm hiểu thêm <ArrowRight className="h-4 w-4" /></Link>}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Cam kết" value="Chính hãng 100%" hint="Nguồn gốc rõ ràng" />
          <StatCard label="Thanh toán" value="Bảo mật an toàn" hint="Đa dạng phương thức" />
          <StatCard label="Vận chuyển" value="Giao hàng tốc hành" hint="Phủ sóng toàn quốc" />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Droplet,
              title: "Làm sạch chuyên sâu",
              desc: "Nhẹ nhàng lấy đi bụi bẩn, bã nhờn và lớp trang điểm mà không làm khô căng da.",
            },
            {
              icon: Leaf,
              title: "Thành phần tự nhiên",
              desc: "Chiết xuất lành tính, an toàn và thân thiện với cả những làn da nhạy cảm nhất.",
            },
            {
              icon: HeartHandshake,
              title: "Chăm sóc tận tâm",
              desc: "Đội ngũ chuyên viên luôn sẵn sàng tư vấn lộ trình chăm sóc da phù hợp cho riêng bạn.",
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
          title="Lựa chọn theo tình trạng da"
          subtitle="Tìm kiếm sản phẩm tối ưu nhất được phân loại dựa trên nhu cầu riêng biệt của làn da bạn."
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
          eyebrow="Thịnh hành"
          title="Sản phẩm nổi bật"
          subtitle="Những dòng sữa rửa mặt đang được yêu thích và bán chạy nhất tại cửa hàng."
          action={<Link to="/products" className="btn-secondary">Xem tất cả <ArrowRight className="h-4 w-4" /></Link>}
        />
        <div className="mt-8">
          {loading ? (
            <LoadingScreen label="Đang tải sản phẩm..." />
          ) : featured.length ? (
            <ProductGrid products={featured} />
          ) : (
            <EmptyState
              title="Sản phẩm đang được cập nhật"
              description="Các mặt hàng mới nhất đang được chúng tôi đưa lên kệ. Vui lòng quay lại sau nhé!"
              actionLabel="Xem danh mục khác"
              actionTo="/categories"
            />
          )}
        </div>
      </section>

      <section className="section-shell pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="soft-panel p-6 md:p-8">
            <SectionHeader
              eyebrow="Trải nghiệm"
              title="Mua sắm dễ dàng"
              subtitle="Quy trình đặt hàng đơn giản, tiện lợi giúp bạn sở hữu sản phẩm nhanh chóng."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "1. Tìm kiếm và chọn sản phẩm",
                "2. Thêm vào giỏ hàng của bạn",
                "3. Điền thông tin giao hàng",
                "4. Nhận hàng và thanh toán",
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-white p-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="soft-panel p-6 md:p-8">
            <SectionHeader
              eyebrow="Hỗ trợ khách hàng"
              title="Câu hỏi thường gặp"
              subtitle="Giải đáp nhanh chóng các thắc mắc phổ biến của khách hàng trong quá trình mua sắm."
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
