import api from '@/config/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(data: any) {
  const url = `${API_URL}/auth/login`;

  return api({
    url,
    method: 'POST',
    data,
  });
}

export async function googleLogin() {
  const url = `${API_URL}/auth/google`;

  return api({
    url,
    method: 'GET',
  });
}

export async function facebookLogin() {
  const url = `${API_URL}/auth/facebook`;

  return api({
    url,
    method: 'GET',
  });
}

export async function register(data: any) {
  const url = `${API_URL}/auth/register`;

  return api({
    url,
    method: 'POST',
    data,
  });
}

export async function logout(cookieToken: string) {
  const url = `${API_URL}/auth/logout`;

  return api({
    url,
    method: 'GET',
    useToken: true,
    cookieToken,
  });
}

export async function resendEmailVerification(cookieToken: string) {
  const url = `${API_URL}/account/verify/resend`;

  return api({
    url,
    method: 'GET',
    useToken: true,
    cookieToken,
  });
}

export async function getCurrentUser() {
  const url = `${API_URL}/account/current-user`;

  return api({
    url,
    method: 'GET',
    useToken: true,
  });
}

export async function getDashboard() {
  const url = `${API_URL}/dashboard`;

  return api({
    url,
    method: 'GET',
    useToken: true,
  });
}

export async function changeProfileName(data: any, cookieToken: string) {
  const url = `${API_URL}/account/profile/edit`;

  return api({
    url,
    method: 'PUT',
    useToken: true,
    data,
    cookieToken,
  });
}

export async function resetPassword(data: any, cookieToken: string) {
  const url = `${API_URL}/account/reset-password`;

  return api({
    url,
    method: 'PUT',
    useToken: true,
    data,
    cookieToken,
  });
}
