import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function OwnerReviews() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl">
          <div className="mb-8 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Đánh giá từ khách hàng</p>
            <h1 className="text-4xl font-extrabold text-slate-900">Đánh giá từ khách hàng</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Xem và trả lời các đánh giá về quán của bạn.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Đánh giá TB</p>
              <p className="mt-4 text-4xl font-extrabold text-slate-900">4.5</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Tổng đánh giá</p>
              <p className="mt-4 text-4xl font-extrabold text-slate-900">2</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Đánh giá tích cực</p>
              <p className="mt-4 text-4xl font-extrabold text-slate-900">2</p>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 shadow-sm">
            <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-semibold text-slate-700">Phân bố đánh giá</p>
              <div className="space-y-3 text-sm text-slate-600">
                {[
                  { star: 5, value: 1, width: "80%" },
                  { star: 4, value: 1, width: "60%" },
                  { star: 3, value: 0, width: "0%" },
                  { star: 2, value: 0, width: "0%" },
                  { star: 1, value: 0, width: "0%" },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-slate-700">{item.star} ★</div>
                    <div className="h-3 flex-1 rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: item.width }} />
                    </div>
                    <div className="w-8 text-right text-sm font-semibold text-slate-700">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-semibold text-slate-900">Tất cả đánh giá</p>
              <Link
                to="/manage"
                className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Quay lại quản lý quán
              </Link>
            </div>

            <article className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Nguyễn Văn An</p>
                      <div className="mt-1 flex items-center gap-1 text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">15/5/2026</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Đồ ăn rất ngon, không gian đẹp, nhân viên nhiệt tình. Mình đã thử món bún riêu chay và phở chay, cả hai đều tuyệt vời!
                </p>
                <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
                    alt="Review dish"
                    className="h-52 w-full object-cover"
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Lê Thị Cẩm</p>
                      <div className="mt-1 flex items-center gap-1 text-yellow-500">
                        {'★'.repeat(4)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">18/5/2026</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Không gian quán sạch và yên tĩnh, phù hợp gặp gỡ bạn bè. Món ăn ngon, nước dùng đậm đà.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
