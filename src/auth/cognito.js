// ─── Cognito Config ───────────────────────────────────────────────
const CLIENT_ID = "6dl6qn0o8bkiom5gpe4c92prv3";
const DOMAIN = "https://ap-southeast-2twbc7wwaf.auth.ap-southeast-2.amazoncognito.com";
const REDIRECT_URI = "https://d3cmz05dxse9w6.cloudfront.net/";

// ─── 🔐 Redirect to Cognito Hosted Login UI ───────────────────────
export function login() {
  const url =
    `${DOMAIN}/login` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&scope=openid+email+profile` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  console.log("[Cognito] Redirecting to login:", url);
  window.location.href = url;
}

// ─── 🚪 Logout: clear local session THEN hit Cognito logout ───────
export function logout() {
  // 1. Wipe all local session data
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  sessionStorage.clear();

  // 2. Redirect to Cognito hosted logout so SSO session also dies
  const url =
    `${DOMAIN}/logout` +
    `?client_id=${CLIENT_ID}` +
    `&logout_uri=${encodeURIComponent(REDIRECT_URI + "/login")}`;

  console.log("[Cognito] Logging out:", url);
  window.location.href = url;
}

// ─── 🎟 Extract ?code= from URL after Cognito redirect ────────────
export function getAuthCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

// ─── ✅ Check if the user has an active local session ─────────────
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// ─── 🎟 Get stored token ──────────────────────────────────────────
export function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

// ─── (legacy compat) ─────────────────────────────────────────────
export function getSession() {
  return { isValid: () => isAuthenticated() };
}