import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

const fakeUsers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an@gmail.com",
    phone: "0901234567",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "active",
    joinDate: "2026-05-01",
  },
  {
    id: 2,
    name: "Lê Thị Cẩm",
    email: "cam@gmail.com",
    phone: "0908888888",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "blocked",
    joinDate: "2026-05-02",
  },
  {
    id: 3,
    name: "Trần Minh Khang",
    email: "khang@gmail.com",
    phone: "0909999999",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "active",
    joinDate: "2026-05-10",
  },
];

export default function UserManagement() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState(fakeUsers);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchKeyword =
        user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [keyword, statusFilter, users]);

  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "active"
                  ? "blocked"
                  : "active",
            }
          : user
      )
    );
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Xóa người dùng này?")) return;

    setUsers((prev) =>
      prev.filter((user) => user.id !== id)
    );
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
              {users.length}
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
            <p className="text-slate-500 text-sm">
              Đang hoạt động
            </p>
            <p className="mt-3 text-3xl font-bold text-green-600">
              {
                users.filter(
                  (u) => u.status === "active"
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
                  (u) => u.status === "blocked"
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
                setStatusFilter(e.target.value)
              }
              className="rounded-2xl border px-4 py-3"
            >
              <option value="all">
                Tất cả trạng thái
              </option>

              <option value="active">
                Active
              </option>

              <option value="blocked">
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
                  Số điện thoại
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        className="h-12 w-12 rounded-full"
                      />

                      <div>
                        <p className="font-semibold">
                          {user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {user.phone}
                  </td>

                  <td className="p-4">
                    {user.joinDate}
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          handleToggleStatus(
                            user.id
                          )
                        }
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-white"
                      >
                        {user.status ===
                        "active"
                          ? "Khóa"
                          : "Mở khóa"}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        className="rounded-xl bg-red-600 px-4 py-2 text-white"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </section>
    </main>
  );
}