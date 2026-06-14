import { Link } from "react-router-dom";
import OwnerLayout from "@/components/OwnerLayout";

export default function OwnerNewDish() {
  return (
    <OwnerLayout>
      <section className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-amber-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            Thực đơn
          </p>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
            Chưa có API quản lý món ăn
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Swagger hiện không cung cấp endpoint tạo, sửa, xóa hoặc tải danh
            sách món ăn. FE không lưu tạm món ăn vào localStorage để tránh hiển
            thị dữ liệu không tồn tại trên hệ thống.
          </p>
          <Link
            to="/manage"
            className="mt-7 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Quay lại dashboard
          </Link>
        </div>
      </section>
    </OwnerLayout>
  );
}
