import { setToken } from "../utils/storage";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login gagal");
  const data = (await res.json()) as { data: { access_token: string } };
  const token = data?.data?.access_token;
  if (!token) throw new Error("Token tidak ditemukan");
  setToken(token); // now stored in sessionStorage via storage util
  return data;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Registrasi gagal");
  // If backend returns access_token similar to login, persist it; otherwise just return response
  const data = await res.json();
  const maybeToken = data?.data?.access_token || data?.token;
  if (maybeToken) setToken(maybeToken);
  return data as any;
}

// 👉 INI YANG KURANG: ambil profil user yang sedang login
export type MeResponse = { email: string };

export async function getUser(): Promise<MeResponse> {
  // token is now consistently read by the backend via Authorization header set here
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Gagal mengambil data user");

  return res.json() as Promise<MeResponse>;
}
