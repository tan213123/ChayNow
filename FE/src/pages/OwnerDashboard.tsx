import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import { restaurants } from "@/data/restaurants";

const defaultRestaurant = restaurants[0];

type OwnerRestaurant = typeof defaultRestaurant;
type OwnerEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discount?: string;
  charityTime?: string;
  createdAt: string;
};

type AuthUser = {
  email: string;
  label: string;
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const authUser = useMemo<AuthUser | null>(() => {
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
  }, []);
  const [ownerRestaurant, setOwnerRestaurant] = useState<OwnerRestaurant>(() => {
    const storedRestaurant = localStorage.getItem("ownerRestaurant");
    if (!storedRestaurant) {
      return defaultRestaurant;
    }

    try {
      return JSON.parse(storedRestaurant);
    } catch {
      localStorage.removeItem("ownerRestaurant");
      return defaultRestaurant;
    }
  });
  const [ownerEvents, setOwnerEvents] = useState<OwnerEvent[]>(() => {
    const storedEvents = localStorage.getItem("ownerEvents");
    if (!storedEvents) {
      return [];
    }

    try {
      return JSON.parse(storedEvents);
    } catch {
      localStorage.removeItem("ownerEvents");
      return [];
    }
  });

  const handleDeleteDish = (dishName: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa món ăn này không?");
    if (!confirmed) return;

    const updatedRestaurant = {
      ...ownerRestaurant,
      menu: ownerRestaurant.menu.filter((dish) => dish.name !== dishName),
    } as OwnerRestaurant;

    setOwnerRestaurant(updatedRestaurant);
    localStorage.setItem("ownerRestaurant", JSON.stringify(updatedRestaurant));
  };

  const handleDeleteEvent = (eventId: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sự kiện này không?");
    if (!confirmed) return;

    const updatedEvents = ownerEvents.filter((event) => event.id !== eventId);
    setOwnerEvents(updatedEvents);
    localStorage.setItem("ownerEvents", JSON.stringify(updatedEvents));

    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
  };
  const [dashboardView, setDashboardView] = useState<"menu" | "events">("menu");
  const [selectedEvent, setSelectedEvent] = useState<OwnerEvent | null>(null);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    if (authUser.label !== "Chủ quán") {
      navigate("/");
      return;
    }

    const storedRestaurant = localStorage.getItem("ownerRestaurant");
    if (!storedRestaurant) {
      navigate("/manage/restaurants");
    }
  }, [navigate, authUser]);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const handleEditEvent = (event: OwnerEvent) => {
    localStorage.setItem("editingEvent", JSON.stringify(event));
    navigate("/manage/events");
  };

  return (
    <OwnerLayout
      profile={
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <span className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm">
              {authUser?.label?.[0] ?? "C"}
            </span>
            {authUser?.label ?? "Chủ quán"}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200"
          >
            Đăng xuất
          </button>
        </div>
      }
    >
      <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Dashboard Chủ Quán</p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Quản lý quán ăn và bài đăng của bạn</h1>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <img src={ownerRestaurant.image} alt={ownerRestaurant.name} className="h-28 w-28 rounded-[2rem] object-cover" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{ownerRestaurant.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{ownerRestaurant.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{ownerRestaurant.category}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{ownerRestaurant.hours}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => navigate("/manage/edit")} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                Chỉnh sửa
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Đánh giá trung bình</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{ownerRestaurant.rating}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Tổng đánh giá</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{ownerRestaurant.reviews}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Bài đăng</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">3</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Nhà hàng của tôi</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Quản lý danh sách quán</p>
                <p className="mt-3 text-sm text-slate-500">Xem danh sách quán, chỉnh sửa thông tin và thêm quán mới cho chủ quán.</p>
              </div>
              <Link
                to="/manage/restaurants"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Xem My Restaurants
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Link
              to="/manage/new-dish"
              className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-lg font-semibold text-emerald-900">Đăng món ăn mới</p>
              <p className="mt-3 text-sm text-emerald-700">Chia sẻ món ăn đặc biệt của quán bạn với mọi người.</p>
            </Link>
            <Link
              to="/manage/events"
              onClick={() => localStorage.removeItem("editingEvent")}
              className="rounded-[2rem] border border-sky-200 bg-sky-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-lg font-semibold text-sky-900">Tạo sự kiện</p>
              <p className="mt-3 text-sm text-sky-700">Tạo chương trình giảm giá hoặc hoạt động từ thiện cho quán.</p>
            </Link>
            <Link
              to="/manage/reviews"
              className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-lg font-semibold text-rose-900">Xem đánh giá</p>
              <p className="mt-3 text-sm text-rose-700">Xem và phản hồi các đánh giá mới nhất từ khách hàng.</p>
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{dashboardView === "menu" ? "Món ăn của quán" : "Sự kiện của quán"}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {dashboardView === "menu"
                    ? "Xem danh sách món ăn hiện tại và chỉnh sửa từng món khi cần."
                    : "Xem danh sách sự kiện đã tạo và quản lý các sự kiện của quán."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDashboardView(dashboardView === "menu" ? "events" : "menu")}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {dashboardView === "menu" ? "Hiện sự kiện" : "Hiện món ăn"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardView === "menu" ? (
                ownerRestaurant.menu.length > 0 ? (
                  ownerRestaurant.menu.map((dish) => (
                    <div key={dish.name} className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{dish.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{dish.category}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                        <p className="font-semibold text-emerald-700">{dish.price}</p>
                        <Button
                          onClick={() => navigate("/manage/new-dish")}
                          className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          onClick={() => handleDeleteDish(dish.name)}
                          className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    Chưa có món ăn nào. Hãy thêm món ăn mới để khách hàng biết đến quán của bạn.
                  </div>
                )
              ) : ownerEvents.length > 0 ? (
                ownerEvents.map((event) => (
                  <div key={event.id} className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{event.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{event.type} • {event.startDate} - {event.endDate}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                      <p className="font-semibold text-emerald-700">{event.discount ?? event.charityTime ?? ""}</p>
                      <Button
                        onClick={() => setSelectedEvent(event)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Xem
                      </Button>
                      <Button
                        onClick={() => handleEditEvent(event)}
                        className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                  Chưa có sự kiện nào. Hãy tạo sự kiện mới để khách hàng biết đến quán của bạn.
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedEvent && (() => {
          const getEventStatus = (startStr: string, endStr: string) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const start = new Date(startStr);
            const end = new Date(endStr);
            
            if (today < start) return "Sắp diễn ra";
            if (today > end) return "Đã kết thúc";
            return "Đang diễn ra";
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                
                {/* Event Image */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img 
                    src={
                      selectedEvent.type === "charity"
                        ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                        : "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80"
                    } 
                    alt={selectedEvent.title} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <span className="absolute left-6 top-6 rounded-full bg-rose-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                    {selectedEvent.type === "discount" ? selectedEvent.discount : "Từ thiện"}
                  </span>
                  <span className={`absolute right-6 top-6 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-md ${
                    getEventStatus(selectedEvent.startDate, selectedEvent.endDate) === "Đang diễn ra"
                      ? "bg-emerald-600"
                      : getEventStatus(selectedEvent.startDate, selectedEvent.endDate) === "Sắp diễn ra"
                      ? "bg-amber-500"
                      : "bg-slate-500"
                  }`}>
                    {getEventStatus(selectedEvent.startDate, selectedEvent.endDate)}
                  </span>
                </div>

                {/* Event Body */}
                <div className="p-8 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 leading-snug">{selectedEvent.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{selectedEvent.description}</p>
                  </div>

                  {/* Metadata Details */}
                  <div className="border-t border-slate-100 pt-5 space-y-3 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <span className="text-base">📍</span> 
                      <span className="font-semibold text-slate-800">Quán:</span> {ownerRestaurant.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-base">📅</span> 
                      <span className="font-semibold text-slate-800">Thời gian:</span> {selectedEvent.startDate} đến {selectedEvent.endDate}
                    </p>
                    {selectedEvent.charityTime && (
                      <p className="flex items-center gap-2">
                        <span className="text-base">🕒</span> 
                        <span className="font-semibold text-slate-800">Giờ phát:</span> {selectedEvent.charityTime}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <div className="pt-2 flex justify-end">
                    <Button 
                      onClick={() => setSelectedEvent(null)}
                      className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </OwnerLayout>
  );
}
