import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_OPENWEATHER_BASE_URL is not set");
}

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers: Headers) => {
    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if ('status' in result.error) {
      try {
        let errorData: any = result.error.data;

        if (typeof errorData === 'string') {
          try {
            errorData = JSON.parse(errorData);
          } catch {
            // Parsing failed
          }
        }

        if (errorData) {
          if (typeof errorData === 'object' && errorData.message) {
            return {
              error: {
                ...result.error,
                data: errorData.message,
              },
            };
          }
          if (typeof errorData === 'string') {
            return {
              error: {
                ...result.error,
                data: errorData,
              },
            };
          }
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }

      const defaultMessage = result.error.status === 404 ? 'City not found' : 'Failed to fetch weather data';
      return {
        error: {
          ...result.error,
          data: defaultMessage,
        },
      };
    }
  }

  if (result.data && typeof result.data === 'object' && 'cod' in result.data) {
    const data = result.data as any;
    if (data.cod && String(data.cod) !== '200') {
      const errorStatus = typeof data.cod === 'number' ? data.cod : parseInt(data.cod, 10);
      return {
        error: {
          status: isNaN(errorStatus) ? 400 : errorStatus,
          data: data.message || 'City not found',
        },
      };
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  tagTypes: ["Weather"],
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});
