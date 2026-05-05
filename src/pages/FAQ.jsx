import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import FAQItem from "../components/FAQItem";
import { faqs } from "../data/siteContent";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section-shell py-12">
      <SectionHeader
        eyebrow="Giải đáp"
        title="Câu hỏi thường gặp"
        subtitle="Trang FAQ giúp website đầy đủ hơn và làm người xem yên tâm khi sử dụng."
      />

      <div className="mt-8 space-y-4">
        {faqs.map((item, index) => (
          <FAQItem key={item.question} item={item} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? -1 : index)} />
        ))}
      </div>
    </section>
  );
}
