import axios, { AxiosRequestConfig, Method } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

interface ApiConnectorParams {
  method: Method;
  params?: Record<string, any>;
  bodyData?: any;
  headers?: Record<string, string>;
  url: string;
}

export const apiConnector = ({
  method,
  params,
  bodyData,
  headers,
  url,
}: ApiConnectorParams) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    params: params || undefined,
    data: bodyData || undefined,
    headers: headers || undefined,
  };

  return axiosInstance(config);
};
