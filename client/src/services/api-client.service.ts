import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

import { API_BASE_URL } from '@/constants/bond.constants';

type NestErrorResponse = {
  message: string | string[];
  statusCode: number;
};

function isNestErrorResponse(
  responseBody: unknown,
): responseBody is NestErrorResponse {
  return (
    typeof responseBody === 'object' &&
    responseBody !== null &&
    'message' in responseBody &&
    'statusCode' in responseBody
  );
}

function extractServerErrorMessage(errorResponse: AxiosError): string {
  const responseBody: unknown = errorResponse.response?.data;

  if (isNestErrorResponse(responseBody)) {
    const nestMessage = responseBody.message;
    return Array.isArray(nestMessage) ? nestMessage.join('. ') : nestMessage;
  }

  return 'An unexpected error occurred. Please try again.';
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (successResponse: AxiosResponse) => successResponse,
  (requestError: AxiosError) => {
    if (requestError.response) {
      return Promise.reject(
        new Error(extractServerErrorMessage(requestError)),
      );
    }

    return Promise.reject(
      new Error('Network error. Please check your connection.'),
    );
  },
);

export { apiClient };
