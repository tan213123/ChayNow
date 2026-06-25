import apiService from "@/services/api.service";

type MaybeWrapped<T> = T | { success?: boolean; data: T };

const unwrapResponse = <T>(response: MaybeWrapped<T>): T => {
    if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        "success" in response
    ) {
        return response.data;
    }

    return response as T;
};



export type ReportStatus =
    | "PENDING"
    | "RESOLVED"
    | "REJECTED";

export type ReportTargetType =
    | "RESTAURANT"
    | "POST"
    | "REVIEW"
    | "COMMENT";

export type ResolveAction =
    | "ACCEPT"
    | "REJECT";



export interface ReportReporter {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
}

export interface ReportTarget {
    id: number;
    type: ReportTargetType;
    title: string;
    content: string;
    ownerId: number;
}

export interface ReportListItem {
    id: number;
    type: ReportTargetType;
    status: ReportStatus;
    reason: string;
    createdAt: string;

    reporter: ReportReporter;
    target: ReportTarget;
}

export interface ReportDetail {
    id: number;
    status: ReportStatus;
    reason: string;
    description?: string;
    createdAt: string;

    reporter: ReportReporter;
    target: ReportTarget;
}

export interface ReportStats {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    rejectedReports: number;
}

export interface ReportActionResponse {
    reportId: number;
    status: ReportStatus;
    message: string;
    resolvedAt: string;
}

export interface ResolveReportRequest {
    action: ResolveAction;
    reason?: string;
}



export interface PageResponse<T> {
    content: T[];

    page: number;
    size: number;

    totalElements: number;
    totalPages: number;

    last: boolean;
}


export interface GetReportsParams {
    page?: number;
    size?: number;
    keyword?: string;
    status?: ReportStatus;
    type?: ReportTargetType;
}


export const getReports = async (
    params: GetReportsParams
): Promise<PageResponse<ReportListItem>> => {
    const query: Record<string, string | number> = {};

    if (params.page !== undefined) query.page = params.page;
    if (params.size !== undefined) query.size = params.size;

    if (params.keyword?.trim()) {
        query.keyword = params.keyword.trim();
    }

    if (params.status) {
        query.status = params.status;
    }

    if (params.type) {
        query.type = params.type;
    }

    const response = await apiService.get<
        MaybeWrapped<PageResponse<ReportListItem>>,
        MaybeWrapped<PageResponse<ReportListItem>>
    >("/api/admin/reports", {
        params: query,
    });

    return unwrapResponse(response);
};


export const getReportStats = async (): Promise<ReportStats> => {
    const response = await apiService.get<
        MaybeWrapped<ReportStats>,
        MaybeWrapped<ReportStats>
    >("/api/admin/reports/stats");

    return unwrapResponse(response);
};

export const getReportDetail = async (
    id: number
): Promise<ReportDetail> => {
    const response = await apiService.get<
        MaybeWrapped<ReportDetail>,
        MaybeWrapped<ReportDetail>
    >(`/api/admin/reports/${id}`);

    return unwrapResponse(response);
};


export const resolveReport = async (
    id: number,
    body: ResolveReportRequest
): Promise<ReportActionResponse> => {
    const response = await apiService.patch<
        MaybeWrapped<ReportActionResponse>,
        MaybeWrapped<ReportActionResponse>
    >(`/api/admin/reports/${id}/resolve`, body);

    return unwrapResponse(response);
};



export {
    getReports as getAdminReports,
    getReportDetail as getAdminReportDetail,
    getReportStats as getAdminReportStats,
    resolveReport as resolveAdminReport,
};

export type {
    ReportListItem as AdminReport,
    ReportDetail as AdminReportDetail,
    ReportStats as AdminReportStats,
    GetReportsParams as FetchReportsParams,
};