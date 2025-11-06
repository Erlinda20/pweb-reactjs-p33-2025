import { getToken } from "../utils/storage";

const BASE_URL = "http://localhost:3000/api"; // sesuaikan kalau perlu

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login gagal");
  return res.json() as Promise<{ token: string }>;
}

export async function register(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Registrasi gagal");
  return res.json();
}

// 👉 INI YANG KURANG: ambil profil user yang sedang login
export type MeResponse = { email: string };

export async function getUser(): Promise<MeResponse> {
  const token = getToken();
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Gagal mengambil data user");

  return res.json() as Promise<MeResponse>;
}
