import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type OwnerLayoutProps = {
  children: ReactNode;
  profile?: ReactNode;
};

export default function OwnerLayout({ children, profile }: OwnerLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 text-emerald-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🌱</div>
            <span className="font-semibold">Chay TPHCM</span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-slate-600">
            <Link to="/" className="flex items-center gap-2 font-medium text-slate-900">
              <span>🏠</span> Trang chủ
            </Link>
            <Link to="/favorites" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <span>♥</span> Yêu thích
            </Link>
            <Link to="/manage/restaurants" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <span>🏪</span> Quản lý quán
            </Link>
          </nav>

          {profile ?? null}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">{children}</section>
    </main>
  );
}
