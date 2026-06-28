import { Search, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import type { AccountStatus, Role } from "@/types/auth";
import {
  getAdminUsers,
  suspendUser,
  activeUser,
  createAdminAccount,
  type AdminUser,
  type CreateAdminAccountPayload,
} from "@/services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/services/api.service";

const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  OWNER: "Chủ quán",
  USER: "Người dùng",
};

const statusLabels: Record<AccountStatus, string> = {
  ACTIVE: "Hoạt động",
  SUSPENDED: "Tạm khóa",
  PENDING: "Chờ duyệt",
};

const statusClassNames: Record<AccountStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  SUSPENDED: "bg-red-50 text-red-700 ring-red-100",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-100",
};

const roleClassNames: Record<Role, string> = {
  ADMIN: "bg-slate-900 text-white",
  OWNER: "bg-blue-50 text-blue-700",
  USER: "bg-purple-50 text-purple-700",
};

const initialCreateAdminForm: CreateAdminAccountPayload = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
};

export default function AdminUsers() {
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(6);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [statusFilter, setStatusFilter] =
    useState<AccountStatus | "ALL">("ALL");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const actionInFlightRef = useRef(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState<CreateAdminAccountPayload>(
    initialCreateAdminForm,
  );

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers({
        page,
        size,
        keyword: debouncedQuery,
        role: roleFilter,
        status: statusFilter,
      });

      setUsersList(data.content || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Đã xảy ra lỗi khi lấy danh sách người dùng."));
    } finally {
      setLoading(false);
    }
  }, [page, size, debouncedQuery, roleFilter, statusFilter]);

  useEffect(() => {
    void Promise.resolve().then(fetchUsers);
  }, [fetchUsers]);

  const resetCreateForm = () => {
    setCreateForm(initialCreateAdminForm);
  };

  const handleCreateAdmin = async () => {
    const payload = {
      email: createForm.email.trim(),
      password: createForm.password,
      fullName: createForm.fullName.trim(),
      phone: createForm.phone.trim(),
    };

    if (!payload.email || !payload.password || !payload.fullName || !payload.phone) {
      toast.error("Vui lòng nhập đầy đủ email, mật khẩu, họ tên và số điện thoại.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(payload.email)) {
      toast.error("Định dạng email không hợp lệ.");
      return;
    }

    setCreateLoading(true);
    try {
      await createAdminAccount(payload);
      toast.success(`Đã tạo tài khoản admin "${payload.fullName}" thành công.`);
      setCreateOpen(false);
      resetCreateForm();
      await fetchUsers();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể tạo tài khoản admin. Vui lòng thử lại."));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!targetUser || actionInFlightRef.current) return;

    const userId = targetUser.id;
    const userName = targetUser.fullName;
    const isActivating = targetUser.status === "SUSPENDED";

    actionInFlightRef.current = true;
    setActionLoading(true);

    try {
      if (isActivating) {
        await activeUser(userId);
      } else {
        await suspendUser(userId);
      }

      toast.success(
        isActivating
          ? `Kích hoạt tài khoản "${userName}" thành công.`
          : `Tạm khóa tài khoản "${userName}" thành công.`,
      );
      setConfirmOpen(false);
      setTargetUser(null);
      await fetchUsers();
    } catch (err) {
      console.error("Admin user status update failed:", err);
      toast.error(getApiErrorMessage(err, "Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại."));
    } finally {
      actionInFlightRef.current = false;
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout title="Quản lý người dùng">
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
              Quản lý người dùng
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Theo dõi tài khoản, vai trò và trạng thái người dùng trong hệ
              thống.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <ShieldCheck className="h-5 w-5" />
            Tạo tài khoản
          </button>
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* FILTER */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc email"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value as Role | "ALL");
                  setPage(0);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="ADMIN">{roleLabels.ADMIN}</option>
                <option value="OWNER">{roleLabels.OWNER}</option>
                <option value="USER">{roleLabels.USER}</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as AccountStatus | "ALL");
                  setPage(0);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">{statusLabels.ACTIVE}</option>
                <option value="SUSPENDED">{statusLabels.SUSPENDED}</option>
              </select>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left">
              <thead>
                <tr className="text-sm text-slate-500">
                  <th className="px-6 py-4 font-semibold">Người dùng</th>
                  <th className="px-6 py-4 font-semibold">Vai trò</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold">Ngày tham gia</th>
                  <th className="px-6 py-4 text-right font-semibold">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      Đang tải...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  usersList.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100">
                      {/* USER + AVATAR */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                              {user.fullName
                                .split(" ")
                                .filter(Boolean)
                                .slice(-2)
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-slate-950">
                              {user.fullName}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${roleClassNames[user.role]}`}
                        >
                          {roleLabels[user.role]}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClassNames[user.status]}`}
                        >
                          {statusLabels[user.status]}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user.joinedDate}
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => {
                            setTargetUser(user);
                            setConfirmOpen(true);
                          }}
                          disabled={actionLoading && targetUser?.id === user.id}
                          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${user.status === "SUSPENDED"
                            ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                            : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            }`}
                        >
                          {user.status === "SUSPENDED"
                            ? "Kích hoạt"
                            : "Khóa"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (createLoading) return;
          setCreateOpen(open);
          if (!open) resetCreateForm();
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản Admin</DialogTitle>
            <DialogDescription className="text-slate-500">
              Nhập thông tin tài khoản quản trị mới cho hệ thống.
            </DialogDescription>
          </DialogHeader>

          <form
            className="mt-4 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleCreateAdmin();
            }}
          >
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                value={createForm.email}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                disabled={createLoading}
                placeholder="admin_new@chaynow.com"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Mật khẩu
              <input
                type="password"
                value={createForm.password}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                disabled={createLoading}
                placeholder="Nhập mật khẩu"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Họ và tên
              <input
                value={createForm.fullName}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                disabled={createLoading}
                placeholder="System Admin 2"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Số điện thoại
              <input
                type="tel"
                value={createForm.phone}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                disabled={createLoading}
                placeholder="0987654321"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </label>

            <DialogFooter className="mt-2 flex flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  resetCreateForm();
                }}
                disabled={createLoading}
                className="rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createLoading}
                className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {createLoading ? "Đang tạo..." : "Tạo tài khoản"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DIALOG */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-950 p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle>
              {targetUser?.status === "SUSPENDED"
                ? "Kích hoạt tài khoản"
                : "Khóa tài khoản"}
            </DialogTitle>

            <DialogDescription className="text-slate-500">
              Bạn có chắc chắn muốn{" "}
              {targetUser?.status === "SUSPENDED"
                ? "kích hoạt lại"
                : "khóa"}{" "}
              tài khoản của{" "}
              <strong className="text-slate-900">
                {targetUser?.fullName}
              </strong>{" "}
              ({targetUser?.email}) không?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setTargetUser(null);
              }}
              disabled={actionLoading}
              className="rounded-xl px-4 py-2"
            >
              Hủy
            </Button>

            <Button
              type="button"
              variant={
                targetUser?.status === "SUSPENDED"
                  ? "default"
                  : "destructive"
              }
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className={`rounded-xl px-4 py-2 font-semibold ${targetUser?.status === "SUSPENDED"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
