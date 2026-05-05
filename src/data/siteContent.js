import { Baby, Droplets, ShieldCheck, Sparkles, SmilePlus, SunMedium, Waves, Wind } from "lucide-react";

export const categoryCards = [
  {
    title: "Da dầu / dễ bí",
    slug: "da-dau",
    icon: Droplets,
    description: "Giải pháp làm sạch sâu, phù hợp thói quen sử dụng hằng ngày.",
  },
  {
    title: "Da nhạy cảm",
    slug: "nhay-cam",
    icon: ShieldCheck,
    description: "Gợi ý sản phẩm dịu nhẹ, tối ưu cho làn da cần chăm sóc cẩn thận.",
  },
  {
    title: "Da khô / cần ẩm",
    slug: "cap-am",
    icon: Waves,
    description: "Nhóm sản phẩm làm sạch nhưng vẫn giữ cảm giác mềm mịn sau khi rửa.",
  },
  {
    title: "Da xỉn màu",
    slug: "lam-sang",
    icon: SunMedium,
    description: "Các lựa chọn hỗ trợ làn da trông tươi tắn và sáng hơn sau khi làm sạch.",
  },
  {
    title: "Da mụn / cần thoáng",
    slug: "thoang-da",
    icon: Wind,
    description: "Tập trung vào cảm giác sạch thoáng, phù hợp routine chăm sóc cơ bản.",
  },
  {
    title: "Routine nhẹ nhàng",
    slug: "routine-nhe",
    icon: SmilePlus,
    description: "Gợi ý cho người mới xây dựng thói quen chăm sóc da đơn giản và dễ theo dõi.",
  },
];

export const faqs = [
  {
    question: "Website này có bán sẵn sản phẩm mẫu không?",
    answer: "Không. Bản sạch không seed sản phẩm giả. Sản phẩm sẽ do seller/admin thêm trong trang quản trị.",
  },
  {
    question: "Ai được thêm, sửa, xóa sản phẩm?",
    answer: "Chỉ tài khoản có role seller hoặc admin mới thao tác quản trị sản phẩm.",
  },
  {
    question: "Có trang cá nhân không?",
    answer: "Có. Trang cá nhân hiển thị hồ sơ người dùng, vai trò tài khoản và các liên kết nhanh.",
  },
  {
    question: "Có thể triển khai lên Vercel không?",
    answer: "Có. Project đã có cấu hình Vite và rewrite SPA để deploy lên Vercel dễ dàng.",
  },
  {
    question: "Có giỏ hàng và đơn hàng không?",
    answer: "Có. Giỏ hàng lưu localStorage, đơn hàng được ghi vào Firestore khi thanh toán.",
  },
];

export const policies = [
  {
    title: "Chính sách bảo mật",
    items: [
      "Dữ liệu tài khoản được lưu trong Firebase Authentication và Firestore.",
      "Mật khẩu không bao giờ lưu dạng plain text trong ứng dụng.",
      "Ảnh sản phẩm được lưu trên Firebase Storage.",
    ],
  },
  {
    title: "Điều khoản sử dụng",
    items: [
      "Chỉ seller/admin mới có quyền quản lý sản phẩm.",
      "Người dùng cần đăng nhập để đặt hàng và xem lịch sử đơn hàng.",
      "Các thay đổi vai trò nên được kiểm soát bằng Firestore Rules.",
    ],
  },
  {
    title: "Giao hàng & hỗ trợ",
    items: [
      "Bạn có thể cấu hình phí ship, COD hoặc thanh toán online sau này.",
      "Trang liên hệ hỗ trợ hiển thị hotline, email và form phản hồi.",
      "Bản này dễ mở rộng thêm voucher, review, và thông báo.",
    ],
  },
];
