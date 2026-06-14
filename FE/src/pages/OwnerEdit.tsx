import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import {
  createRestaurant,
  createTypeRestaurant,
  getRestaurant,
  getTypeRestaurants,
  updateRestaurant,
} from "@/services/restaurant.service";
import {
  createPlace,
  deletePlace,
  getPlace,
  getPlaces,
  updatePlace,
} from "@/services/place.service";
import { setSelectedRestaurantId } from "@/lib/ownerRestaurant";
import type {
  PlaceRequest,
  PlaceResponse,
  TypeRestaurantResponse,
} from "@/types/restaurant";

type RestaurantForm = {
  name: string;
  address: string;
  phoneNumber: string;
  description: string;
  typeRestaurantId: string;
  placeId: string;
  mediaUrl: string;
};

const standardTypeNames = ["Bình dân", "Buffet", "Cao cấp", "Từ thiện"] as const;

const emptyRestaurant: RestaurantForm = {
  name: "",
  address: "",
  phoneNumber: "",
  description: "",
  typeRestaurantId: "",
  placeId: "",
  mediaUrl: "",
};

const emptyPlace: PlaceRequest = {
  name: "",
  district: "",
  city: "",
  address: "",
  mapUrl: "",
};

export default function OwnerEdit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantId = Number(searchParams.get("id"));
  const isEditing = Number.isInteger(restaurantId) && restaurantId > 0;
  const [form, setForm] = useState<RestaurantForm>(emptyRestaurant);
  const [types, setTypes] = useState<TypeRestaurantResponse[]>([]);
  const [places, setPlaces] = useState<PlaceResponse[]>([]);
  const [placeDraft, setPlaceDraft] = useState<PlaceRequest>(emptyPlace);
  const [isNewPlace, setIsNewPlace] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPlace, setIsSavingPlace] = useState(false);
  const [isCreatingType, setIsCreatingType] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadForm = async () => {
      const [typeData, placeData] = await Promise.all([
        getTypeRestaurants(),
        getPlaces(),
      ]);

      if (cancelled) {
        return;
      }

      setTypes(typeData);
      setPlaces(placeData);

      if (!isEditing) {
        return;
      }

      const restaurant = await getRestaurant(restaurantId);
      if (cancelled) {
        return;
      }

      setForm({
        name: restaurant.name,
        address: restaurant.address ?? "",
        phoneNumber: restaurant.phoneNumber ?? "",
        description: restaurant.description ?? "",
        typeRestaurantId: String(restaurant.typeRestaurantId),
        placeId: restaurant.placeId ? String(restaurant.placeId) : "",
        mediaUrl: restaurant.mediaList[0]?.url ?? "",
      });

      if (restaurant.placeId) {
        const place = await getPlace(restaurant.placeId);
        if (!cancelled) {
          setPlaceDraft({
            name: place.name,
            district: place.district,
            city: place.city,
            address: place.address,
            mapUrl: place.mapUrl ?? "",
          });
        }
      }
    };

    loadForm()
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể tải dữ liệu biểu mẫu.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isEditing, restaurantId]);

  const setField = (key: keyof RestaurantForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setPlaceField = (key: keyof PlaceRequest, value: string) => {
    setPlaceDraft((current) => ({ ...current, [key]: value }));
  };

  const handleTypeSelection = async (value: string) => {
    if (!value || !value.startsWith("new:")) {
      setField("typeRestaurantId", value);
      return;
    }

    const typeName = value.slice(4);
    try {
      setIsCreatingType(true);
      const created = await createTypeRestaurant({
        name: typeName,
        description: `Loại hình ${typeName}`,
      });
      setTypes((current) => [...current, created]);
      setField("typeRestaurantId", String(created.id));
      toast.success(`Đã thêm loại hình "${typeName}".`);
    } catch (error) {
      setField("typeRestaurantId", "");
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tạo loại hình nhà hàng.",
      );
    } finally {
      setIsCreatingType(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setImagePreviewUrl("");
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh PNG, JPG, JPEG hoặc WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dung lượng ảnh tối đa là 5MB.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceSelection = async (value: string) => {
    setField("placeId", value);
    setIsNewPlace(false);

    if (!value) {
      setPlaceDraft(emptyPlace);
      return;
    }

    try {
      const place = await getPlace(Number(value));
      setPlaceDraft({
        name: place.name,
        district: place.district,
        city: place.city,
        address: place.address,
        mapUrl: place.mapUrl ?? "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể tải địa điểm.",
      );
    }
  };

  const validatePlace = () => {
    if (
      !placeDraft.name.trim() ||
      !placeDraft.district.trim() ||
      !placeDraft.city.trim() ||
      !placeDraft.address.trim()
    ) {
      toast.error("Vui lòng nhập đủ tên, quận/huyện, thành phố và địa chỉ.");
      return false;
    }
    return true;
  };

  const handleSavePlace = async () => {
    if (!validatePlace()) {
      return;
    }

    try {
      setIsSavingPlace(true);
      if (isNewPlace || !form.placeId) {
        const created = await createPlace({
          ...placeDraft,
          name: placeDraft.name.trim(),
          district: placeDraft.district.trim(),
          city: placeDraft.city.trim(),
          address: placeDraft.address.trim(),
          mapUrl: placeDraft.mapUrl?.trim() || undefined,
        });
        setPlaces((current) => [...current, created]);
        setField("placeId", String(created.id));
        setIsNewPlace(false);
        toast.success("Tạo địa điểm thành công.");
      } else {
        const updated = await updatePlace(Number(form.placeId), placeDraft);
        setPlaces((current) =>
          current.map((place) => (place.id === updated.id ? updated : place)),
        );
        toast.success("Cập nhật địa điểm thành công.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu địa điểm.",
      );
    } finally {
      setIsSavingPlace(false);
    }
  };

  const handleDeletePlace = async () => {
    if (!form.placeId || isNewPlace) {
      return;
    }
    if (!window.confirm("Bạn có chắc muốn xóa địa điểm này không?")) {
      return;
    }

    try {
      setIsSavingPlace(true);
      await deletePlace(Number(form.placeId));
      setPlaces((current) =>
        current.filter((place) => place.id !== Number(form.placeId)),
      );
      setField("placeId", "");
      setPlaceDraft(emptyPlace);
      toast.success("Xóa địa điểm thành công.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể xóa địa điểm đang được sử dụng.",
      );
    } finally {
      setIsSavingPlace(false);
    }
  };

  const handleSaveRestaurant = async () => {
    if (
      !form.name.trim() ||
      !form.typeRestaurantId ||
      !form.placeId
    ) {
      toast.error("Vui lòng nhập tên quán, loại hình và địa điểm.");
      return;
    }

    if (imageFile) {
      toast.error(
        "Backend chưa có API upload ảnh. Vui lòng bỏ ảnh mới trước khi lưu nhà hàng.",
      );
      return;
    }

    const phoneNumber = form.phoneNumber.replace(/\s/g, "");
    if (phoneNumber && !/^(0|\+84)[0-9]{8,10}$/.test(phoneNumber)) {
      toast.error("Số điện thoại không đúng định dạng.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      phoneNumber: phoneNumber || undefined,
      description: form.description.trim() || undefined,
      placeId: Number(form.placeId),
      typeRestaurantId: Number(form.typeRestaurantId),
      mediaUrls: form.mediaUrl.trim() ? [form.mediaUrl.trim()] : [],
    };

    try {
      setIsSaving(true);
      const restaurant = isEditing
        ? await updateRestaurant(restaurantId, payload)
        : await createRestaurant(payload);
      setSelectedRestaurantId(restaurant.id);
      toast.success(
        isEditing
          ? "Cập nhật nhà hàng thành công."
          : "Tạo nhà hàng thành công.",
      );
      navigate("/manage");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu nhà hàng.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-500">
          Đang tải dữ liệu...
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                {isEditing ? "Chỉnh sửa quán" : "Thêm quán"}
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
                Thông tin nhà hàng
              </h1>
            </div>
            <Button
              onClick={handleSaveRestaurant}
              disabled={isSaving}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700"
            >
              {isSaving
                ? "Đang lưu..."
                : isEditing
                  ? "Lưu thay đổi"
                  : "Tạo nhà hàng"}
            </Button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Tên quán *
              <input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Loại hình *
              <select
                value={form.typeRestaurantId}
                onChange={(event) => handleTypeSelection(event.target.value)}
                disabled={isCreatingType}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
              >
                <option value="">Tất cả</option>
                {standardTypeNames.map((name) => {
                  const existingType = types.find(
                    (type) =>
                      type.name.localeCompare(name, "vi", {
                        sensitivity: "base",
                      }) === 0,
                  );
                  return (
                    <option
                      key={name}
                      value={
                        existingType ? String(existingType.id) : `new:${name}`
                      }
                    >
                      {name}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Địa chỉ hiển thị
              <input
                value={form.address}
                onChange={(event) => setField("address", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              Số điện thoại
              <input
                value={form.phoneNumber}
                onChange={(event) =>
                  setField("phoneNumber", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
              />
            </label>
            <div className="space-y-3 text-sm font-semibold text-slate-700 md:col-span-2">
              Hình ảnh nhà hàng
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                <span className="text-sm font-semibold text-slate-700">
                  Chọn ảnh từ máy tính
                </span>
                <span className="mt-1 text-xs font-normal text-slate-500">
                  PNG, JPG, JPEG hoặc WebP, tối đa 5MB
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) =>
                    handleImageChange(event.target.files?.[0] ?? null)
                  }
                />
              </label>
              {imagePreviewUrl || form.mediaUrl ? (
                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100">
                  <img
                    src={imagePreviewUrl || form.mediaUrl}
                    alt="Xem trước nhà hàng"
                    className="h-64 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreviewUrl("");
                      setField("mediaUrl", "");
                    }}
                    className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-rose-700 shadow"
                  >
                    Xóa ảnh
                  </button>
                </div>
              ) : null}
              {imageFile ? (
                <p className="text-xs font-normal text-amber-700">
                  Đã chọn: {imageFile.name}. Backend hiện chưa có API upload
                  file nên ảnh mới chưa thể lưu lên hệ thống.
                </p>
              ) : null}
            </div>
            <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
              Mô tả
              <textarea
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                Địa điểm
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Chọn hoặc tạo địa điểm
              </h2>
            </div>
            <Button
              onClick={() => {
                setIsNewPlace(true);
                setField("placeId", "");
                setPlaceDraft(emptyPlace);
              }}
              className="rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
            >
              Địa điểm mới
            </Button>
          </div>

          {!isNewPlace ? (
            <select
              value={form.placeId}
              onChange={(event) => handlePlaceSelection(event.target.value)}
              className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Chọn địa điểm *</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name} - {place.district}, {place.city}
                </option>
              ))}
            </select>
          ) : null}

          {(isNewPlace || form.placeId) ? (
            <>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {(
                  [
                    ["name", "Tên địa điểm *"],
                    ["district", "Quận / huyện *"],
                    ["city", "Thành phố *"],
                    ["address", "Địa chỉ *"],
                    ["mapUrl", "URL bản đồ"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className={`space-y-2 text-sm font-semibold text-slate-700 ${
                      key === "mapUrl" ? "md:col-span-2" : ""
                    }`}
                  >
                    {label}
                    <input
                      value={placeDraft[key] ?? ""}
                      onChange={(event) =>
                        setPlaceField(key, event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-sky-500"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={handleSavePlace}
                  disabled={isSavingPlace}
                  className="rounded-2xl bg-sky-600 text-white hover:bg-sky-700"
                >
                  {isSavingPlace
                    ? "Đang lưu..."
                    : isNewPlace
                      ? "Tạo địa điểm"
                      : "Cập nhật địa điểm"}
                </Button>
                {!isNewPlace ? (
                  <Button
                    onClick={handleDeletePlace}
                    disabled={isSavingPlace}
                    className="rounded-2xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                  >
                    Xóa địa điểm
                  </Button>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <Link
          to="/manage/restaurants"
          className="inline-flex text-sm font-semibold text-emerald-700 hover:underline"
        >
          Quay lại danh sách nhà hàng
        </Link>
      </section>
    </OwnerLayout>
  );
}
