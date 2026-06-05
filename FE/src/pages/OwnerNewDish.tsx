import { Link } from "react-router-dom";
import OwnerLayout from "@/components/OwnerLayout";

export default function OwnerNewDish() {
  return (
    <OwnerLayout
      profile={
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60"
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            Trần Thị Bình
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            ↩ Đăng xuất
          </Link>
        </div>
      }
    >
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl">
          <div className="mb-10 flex flex-col gap-4">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Đăng món ăn mới</p>
              <h1 className="text-4xl font-extrabold text-slate-900">Đăng món ăn mới</h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Chia sẻ món ăn đặc biệt của quán bạn với mọi người. Tải ảnh lên, điền tên, mô tả và loại món để cập nhật thực đơn.
              </p>
            </div>
          </div>

          <form className="space-y-8">
            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-semibold text-slate-700">Hình ảnh món ăn *</label>
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                  ⬆
                </div>
                <p className="mt-4 text-sm font-semibold">Click để tải lên hoặc kéo thả hình ảnh vào đây</p>
                <p className="mt-2 text-xs text-slate-400">PNG, JPG, JPEG (Max 5MB)</p>
                <input type="file" className="sr-only" />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Tên món ăn *</label>
                <input
                  type="text"
                  placeholder="VD: Bún riêu chay đặc biệt"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Loại món *</label>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                  <option>Món chính</option>
                  <option>Ăn vặt / Khai vị</option>
                  <option>Tráng miệng</option>
                  <option>Đồ uống</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-semibold text-slate-700">Mô tả món ăn *</label>
              <textarea
                rows={6}
                placeholder="Mô tả về nguyên liệu, hương vị, cách chế biến..."
                className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-sm text-slate-500">
                <p className="font-semibold text-slate-900">Lưu ý</p>
                <p>Điền đầy đủ thông tin để khách hàng dễ dàng tìm thấy món ăn trên thực đơn.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/manage"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </Link>
                <button
                  type="button"
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  + Đăng bài
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </OwnerLayout>
  );
}
