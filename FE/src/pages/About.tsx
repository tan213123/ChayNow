import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-16">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Về chúng tôi</p>
            <h1 className="text-4xl font-extrabold text-slate-900">Giao diện đánh giá nhà hàng chuẩn, thân thiện cho khách hàng</h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Ứng dụng của bạn giờ đã có một thiết kế dành cho du lịch ẩm thực chay: trang chủ đẹp mắt, thẻ nhà hàng nổi bật và trải nghiệm đọc review rõ ràng.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-3xl font-semibold text-slate-900">120+</p>
                <p className="mt-2 text-sm text-slate-500">Nhà hàng gợi ý</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-3xl font-semibold text-slate-900">4.8</p>
                <p className="mt-2 text-sm text-slate-500">Đánh giá trung bình</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-emerald-500 to-sky-500 p-8 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-white/80">Tính năng nổi bật</p>
            <ul className="mt-8 space-y-5 text-base leading-8">
              <li>• Tìm kiếm nhà hàng theo loại món, địa điểm và điểm review.</li>
              <li>• Xem đánh giá thực tế và bình chọn từ khách hàng.</li>
              <li>• Lưu quán yêu thích và tạo danh sách riêng.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Chuyển đổi giao diện này sang JSX + Tailwind đã hoàn thành. Bạn có thể tùy chỉnh dữ liệu và màu sắc dễ dàng.</p>
          <Link to="/">
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
