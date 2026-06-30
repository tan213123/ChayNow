import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import {
  BarChart3,
  Calendar,
  Camera,
  Check,
  ClipboardList,
  Heart,
  Leaf,
  Mail,
  Pencil,
  Phone,
  User,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/auth";
import { getFavourites } from "@/services/favourite.service";
import type { RestaurantResponse } from "@/types/restaurant";
import { getMyProfile, updateMyProfile } from "@/services/user.service";
import type { UserProfileResponse } from "@/types/auth";
import { toast } from "sonner";

const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  OWNER: "Chủ quán",
  USER: "Người dùng",
};

const activityLog: any[] = [];

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [activeTab, setActiveTab] = useState<"overview" | "favorites" | "activity">("overview");
  const [name, setName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiRestaurants, setApiRestaurants] = useState<RestaurantResponse[]>([]);
  const [restLoading, setRestLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    if (user) {
      getMyProfile()
        .then((profile) => {
          setUserProfile(profile);
          setName(profile.fullName || "");
          setBio(profile.bio || "");
          setPhone(profile.phone || "");
        })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    getFavourites(0, 4)
      .then((res) => {
        if (res.success && res.data) {
          setApiRestaurants(res.data.content.map((item) => item.restaurant));
        }
      })
      .catch(console.error)
      .finally(() => setRestLoading(false));
  }, []);

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";

  if (!user) return null;

  const getInitials = () => (user.fullName || user.email).slice(0, 2).toUpperCase();
  const roleLabel = roleLabels[user.role];

  const handleStartEdit = () => {
    setEditName(name);
    setEditBio(bio);
    setEditPhone(phone);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const updated = await updateMyProfile({
        fullName: editName,
        phone: editPhone,
        bio: editBio,
      });
      setName(updated.fullName || "");
      setPhone(updated.phone || "");
      setBio(updated.bio || "");
      setUserProfile(updated);
      updateUser({
        fullName: updated.fullName,
        phone: updated.phone,
        bio: updated.bio,
      });
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err: any) {
      toast.error(err.message || "Lưu thất bại, vui lòng thử lại");
    } finally {
      setIsSaving(false);
    }
  };

  const tabItems = [
    { id: "overview" as const, label: "Tổng quan", icon: BarChart3 },
    { id: "favorites" as const, label: "Yêu thích", icon: Heart },
    { id: "activity" as const, label: "Hoạt động", icon: ClipboardList },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 pb-24 pt-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
            <div className="relative">
              <div className="h-28 w-28 rounded-[2rem] bg-white/20 ring-4 ring-white/40 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                {getInitials()}
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-lg hover:bg-slate-100 transition">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-emerald-100">
                    {roleLabel}
                  </p>
                  <h1 className="mt-1 text-3xl font-extrabold text-white">{name}</h1>
                  {bio && <p className="mt-2 text-sm text-emerald-100/90">{bio}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {user.role === "OWNER" && (
                    <Link
                      to="/manage/restaurants"
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
                    >
                      Quản lý quán
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="-mt-8 rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-slate-900">Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <button
                        onClick={handleStartEdit}
                        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-emerald-300 hover:text-emerald-600"
                      >
                        <Pencil className="h-4 w-4" />
                        Chỉnh sửa
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          Hủy
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
                        >
                          <Check className="h-4 w-4" />
                          {isSaving ? "Đang lưu..." : "Lưu"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  {!isEditing ? (
                    <div className="space-y-3">
                      {[
                        { label: "Email", value: user.email, icon: Mail },
                        { label: "Họ và tên", value: name || "Chưa cập nhật", icon: User },
                        { label: "Số điện thoại", value: phone || "Chưa cập nhật", icon: Phone },
                        { label: "Giới thiệu", value: bio || "Chưa cập nhật", icon: Pencil },
                        { label: "Loại tài khoản", value: roleLabel, icon: User },
                        {
                          label: "Tham gia từ",
                          value: userProfile?.createdAt
                            ? `Tháng ${userProfile.createdAt.split("-")[1]}/${userProfile.createdAt.split("-")[0]}`
                            : "Gần đây",
                          icon: Calendar,
                        },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                          <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                          <div>
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="text-sm font-medium text-slate-900">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ và tên</label>
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nhập họ và tên..."
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
                        <input
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="Nhập số điện thoại..."
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">Giới thiệu bản thân</label>
                        <textarea
                          rows={3}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Kể về bản thân bạn..."
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition resize-none"
                        />
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 flex items-center gap-3 opacity-60">
                        <Mail className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs text-slate-500">Email (không thể thay đổi)</p>
                          <p className="text-sm font-medium text-slate-900">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Hoạt động gần đây</h2>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className="text-sm font-medium text-emerald-600 hover:underline"
                    >
                      Xem tất cả →
                    </button>
                  </div>
                  {activityLog.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-slate-200 py-10 text-center">
                      <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
                      <p className="mt-3 text-sm text-slate-400">Chưa có hoạt động nào</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activityLog.slice(0, 3).map((item: any) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                              <Icon className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{item.text}</p>
                              <p className="text-xs text-slate-400">{item.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Địa điểm yêu thích</h2>
                  <Link to="/favorites" className="text-sm font-medium text-emerald-600 hover:underline">
                    Xem tất cả →
                  </Link>
                </div>
                {restLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm animate-pulse">
                        <div className="h-44 bg-slate-200" />
                        <div className="space-y-2 p-4">
                          <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                          <div className="h-3 w-1/2 rounded-full bg-slate-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {apiRestaurants.slice(0, 4).map((r) => (
                      <Link key={r.id} to={`/restaurant/${r.id}?tab=menu`}>
                        <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                          <div className="relative h-44 overflow-hidden bg-slate-100">
                            <img
                              src={r.mediaList[0]?.url ?? FALLBACK_IMG}
                              alt={r.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-slate-900">{r.name}</h3>
                            <p className="mt-1 text-sm text-slate-500">{r.address ?? "Chưa cập nhật"}</p>
                            {r.typeRestaurantName && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                  {r.typeRestaurantName}
                                </span>
                              </div>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
                {!restLoading && apiRestaurants.length === 0 && (
                  <div className="py-20 text-center">
                    <Leaf className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-4 text-slate-500">Chưa có địa điểm yêu thích nào</p>
                    <Link to="/" className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:underline">
                      Khám phá ngay →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Lịch sử hoạt động</h2>
                {activityLog.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-slate-200 py-20 text-center">
                    <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-4 text-slate-500">Chưa có hoạt động nào</p>
                  </div>
                ) : (
                  <div className="relative space-y-4 pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200" />
                    {activityLog.map((item: any) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.id} className="relative flex items-start gap-4">
                          <div className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-emerald-200 shadow-sm">
                            <Icon className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="ml-6 flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-slate-900">{item.text}</p>
                            <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="h-16" />
    </main>
  );
}
