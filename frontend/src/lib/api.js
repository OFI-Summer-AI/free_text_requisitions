const N8N_BASE = import.meta.env.VITE_N8N_BASE_URL;

// In production (Vercel), set VITE_API_BASE_URL to your Railway backend URL.
// In development, leave it empty — Vite's proxy handles /api → localhost:3001.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const fetchDashboard = async () => {
  const res = await fetch(`${N8N_BASE}/webhook/api/dashboard`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const text = await res.text();
  if (!text) throw new Error('n8n returned an empty response — make sure the workflow is active and returning data.');
  return JSON.parse(text);
};

// ── Railway DB: matched_catalogue table ─────────────────────────
export const fetchMatchedCatalogue = async () => {
  const res = await fetch(`${API_BASE}/api/matched-catalogue`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
};


export const submitBuyerRequisition = async (payload) => {
  const res = await fetch(`${N8N_BASE}/webhook/buyer-requisition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return await res.json();
};

export const submitBuyerDecision = async (payload) => {
  const res = await fetch(`${N8N_BASE}/webhook/buyer-decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return await res.json();
};
