import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "@/services/auth.service";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Không tìm thấy mã xác thực.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Email của bạn đã được xác thực thành công!");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(err.message || "Xác thực email thất bại.");
      });
  }, [token]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-24 px-4">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 text-center border border-slate-100">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mb-4" />
              <h2 className="text-xl font-bold text-slate-900">Đang xác thực...</h2>
              <p className="mt-2 text-slate-500">Vui lòng chờ trong giây lát</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900">Xác thực thành công!</h2>
              <p className="mt-2 text-slate-500">{message}</p>
              <Link
                to="/profile"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 w-full"
              >
                Về trang cá nhân
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900">Xác thực thất bại</h2>
              <p className="mt-2 text-slate-500">{message}</p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 w-full"
              >
                Về trang chủ
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
