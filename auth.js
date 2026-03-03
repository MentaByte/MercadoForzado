const SUPABASE_URL = "https://zgatennqbagmyfbpiakr.supabase.co";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnYXRlbm5xYmFnbXlmYnBpYWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMTg3NTEsImV4cCI6MjA4NjU5NDc1MX0.5c_IoL3_PM1zwFsuvblkoCoWbP9-4BSaMcIwSasLprw";

// Genera o recupera el device_id del dispositivo
export function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

export async function activateLicense(code) {
  const device_id = getDeviceId();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, device_id }),
  });
  return res.json();
}

export async function validateSession() {
  const session_token = localStorage.getItem("session_token");
  const device_id = getDeviceId();

  if (!session_token) return { valid: false };

  const res = await fetch(`${SUPABASE_URL}/functions/v1/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_token, device_id }),
  });
  return res.json();
}

export function saveSession(token) {
  localStorage.setItem("session_token", token);
}

export function clearSession() {
  localStorage.removeItem("session_token");
}
