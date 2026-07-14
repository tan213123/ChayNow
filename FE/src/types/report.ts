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
