import SectionHeader from "../components/SectionHeader";
import PolicyCard from "../components/PolicyCard";
import { policies } from "../data/siteContent";

export default function Policies() {
  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Pháp lý"
        title="Chính sách & Điều khoản"
        subtitle="Bản demo có thêm trang chính sách để web nhìn đầy đủ và chuyên nghiệp hơn."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {policies.map((policy) => <PolicyCard key={policy.title} title={policy.title} items={policy.items} />)}
      </div>
    </section>
  );
}
