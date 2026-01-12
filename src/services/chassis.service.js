import {
  SYMPTOMS,
  CAUSES,
  FIXES,
  TRACK_TYPES,
  DIAGNOSTIC_RULES,
} from "./chassis.fixtures";

// Utilities to simulate persistence (in-memory)
const db = {
  symptoms: [...SYMPTOMS],
  causes: [...CAUSES],
  fixes: [...FIXES],
  tracks: [...TRACK_TYPES],
  rules: [...DIAGNOSTIC_RULES],
};

const sleep = (ms = 120) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------- Symptoms ------------------------------- */
export async function listSymptoms({ query = "" } = {}) {
  await sleep();
  const q = query.trim().toLowerCase();
  const rows = !q
    ? db.symptoms
    : db.symptoms.filter((s) =>
        [s.name, s.description].some((v) => String(v).toLowerCase().includes(q))
      );
  return { data: rows, total: rows.length };
}

export async function upsertSymptom(symptom) {
  await sleep();
  const idx = db.symptoms.findIndex((s) => s.id === symptom.id);
  if (idx >= 0) db.symptoms[idx] = { ...db.symptoms[idx], ...symptom };
  else db.symptoms.push({ ...symptom, id: `s_${Date.now()}` });
  return symptom;
}

/* -------------------------------- Tracks -------------------------------- */
export async function listTracks() {
  await sleep();
  return { data: db.tracks, total: db.tracks.length };
}
export async function upsertTrack(track) {
  await sleep();
  const idx = db.tracks.findIndex((t) => t.id === track.id);
  if (idx >= 0) db.tracks[idx] = { ...db.tracks[idx], ...track };
  else db.tracks.push({ ...track, id: `t_${Date.now()}` });
  return track;
}

/* -------------------------------- Rules --------------------------------- */
export async function listRules({ symptomId, trackTypeId } = {}) {
  await sleep();
  let rows = db.rules;
  if (symptomId) rows = rows.filter((r) => r.symptomId === symptomId);
  if (trackTypeId)
    rows = rows.filter((r) =>
      r.trackTypeId ? r.trackTypeId === trackTypeId : true
    );
  return { data: rows, total: rows.length };
}

export async function upsertRule(rule) {
  await sleep();
  const idx = db.rules.findIndex((r) => r.id === rule.id);
  if (idx >= 0) db.rules[idx] = { ...db.rules[idx], ...rule };
  else db.rules.push({ ...rule, id: `r_${Date.now()}` });
  return rule;
}

/* ------------------------------ Dictionaries --------------------------- */
export async function listCauses() {
  await sleep();
  return { data: db.causes, total: db.causes.length };
}
export async function listFixes() {
  await sleep();
  return { data: db.fixes, total: db.fixes.length };
}

/* ------------------------------ Evaluation ----------------------------- */
export async function evaluateDiagnostic({ symptomId, trackTypeId }) {
  await sleep(80);
  const rules = db.rules.filter(
    (r) =>
      r.symptomId === symptomId &&
      (!r.trackTypeId || r.trackTypeId === trackTypeId)
  );
  if (rules.length === 0) return [];
  const score = new Map();
  rules.forEach((r) =>
    score.set(r.fixId, (score.get(r.fixId) || 0) + (r.weight || 1))
  );
  const total = Array.from(score.values()).reduce((a, b) => a + b, 0) || 1;
  const fixes = Array.from(score.entries())
    .map(([fixId, w]) => ({
      fix: db.fixes.find((f) => f.id === fixId),
      weight: w,
      pct: Math.round((w / total) * 100),
    }))
    .sort((a, b) => b.weight - a.weight);
  return fixes;
}
