/**
 * Base API Types
 * 
 * Types compartidos para toda la capa de API.
 * Sigue Interface Segregation Principle: tipos específicos y minimalistas.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  detail: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

/**
 * HTTP Methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
