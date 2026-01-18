/**
 * Base API Client
 * 
 * Centralized HTTP client with interceptors and error handling.
 * Follows Single Responsibility Principle: only handles HTTP communication.
 * Follows Dependency Inversion Principle: depends on abstractions (RequestConfig).
 */

import { createApiError, ApiError } from './api-error';
import type { ApiResponse, RequestConfig, HttpMethod } from './api-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE_PATH = '/api/v1';

/**
 * Default timeout for requests (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Base API Client class
 * 
 * Handles all HTTP communication with the backend API.
 * Provides methods for GET, POST, PATCH, PUT, DELETE.
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get full URL for endpoint
   */
  private getUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
return `${this.baseUrl}${API_BASE_PATH}/${cleanEndpoint}`;
  }

  /**
   * Create AbortController with timeout
   */
  private createAbortController(timeout?: number): AbortController {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || DEFAULT_TIMEOUT);
    
    // Clean up timeout when request completes
    controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));
    
    return controller;
  }

  /**
   * Base request method
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    config?: RequestConfig & { body?: unknown }
  ): Promise<T> {
    const url = this.getUrl(endpoint);
    const controller = this.createAbortController(config?.timeout);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      signal: config?.signal || controller.signal,
    };

    if (config?.body && method !== 'GET') {
      requestOptions.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw await createApiError(response);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      const data: ApiResponse<T> | T = await response.json();
      
      // Handle wrapped responses
      if (typeof data === 'object' && data !== null && 'data' in data) {
        return (data as ApiResponse<T>).data;
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(
          'Request timeout',
          408,
          'Request Timeout'
        );
      }

      // Handle other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'Network Error'
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, config);
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('POST', endpoint, { ...config, body });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...config, body });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...config, body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, config);
  }
}

/**
 * Singleton instance of API client
 * 
 * Single instance ensures consistent configuration across the app.
 */
export const apiClient = new ApiClient();
