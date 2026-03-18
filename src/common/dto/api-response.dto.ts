export class ApiResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  errors?: any[];
  timestamp: string;
  path: string;
}
