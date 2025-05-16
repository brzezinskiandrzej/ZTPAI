const API_BASE_URL = "/api/auth";

export async function register(data) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method : "POST",
    headers: { "Content-Type": "application/json" },
    body   : JSON.stringify(data),
    credentials: "include"
  });
  const contentType = res.headers.get("content-type");
  let responseData;
  if (contentType?.includes("application/json")) {
    responseData = await res.json();
  } else {
    const text = await res.text();
    throw new Error(`Nieprawidłowy format odpowiedzi: ${text}`);
  }

  if (!res.ok) {
    throw {
      status: res.status,
      data: responseData,
      isApiError: true
    };
  }
  return responseData;
}

export async function login(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(data),
      credentials: "include"
    });
    const contentType = res.headers.get("content-type");
    let responseData;
    if (contentType?.includes("application/json")) {
      responseData = await res.json();
    } else {
      const textResponse = await res.text();
      throw new Error(`Nieprawidłowy format odpowiedzi: ${textResponse}`);
    }

    if (!res.ok) {
      throw {
        status: res.status,
        data: responseData,
        isApiError: true
      };
    }
    return responseData;             
  }catch (error) {
    if (!error.isApiError) {
      // Błąd sieciowy
      throw {
        status: 500,
        data: { error: { code: "network-error", message: "Błąd połączenia" } }
      };
    }
    throw error;
  }
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
