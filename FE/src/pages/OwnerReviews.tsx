import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OwnerLayout from "@/components/OwnerLayout";

type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
};

export default function OwnerReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "review-1",
      name: "Nguyễn Văn An",
      rating: 5,
      date: "15/5/2026",
      comment: "Đồ ăn rất ngon, không gian đẹp, nhân viên nhiệt tình. Mình đã thử món bún riêu chay và phở chay, cả hai đều tuyệt vời!",
    },
    {
      id: "review-2",
      name: "Lê Thị Cẩm",
      rating: 4,
      date: "18/5/2026",
      comment: "Không gian quán sạch và yên tĩnh, phù hợp gặp gỡ bạn bè. Món ăn ngon, nước dùng đậm đà.",
    },
  ]);
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const authData = localStorage.getItem("authUser");
    if (!authData) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(authData) as { email: string; label: string };
      if (parsed.label !== "Chủ quán") {
        navigate("/");
      }
    } catch {
      localStorage.removeItem("authUser");
      navigate("/login");
    }
  }, [navigate]);

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) {
      alert("Vui lòng nhập phản hồi.");
      return;
    }
    setReviews((current) =>
      current.map((review) =>
        review.id === reviewId ? { ...review, reply: replyText.trim() } : review
      )
    );
    setActiveReply(null);
    setReplyText("");
  };

  return (
    <OwnerLayout
      profile={
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60"
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            Trần Thị Bình
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            ↩ Đăng xuất
          </Link>
        </div>
      }
    >
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl">
          <div className="mb-8 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Đánh giá từ khách hàng</p>
            <h1 className="text-4xl font-extrabold text-slate-900">Đánh giá từ khách hàng</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Xem và trả lời các đánh giá về quán của bạn.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Đánh giá TB</p>
              <p className="mt-4 text-4xl font-extrabold text-slate-900">4.5</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Tổng đánh giá</p>
              <p className="mt-4 text-4xl font-extrabold text-slate-900">2</p>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Đánh giá tích cực</p>
              <p className="mt-4 text-4xl font-extrabold text-slate-900">2</p>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 shadow-sm">
            <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-semibold text-slate-700">Phân bố đánh giá</p>
              <div className="space-y-3 text-sm text-slate-600">
                {[
                  { star: 5, value: 1, width: "80%" },
                  { star: 4, value: 1, width: "60%" },
                  { star: 3, value: 0, width: "0%" },
                  { star: 2, value: 0, width: "0%" },
                  { star: 1, value: 0, width: "0%" },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-slate-700">{item.star} ★</div>
                    <div className="h-3 flex-1 rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: item.width }} />
                    </div>
                    <div className="w-8 text-right text-sm font-semibold text-slate-700">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-semibold text-slate-900">Tất cả đánh giá</p>
              <Link
                to="/manage"
                className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Quay lại quản lý quán
              </Link>
            </div>

            <article className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-200" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                        <div className="mt-1 flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: review.rating }, () => "★").join("")}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">{review.date}</p>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>

                  {review.reply ? (
                    <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Phản hồi của quán</p>
                      <p className="mt-2">{review.reply}</p>
                    </div>
                  ) : null}

                  {!review.reply ? (
                    <div className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-sm">
                      <label className="text-sm font-semibold text-slate-700">Trả lời đánh giá</label>
                      <textarea
                        value={activeReply === review.id ? replyText : ""}
                        onChange={(e) => {
                          setActiveReply(review.id);
                          setReplyText(e.target.value);
                        }}
                        rows={3}
                        className="mt-3 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        placeholder="Viết phản hồi cho khách hàng..."
                      />
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleReply(review.id)}
                          className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          Gửi phản hồi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReply(null);
                            setReplyText("");
                          }}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </article>
          </div>
        </div>
      </section>
    </OwnerLayout>
  );
}
