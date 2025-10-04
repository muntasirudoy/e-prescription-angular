import type { ApiBaseResponse } from '../service/generic-models/models';

export interface ApiResponse<T> extends ApiBaseResponse {
  results: T;
}

export interface ApiResponseList<T> extends ApiBaseResponse {
  results: T[];
}
