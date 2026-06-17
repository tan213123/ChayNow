import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import OwnerLayout from "@/components/OwnerLayout";
import { Button } from "@/components/ui/button";
import { getSelectedRestaurantId } from "@/lib/ownerRestaurant";
import {
  createMenu,
  deleteMenu,
  getRestaurantMenus,
  updateMenu,
} from "@/services/menu.service";
import { getRestaurant } from "@/services/restaurant.service";
import type {
  CreateMenuRequest,
  MenuResponse,
  RestaurantResponse,
} from "@/types/restaurant";

type MenuForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  available: boolean;
  featured: boolean;
};

const emptyForm: MenuForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  available: true,
  featured: false,
};

const fallbackImage =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default function OwnerNewDish() {
  return (
    <OwnerLayout>
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
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Thực đơn
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {restaurant?.name ?? "Nhà hàng"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Tạo, chỉnh sửa và quản lý trạng thái món ăn.
              </p>
            </div>
            <Link
              to="/manage/restaurants"
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Đổi nhà hàng
            </Link>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-[2rem] bg-white p-7 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Chỉnh sửa món" : "Thêm món mới"}
              </h2>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  Hủy
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-5">
              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                Tên món *
                <input
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                Giá (VND) *
                <input
                  value={form.price}
                  onChange={(event) => setField("price", event.target.value)}
                  type="number"
                  min="0"
                  step="1000"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                Danh mục
                <input
                  value={form.category}
                  onChange={(event) => setField("category", event.target.value)}
                  placeholder="Món chính, đồ uống..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                URL hình ảnh
                <input
                  value={form.imageUrl}
                  onChange={(event) => setField("imageUrl", event.target.value)}
                  type="text"
                  placeholder="Nhập đường dẫn hình ảnh"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                Mô tả
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setField("description", event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>
              <div className="flex flex-wrap gap-5 text-sm text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    checked={form.available}
                    onChange={(event) =>
                      setField("available", event.target.checked)
                    }
                    type="checkbox"
                  />
                  Đang bán
                </label>
                <label className="flex items-center gap-2">
                  <input
                    checked={form.featured}
                    onChange={(event) =>
                      setField("featured", event.target.checked)
                    }
                    type="checkbox"
                  />
                  Món nổi bật
                </label>
              </div>
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-2xl bg-emerald-600 py-3 text-white hover:bg-emerald-700"
              >
                {isSaving
                  ? "Đang lưu..."
                  : editingId
                    ? "Lưu thay đổi"
                    : "Tạo món ăn"}
              </Button>
            </div>
          </form>

          <div>
            {isLoading ? (
              <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-500">
                Đang tải thực đơn...
              </div>
            ) : menus.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-semibold text-slate-900">
                  Nhà hàng chưa có món ăn.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Dùng biểu mẫu bên cạnh để tạo món đầu tiên.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {menus.map((menu) => (
                  <article
                    key={menu.id}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={menu.imageUrl || fallbackImage}
                      alt={menu.name}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {menu.name}
                          </h2>
                          <p className="mt-1 font-semibold text-emerald-700">
                            {priceFormatter.format(menu.price)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            menu.available
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {menu.available ? "Đang bán" : "Tạm hết"}
                        </span>
                      </div>
                      {menu.category ? (
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {menu.category}
                        </p>
                      ) : null}
                      <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
                        {menu.description || "Chưa có mô tả."}
                      </p>
                      {menu.featured ? (
                        <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Món nổi bật
                        </span>
                      ) : null}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          onClick={() => startEditing(menu)}
                          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleAvailability(menu)}
                          className="rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        >
                          {menu.available ? "Tạm hết" : "Mở bán"}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDelete(menu)}
                          disabled={deletingId === menu.id}
                          className="rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                        >
                          {deletingId === menu.id ? "Đang xóa..." : "Xóa"}
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </OwnerLayout>
  );
}
