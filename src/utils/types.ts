import type { InternalAxiosRequestConfig } from "axios";

export interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

export interface TokenResponse {
  data: {
    tokens: {
      access: string;
      refresh: string;
    };
  };
}
