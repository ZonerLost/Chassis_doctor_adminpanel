export function logout(redirect = true) {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("auth_token");
  } catch {
    /* ignore */
  }
  if (redirect) {
    // navigate via location so app-level auth state resets
    window.location.href = "/login";
  }
}

export function getToken() {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
}

export function isAuthenticated() {
  return !!getToken();
}
