import axios, { AxiosRequestConfig } from 'axios';

interface APIProps extends AxiosRequestConfig {
  useToken?: boolean;
  cookieToken?: string;
}

const api = async ({ url, data, method, useToken = false, cookieToken }: APIProps) => {
  let headers = {};
  let token;

  if (!cookieToken && useToken) {
    const { cookies: serverCookies } = await import('next/headers');
    token = serverCookies().get('token')?.value;
  } else {
    token = cookieToken;
  }

  if (useToken) {
    if (token) {
      headers = {
        Authorization: `Bearer ${token}`,
      };
    }
  }

  const response = await axios({
    url,
    method,
    data,
    headers,
    withCredentials: true,
  }).catch((err) => err.response);

  if (response.status > 300) {
    const res = {
      error: true,
      status: response.status,
      message: response.data.errors ? response.data.errors[0].message : response.data.message,
      data: null,
    };

    return res;
  }

  const { length } = Object.keys(response.data);

  const res = {
    error: false,
    status: response.status,
    message: response.data.message,
    data: length > 1 ? response.data : response.data.data,
  };

  return res;
};

export default api;
