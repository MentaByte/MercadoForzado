const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";

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
