import { BASE_URL } from '@/utils/api';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends a tablet photo to the backend AI endpoint (Phase 3).
 * Expected response: { medicineId, quantity, confidence }
 * Falls back to a clearly flagged demo result until that endpoint exists.
 */
export async function scanMedicineImage(file, medicines) {
  try {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${BASE_URL}/api/ai/scan`, { method: 'POST', body: form });
    if (res.ok) return { ...(await res.json()), isDemo: false };
  } catch {
    // endpoint not available yet, use demo result
  }

  await wait(1200);
  const name = file.name.toLowerCase();
  const stocked = medicines.filter((m) => m.quantity > 0);
  const match = stocked.find((m) => name.includes(m.name.toLowerCase().split(' ')[0]));
  const pick = match ?? stocked[Math.floor(Math.random() * stocked.length)];
  return { medicineId: pick.id, quantity: 1, confidence: null, isDemo: true };
}