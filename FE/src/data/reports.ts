export type ReportStatus = "pending" | "processing" | "resolved";

export interface Report {
    id: string;
    reporter: string;
    target: string;
    type: string;
    status: ReportStatus;
    description: string;
    createdAt: string;
}

export const reports: Report[] = [
    {
        id: "RP001",
        reporter: "Nguyễn Văn An",
        target: "Quán Chay Sen",
        type: "Spam",
        status: "pending",
        description: "Đăng bài quảng cáo quá nhiều.",
        createdAt: "2026-05-10",
    },
    {
        id: "RP002",
        reporter: "Lê Thị Cẩm",
        target: "Quán Chay An Lạc",
        type: "Review giả",
        status: "processing",
        description: "Có dấu hiệu tự tạo review.",
        createdAt: "2026-05-12",
    },
    {
        id: "RP003",
        reporter: "Trần Minh Khang",
        target: "Quán Chay Bồ Đề",
        type: "Phản cảm",
        status: "resolved",
        description: "Bình luận xúc phạm khách hàng.",
        createdAt: "2026-05-15",
    },
];
