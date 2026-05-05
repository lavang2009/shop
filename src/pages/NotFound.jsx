import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section-shell py-20 text-center">
      <div className="soft-panel mx-auto max-w-2xl p-10">
        <p className="section-eyebrow">404</p>
        <h1 className="page-title mt-3">Trang không tồn tại</h1>
        <p className="page-subtitle mx-auto">
          Đường dẫn bạn mở không có trong dự án. Quay về trang chủ để tiếp tục khám phá.
        </p>
        <Link to="/" className="btn-primary mt-8">Về trang chủ</Link>
      </div>
    </section>
  );
}
