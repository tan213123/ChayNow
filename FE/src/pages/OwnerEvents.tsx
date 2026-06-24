import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import OwnerLayout from "@/components/OwnerLayout";
import { Button } from "@/components/ui/button";
import {
  createEvent,
  deleteEvent,
  getRestaurantEvents,
  updateEvent,
} from "@/services/event.service";
import {
  getRestaurant,
  getMyRestaurants,
} from "@/services/restaurant.service";
import {
  getSelectedRestaurantId,
  setSelectedRestaurantId,
} from "@/lib/ownerRestaurant";
import type {
  CreateEventRequest,
  EventResponse,
  EventStatus,
  EventType,
  RestaurantResponse,
} from "@/types/restaurant";

type EventForm = {
  title: string;
  description: string;
  imageUrl: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  status: EventStatus | "AUTO";
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  imageUrl: "",
  eventType: "CHARITY",
  startDate: "",
  endDate: "",
  status: "AUTO",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80";

const eventTypeLabels: Record<EventType, string> = {
  CHARITY: "Từ thiện",
  DISCOUNT: "Giảm giá",
};

const statusLabels: Record<EventStatus, string> = {
  UPCOMING: "Sắp diễn ra",
  ACTIVE: "Đang diễn ra",
  EXPIRED: "Đã kết thúc",
  HIDDEN: "Đã ẩn",
};

const statusStyles: Record<EventStatus, string> = {
  UPCOMING: "bg-sky-50 text-sky-700",
  ACTIVE: "bg-emerald-50 text-emerald-700",
  EXPIRED: "bg-slate-100 text-slate-600",
  HIDDEN: "bg-rose-50 text-rose-700",
};

const getEventTypeLabel = (eventType: string | null) =>
  eventType ? eventTypeLabels[eventType as EventType] : "Sự kiện";

const getStatusLabel = (status: string | null) =>
  status ? statusLabels[status as EventStatus] : "Chưa cập nhật";

const getStatusStyle = (status: string | null) =>
  status ? statusStyles[status as EventStatus] : "bg-slate-100 text-slate-600";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatDate = (date: string | null) =>
  date ? dateFormatter.format(new Date(date)) : "Chưa cập nhật";

export default function OwnerEvents() {
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      let restaurantId = getSelectedRestaurantId();

      if (!restaurantId) {
        const restaurants = await getMyRestaurants();
        restaurantId = restaurants[0]?.id ?? null;
        if (restaurantId) {
          setSelectedRestaurantId(restaurantId);
        }
      }

      if (!restaurantId) {
        return;
      }

      const [restaurantData, eventData] = await Promise.all([
        getRestaurant(restaurantId),
        getRestaurantEvents(restaurantId),
      ]);

      if (!cancelled) {
        setRestaurant(restaurantData);
        setEvents(eventData);
      }
    };

    loadEvents()
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách sự kiện.",
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
  }, []);

  const setField = <Key extends keyof EventForm>(
    key: Key,
    value: EventForm[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEditing = (restaurantEvent: EventResponse) => {
    setEditingId(restaurantEvent.id);
    setForm({
      title: restaurantEvent.title,
      description: restaurantEvent.description ?? "",
      imageUrl: restaurantEvent.imageUrl ?? "",
      eventType: (restaurantEvent.eventType as EventType) ?? "CHARITY",
      startDate: restaurantEvent.startDate ?? "",
      endDate: restaurantEvent.endDate ?? "",
      status: (restaurantEvent.status as EventStatus) ?? "AUTO",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurant) {
      return;
    }

    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tên sự kiện.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
      return;
    }
    if (form.endDate < form.startDate) {
      toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
      return;
    }

    const payload: CreateEventRequest = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      eventType: form.eventType,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status === "AUTO" ? undefined : form.status,
    };

    try {
      setIsSaving(true);
      if (editingId) {
        const updated = await updateEvent(editingId, payload);
        setEvents((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        toast.success("Cập nhật sự kiện thành công.");
      } else {
        const created = await createEvent(restaurant.id, payload);
        setEvents((current) => [created, ...current]);
        toast.success("Tạo sự kiện thành công.");
      }
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu sự kiện.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (restaurantEvent: EventResponse) => {
    if (!window.confirm(`Ẩn sự kiện "${restaurantEvent.title}"?`)) {
      return;
    }

    try {
      setDeletingId(restaurantEvent.id);
      await deleteEvent(restaurantEvent.id);
      setEvents((current) =>
        current.filter((item) => item.id !== restaurantEvent.id),
      );
      if (editingId === restaurantEvent.id) {
        resetForm();
      }
      toast.success("Đã ẩn sự kiện.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa sự kiện.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-500">
          Đang tải danh sách sự kiện...
        </div>
      </OwnerLayout>
    );
  }

  if (!restaurant) {
    return (
      <OwnerLayout>
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Chưa có nhà hàng để tạo sự kiện
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Tạo hoặc chọn một nhà hàng trước khi quản lý sự kiện.
          </p>
          <Link
            to="/manage/restaurants"
            className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Chọn nhà hàng
          </Link>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Sự kiện
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {restaurant.name}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Tạo, chỉnh sửa và ẩn các chương trình từ thiện hoặc giảm giá.
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
                {editingId ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}
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
                Tên sự kiện *
                <input
                  value={form.title}
                  onChange={(event) => setField("title", event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                Loại sự kiện *
                <select
                  value={form.eventType}
                  onChange={(event) =>
                    setField("eventType", event.target.value as EventType)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                >
                  <option value="CHARITY">Từ thiện</option>
                  <option value="DISCOUNT">Giảm giá</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-sm font-semibold text-slate-700">
                  Bắt đầu *
                  <input
                    value={form.startDate}
                    onChange={(event) =>
                      setField("startDate", event.target.value)
                    }
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="block space-y-2 text-sm font-semibold text-slate-700">
                  Kết thúc *
                  <input
                    value={form.endDate}
                    onChange={(event) =>
                      setField("endDate", event.target.value)
                    }
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                Trạng thái
                <select
                  value={form.status}
                  onChange={(event) =>
                    setField(
                      "status",
                      event.target.value as EventForm["status"],
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                >
                  <option value="AUTO">Tự động theo ngày</option>
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="ACTIVE">Đang diễn ra</option>
                  <option value="EXPIRED">Đã kết thúc</option>
                </select>
              </label>

              <label className="block space-y-2 text-sm font-semibold text-slate-700">
                URL hình ảnh
                <input
                  value={form.imageUrl}
                  onChange={(event) => setField("imageUrl", event.target.value)}
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
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-emerald-500"
                />
              </label>

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-2xl bg-emerald-600 py-3 text-white hover:bg-emerald-700"
              >
                {isSaving
                  ? "Đang lưu..."
                  : editingId
                    ? "Lưu thay đổi"
                    : "Tạo sự kiện"}
              </Button>
            </div>
          </form>

          <div>
            {events.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="font-semibold text-slate-900">
                  Nhà hàng chưa có sự kiện.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Dùng biểu mẫu bên cạnh để tạo chương trình đầu tiên.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {events.map((restaurantEvent) => (
                  <article
                    key={restaurantEvent.id}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={restaurantEvent.imageUrl || fallbackImage}
                      alt={restaurantEvent.title}
                      className="h-44 w-full object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            {getEventTypeLabel(restaurantEvent.eventType)}
                          </p>
                          <h2 className="mt-2 text-lg font-bold text-slate-900">
                            {restaurantEvent.title}
                          </h2>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            getStatusStyle(restaurantEvent.status)
                          }`}
                        >
                          {getStatusLabel(restaurantEvent.status)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        {formatDate(restaurantEvent.startDate)} -{" "}
                        {formatDate(restaurantEvent.endDate)}
                      </p>
                      <p className="mt-3 line-clamp-3 min-h-16 text-sm leading-6 text-slate-600">
                        {restaurantEvent.description || "Chưa có mô tả."}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          onClick={() => startEditing(restaurantEvent)}
                          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDelete(restaurantEvent)}
                          disabled={deletingId === restaurantEvent.id}
                          className="rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                        >
                          {deletingId === restaurantEvent.id
                            ? "Đang xóa..."
                            : "Xóa"}
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
