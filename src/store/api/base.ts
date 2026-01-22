import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Gets the OpenWeather API base URL
const getBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_OPENWEATHER_BASE_URL is not set");
  }
  return baseUrl;
};

/**
 * Creates the base query with lazy URL validation.
 * This allows the app to boot even if the environment variable is temporarily missing.
 */
const createBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers: Headers) => {
      return headers;
    },
  });
};

/**
 * Base query with transport-level error handling.
 * Handles generic HTTP errors and response parsing.
 * Domain-specific validation (e.g., OpenWeatherMap cod field) should be handled
 * in endpoint-specific transformErrorResponse hooks.
 */
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = createBaseQuery();
  const result = await baseQuery(args, api, extraOptions);

  // Handle transport-level errors
  if (result.error) {
    // Check if error response contains OpenWeather API error format (has 'cod' field)
    // If so, treat it as a successful response so transformResponse can handle it
    const errorData = parseErrorData(result.error.data);
    
    if (errorData && typeof errorData === 'object' && 'cod' in errorData) {
      // This is an OpenWeather API error response, return it as success
      // so transformResponse can convert it to empty ForecastView
      return {
        data: errorData,
      };
    }

    // For other errors, return as error
    const errorMessage = extractErrorMessage(errorData, result.error);
    return {
      error: {
        ...result.error,
        data: errorMessage,
      } as FetchBaseQueryError,
    };
  }

  return result;
};

// Parses error data from various formats (string, object, etc.)
const parseErrorData = (data: unknown): unknown => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

// Extracts a user-friendly error message from error data
const extractErrorMessage = (errorData: unknown, error: FetchBaseQueryError): string => {
  if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
    const message = (errorData as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  if (typeof errorData === 'string') {
    return errorData;
  }

  // Handle different error status types
  if ('status' in error) {
    if (typeof error.status === 'number') {
      return error.status === 404 ? 'Resource not found' : 'Request failed';
    }
    // Handle string status types like "FETCH_ERROR", "PARSING_ERROR", etc.
    if (error.status === 'FETCH_ERROR') {
      return 'Network error occurred';
    }
    if (error.status === 'PARSING_ERROR') {
      return 'Failed to parse response';
    }
    if (error.status === 'TIMEOUT_ERROR') {
      return 'Request timed out';
    }
  }

  return 'Request failed';
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: ["Weather"],
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});
