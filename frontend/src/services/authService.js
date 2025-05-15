const API_BASE_URL = "/api/auth";

export async function register(data) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(data),
    credentials: "include"
  });
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(data),
    credentials: "include"
  });
  return res.json();                // { accessToken, user }
}

export async function refresh() {
  const res = await fetch(`${API_BASE_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok ? res.json() : null;
}

export async function logout() {
  await fetch(`${API_BASE_URL}/logout`, { method: "POST", credentials: "include" });
}
