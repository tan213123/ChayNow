import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OwnerLayout from "@/components/OwnerLayout";
import { restaurants } from "@/data/restaurants";

const defaultRestaurant = restaurants[0];
type OwnerRestaurant = typeof defaultRestaurant;
type DishCategory = "Món chính" | "Ăn vặt / Khai vị" | "Tráng miệng" | "Đồ uống";

type DishForm = {
  image: File | null;
  name: string;
  category: DishCategory;
  price: string;
  description: string;
};

export default function OwnerNewDish() {
  const navigate = useNavigate();
  const [ownerRestaurant, setOwnerRestaurant] = useState<OwnerRestaurant | null>(null);
  const [form, setForm] = useState<DishForm>({
    image: null,
    name: "",
    category: "Món chính",
    price: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const authData = localStorage.getItem("authUser");
    if (!authData) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(authData) as { label?: string };
      if (parsed.label !== "Chủ quán") {
        navigate("/");
        return;
      }
    } catch {
      localStorage.removeItem("authUser");
      navigate("/login");
      return;
    }

    const storedRestaurant = localStorage.getItem("ownerRestaurant");
    if (!storedRestaurant) {
      navigate("/manage/restaurants");
      return;
    }

    try {
      setOwnerRestaurant(JSON.parse(storedRestaurant) as OwnerRestaurant);
    } catch {
      localStorage.removeItem("ownerRestaurant");
      navigate("/manage/restaurants");
    }
  }, [navigate]);

  const handleInputChange = (key: keyof DishForm, value: string | File | null) => {
    setForm((current) => ({ ...current, [key]: value } as DishForm));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.price.trim() || !form.description.trim()) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    if (!ownerRestaurant) {
      setError("Không tìm thấy quán của bạn. Vui lòng chọn lại quán.");
      return;
    }

    const newDish: typeof defaultRestaurant.menu[number] = {
      name: form.name.trim(),
      price: form.price.trim(),
      category: form.category,
    };

    const updatedRestaurant = {
      ...ownerRestaurant,
      menu: [...ownerRestaurant.menu, newDish],
    } as OwnerRestaurant;

    localStorage.setItem("ownerRestaurant", JSON.stringify(updatedRestaurant));
    setSuccess("Đã đăng món ăn mới thành công!");
    navigate("/manage");
  };

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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-semibold text-slate-700">Hình ảnh món ăn *</label>
              <label htmlFor="dish-image" className="cursor-pointer rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                  ⬆
                </div>
                <p className="mt-4 text-sm font-semibold">Click để tải lên hoặc kéo thả hình ảnh vào đây</p>
                <p className="mt-2 text-xs text-slate-400">PNG, JPG, JPEG (Max 5MB)</p>
                {form.image ? (
                  <p className="mt-3 text-sm text-slate-700">{form.image.name}</p>
                ) : null}
                <input
                  id="dish-image"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  onChange={(event) => handleInputChange("image", event.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Tên món ăn *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => handleInputChange("name", event.target.value)}
                  placeholder="VD: Bún riêu chay đặc biệt"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Loại món *</label>
                <select
                  value={form.category}
                  onChange={(event) => handleInputChange("category", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="Món chính">Món chính</option>
                  <option value="Ăn vặt / Khai vị">Ăn vặt / Khai vị</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                  <option value="Đồ uống">Đồ uống</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Giá món ăn *</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(event) => handleInputChange("price", event.target.value)}
                  placeholder="VD: 65.000đ"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6" />
            </div>

            <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-semibold text-slate-700">Mô tả món ăn *</label>
              <textarea
                rows={6}
                value={form.description}
                onChange={(event) => handleInputChange("description", event.target.value)}
                placeholder="Mô tả về nguyên liệu, hương vị, cách chế biến..."
                className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

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
                  type="submit"
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
