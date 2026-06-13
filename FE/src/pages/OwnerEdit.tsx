import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import { restaurants } from "@/data/restaurants";
import {
  createRestaurant,
  getTypeRestaurants,
} from "@/services/restaurant.service";
import type { TypeRestaurantResponse } from "@/types/restaurant";

const defaultRestaurant = restaurants[0];
const emptyRestaurant = {
  ...defaultRestaurant,
  id: "",
  name: "",
  location: "",
  hours: "",
  priceRange: "",
  rating: 0,
  reviews: 0,
  category: "",
  tags: [],
  image: "",
  intro: "",
  address: "",
  phone: "",
  menu: [],
  reviewsList: [],
  features: [],
};

type OwnerRestaurant = typeof defaultRestaurant;

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  label?: string;
};

const readAuthUser = (): AuthUser | null => {
  const authData = localStorage.getItem("authUser");
  if (!authData) {
    return null;
  }

  try {
    return JSON.parse(authData) as AuthUser;
  } catch {
    localStorage.removeItem("authUser");
    return null;
  }
};

const readOwnerRestaurant = (): OwnerRestaurant | null => {
  const storedRestaurant = localStorage.getItem("ownerRestaurant");
  if (!storedRestaurant) {
    return null;
  }

  try {
    return JSON.parse(storedRestaurant) as OwnerRestaurant;
  } catch {
    localStorage.removeItem("ownerRestaurant");
    return null;
  }
};

export default function OwnerEdit() {
  const navigate = useNavigate();
  const [authUser] = useState<AuthUser | null>(readAuthUser);
  const [storedRestaurant] = useState<OwnerRestaurant | null>(
    readOwnerRestaurant,
  );
  const [restaurant, setRestaurant] = useState<OwnerRestaurant>(
    storedRestaurant ?? emptyRestaurant,
  );
  const [tagString, setTagString] = useState(
    storedRestaurant?.tags.join(", ") ?? "",
  );
  const [typeRestaurants, setTypeRestaurants] = useState<
    TypeRestaurantResponse[]
  >([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [isEditing] = useState(Boolean(storedRestaurant));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    if (authUser.label !== "Chủ quán") {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    getTypeRestaurants()
      .then((types) => {
        setTypeRestaurants(types);
        if (storedRestaurant) {
          const matchingType = types.find(
            (type) => type.name === storedRestaurant.category,
          );
          if (matchingType) {
            setSelectedTypeId(String(matchingType.id));
          }
        }
      })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách loại nhà hàng.",
        );
      });
  }, [storedRestaurant]);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const handleInputChange = (key: keyof OwnerRestaurant, value: string) => {
    setRestaurant((current) => ({ ...current, [key]: value } as OwnerRestaurant));
  };

  const handleSave = async () => {
    const updatedRestaurant = {
      ...restaurant,
      tags: tagString.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    if (isEditing) {
      localStorage.setItem(
        "ownerRestaurant",
        JSON.stringify(updatedRestaurant),
      );
      toast.info("Backend chưa có API cập nhật nhà hàng; thay đổi được lưu cục bộ.");
      navigate("/manage");
      return;
    }

    if (!restaurant.name.trim() || !selectedTypeId) {
      toast.error("Vui lòng nhập tên quán và chọn loại hình.");
      return;
    }

    try {
      setIsSaving(true);
      const createdRestaurant = await createRestaurant({
        name: restaurant.name.trim(),
        address: restaurant.address.trim() || undefined,
        phoneNumber: restaurant.phone.replace(/\s/g, "") || undefined,
        description: restaurant.intro.trim() || undefined,
        typeRestaurantId: Number(selectedTypeId),
        mediaUrls: restaurant.image.trim()
          ? [restaurant.image.trim()]
          : undefined,
      });

      localStorage.setItem(
        "ownerRestaurant",
        JSON.stringify({
          ...updatedRestaurant,
          id: String(createdRestaurant.id),
          category: createdRestaurant.typeRestaurantName,
        }),
      );
      toast.success("Tạo nhà hàng thành công.");
      navigate(`/restaurant/${createdRestaurant.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tạo nhà hàng.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OwnerLayout
      profile={
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <span className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm">{authUser?.label?.[0] ?? "U"}</span>
            {authUser?.label ?? "Chủ quán"}
          </span>
          <button onClick={handleLogout} className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200">
            Đăng xuất
          </button>
        </div>
      }
    >
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Chỉnh sửa quán</p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Cập nhật thông tin quán của bạn</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSaving
                ? "Đang lưu..."
                : isEditing
                  ? "Lưu thay đổi"
                  : "Tạo nhà hàng"}
            </Button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tên quán</label>
                <input
                  value={restaurant.name}
                  onChange={(event) => handleInputChange("name", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ</label>
                <input
                  value={restaurant.address}
                  onChange={(event) => handleInputChange("address", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                <input
                  value={restaurant.phone}
                  onChange={(event) => handleInputChange("phone", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giờ mở cửa</label>
                <input
                  value={restaurant.hours}
                  onChange={(event) => handleInputChange("hours", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Loại hình</label>
                <select
                  value={selectedTypeId}
                  onChange={(event) => {
                    setSelectedTypeId(event.target.value);
                    const type = typeRestaurants.find(
                      (item) => item.id === Number(event.target.value),
                    );
                    handleInputChange("category", type?.name ?? "");
                  }}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  <option value="">Chọn loại hình</option>
                  {typeRestaurants.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Khoảng giá</label>
                <input
                  value={restaurant.priceRange}
                  onChange={(event) => handleInputChange("priceRange", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
                <input
                  value={tagString}
                  onChange={(event) => setTagString(event.target.value)}
                  placeholder="Chay Á, Chay Âu, Healthy"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giới thiệu ngắn</label>
                <textarea
                  value={restaurant.intro}
                  onChange={(event) => handleInputChange("intro", event.target.value)}
                  rows={5}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500"></p>
            <Link to="/manage" className="text-sm font-semibold text-emerald-700 hover:underline">
              Quay lại Dashboard
            </Link>
          </div>
        </div>
      </section>
    </OwnerLayout>
  );
}
