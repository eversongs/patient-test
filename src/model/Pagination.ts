export interface Pagination {
    colSpan: number;
    count: number;
    rowsPerPage: number;
    page: number;
}

export interface PaginationRequest {
    page: number;
    length: number;
}

export interface PaginationType {
    page: string;
    length: string;
}

export interface PageResponse<T> {

    patient: PatientResponse<T>
    totalLength: number;

}

interface PatientResponse<T> {
    list: T[];
}