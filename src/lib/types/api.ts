export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export type ApiResponse<T = unknown> = {
  status: number;
  data: T | string | undefined;
};
