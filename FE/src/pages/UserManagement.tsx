import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { activeUser, getAdminUsers, suspendUser, type AdminUser } from "@/services/admin.service";
import type { AccountStatus } from "@/types/auth";



export default function UserManagement() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AccountStatus | "all">("all");
 const [users, setUsers] = useState<AdminUser[]>([]);
const [loading, setLoading] = useState(false);

const [page, setPage] = useState(0);
const [size] = useState(10);

const [totalPages, setTotalPages] = useState(0);
const [totalElements, setTotalElements] = useState(0);

const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);

    const status: AccountStatus | "ALL" =
      statusFilter === "all" ? "ALL" : statusFilter;

    const res = await getAdminUsers({
      page,
      size,
      keyword,
      status,
    });

    setUsers(res.content);
    setTotalPages(res.totalPages);
    setTotalElements(res.totalElements);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [keyword, page, size, statusFilter]);

useEffect(() => {
  // Fetching remote data is the synchronization performed by this effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void fetchUsers();
}, [fetchUsers]);


const   handleToggleStatus = async (
  user: AdminUser
) => {
  try {
    if (user.status === "ACTIVE") {
      await suspendUser(user.id);
    } else {
      await activeUser(user.id);
    }

    void fetchUsers();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            User Management
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-slate-900">
            Quản lý người dùng
          </h1>
        </div>


        <div className="grid gap-6 lg:grid-cols-4 mb-8">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">
              Tổng người dùng
            </p>
            <p className="mt-3 text-3xl font-bold">
              {loading ? "..." : totalElements}
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">
              Đang hoạt động
            </p>
            <p className="mt-3 text-3xl font-bold text-green-600">
              {
                users.filter(
                  (u) => u.status === "ACTIVE"
                ).length
              }
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">
              Đã khóa
            </p>
            <p className="mt-3 text-3xl font-bold text-red-600">
              {
              users.filter(
u=>u.status==="SUSPENDED"
).length
              }
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">
              User mới
            </p>
            <p className="mt-3 text-3xl font-bold text-blue-600">
              12
            </p>
          </div>
        </div>


        <div className="rounded-[2rem] bg-white p-6 shadow-sm border mb-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <input
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
              placeholder="Tìm kiếm tên hoặc email..."
              className="rounded-2xl border px-4 py-3"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as AccountStatus | "all")
              }
              className="rounded-2xl border px-4 py-3"
            >
              <option value="all">
                Tất cả trạng thái
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="SUSPENDED">
                Blocked
              </option>
            </select>
          </div>
        </div>


        <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm border">

          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">
                  Người dùng
                </th>

            

                <th className="p-4 text-left">
                  Ngày tham gia
                </th>

                <th className="p-4 text-left">
                  Trạng thái
                </th>

                <th className="p-4 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
        user.avatarUrl ??
        "/images/avatar-default.png"
    }
                        className="h-12 w-12 rounded-full"
                      />

                      <div>
                        <p className="font-semibold">
                        {user.fullName} 
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                 

                  <td className="p-4">
                    {user.joinedDate}
                  </td>

                  <td className="p-4">
                   <span
className={`rounded-full px-3 py-1 text-xs font-semibold ${
user.status==="ACTIVE"
?"bg-green-100 text-green-700"
:"bg-red-100 text-red-700"
}`}
>

{user.status==="ACTIVE"
?"Active"
:"Blocked"}

</span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
              onClick={() =>
  handleToggleStatus(user)
}                    className="rounded-xl bg-yellow-500 px-4 py-2 text-white"
                      >
                        {user.status ===
                        "ACTIVE"
                          ? "Khóa"
                          : "Mở khóa"}
                      </button>

                      <button
                        type="button"
                        disabled
                        title="Chức năng xóa chưa được hỗ trợ"
                        className="cursor-not-allowed rounded-xl bg-red-300 px-4 py-2 text-white"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<div className="flex items-center justify-between border-t p-5">

<p>

Tổng {totalElements} người dùng

</p>

<div className="flex gap-3">

<button
disabled={page===0}
onClick={()=>setPage(page-1)}
>

Previous

</button>

<button
disabled={page>=totalPages-1}
onClick={()=>setPage(page+1)}
>

Next

</button>

</div>

</div>    
        </div>
      </section>
    </main>
  );
}
