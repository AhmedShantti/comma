export class PaginationMeta {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
}

export class ApiResponseDto<T> {
  success!: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
  meta?: PaginationMeta;
  statusCode!: number;
  timestamp!: string;
}
