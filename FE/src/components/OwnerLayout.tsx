import Navbar from "@/components/Navbar";
import type { ReactNode } from "react";

type OwnerLayoutProps = {
  children: ReactNode;
  profile?: ReactNode;
};

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 py-10">{children}</section>
    </main>
  );
}
