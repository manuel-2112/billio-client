/**
 * API Error Handling
 * 
 * Centralized error handling for API requests.
 * Follows Single Responsibility Principle: only handles API errors.
 */

import type { ApiErrorResponse } from './api-types';

/**
 * Custom API Error class
 * 
 * Extends Error with API-specific information.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly response?: ApiErrorResponse;
  public readonly code?: string;

  constructor(
    message: string,
    status: number,
    statusText: string,
    response?: ApiErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.code = response?.code;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return this.status === 0 || this.message.includes('fetch');
  }
}

/**
 * Create ApiError from fetch Response
 */
export async function createApiError(response: Response): Promise<ApiError> {
  let errorResponse: ApiErrorResponse;

  try {
    const parsed = await response.json();
    errorResponse = parsed as ApiErrorResponse;
  } catch {
    // If response is not JSON, use status text as detail
    errorResponse = {
      detail: response.statusText || 'Unknown error',
    };
  }

  return new ApiError(
    errorResponse.detail || `HTTP ${response.status}: ${response.statusText}`,
    response.status,
    response.statusText,
    errorResponse
  );
}
