import Navbar from "@/components/Navbar";
import ReportStats from "@/components/ReportStats";
import ReportTrendChart from "@/components/ReportTrendChart";
import ReportTypeChart from "@/components/ReportTypeChart";
import TopReportedRestaurants from "@/components/TopReportedRestaurants";
import { reports } from "@/data/reports";



export default function ReportManagement() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Report Management
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Quản lý báo cáo
          </h1>
        </div>

        <ReportStats reports={reports} />

        <div className="mt-8">
          <ReportTrendChart />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mt-8">
          <ReportTypeChart />
          <TopReportedRestaurants />
        </div>

      </section>
    </main>
  );
}