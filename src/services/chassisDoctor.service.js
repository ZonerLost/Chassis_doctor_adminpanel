/*
 * Service layer for chassis doctor data access, shaping, and error translation.
 * Centralizes API interaction details so UI components remain focused on presentation logic.
 */

import { supabase } from "../lib/supabaseClient";

const TABLES = {
  symptoms: "chassis_symptoms",
  sets: "chassis_adjustment_sets",
  issues: "chassis_issue_options",
  setIssues: "chassis_adjustment_set_issue_options",
  recommendations: "adjustment_recommendations",
  setRecommendations: "chassis_adjustment_set_recommendations",
  presets: "track_config_presets",
  setPresets: "chassis_adjustment_set_track_presets",
};

function toUiId(value) {
  return value == null ? "" : String(value);
}

function mapRows(data, mapper) {
  return (data || []).map(mapper);
}

function throwIfError(error, fallbackMessage) {
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }
}

function mapSymptom(row) {
  return {
    id: toUiId(row.id),
    name: row.name || row.title || "",
    description: row.description || row.details || "",
    isActive: row.is_active ?? row.isActive ?? true,
    raw: row,
  };
}

function mapSet(row) {
  return {
    id: toUiId(row.id),
    title: row.title || row.name || "",
    isActive: row.is_active ?? row.isActive ?? true,
    createdAt: row.created_at || row.createdAt || null,
    raw: row,
  };
}

function mapIssue(row) {
  return {
    id: toUiId(row.id),
    name: row.name || row.title || "",
    description: row.description || row.details || "",
    isActive: row.is_active ?? row.isActive ?? true,
    raw: row,
  };
}

function mapRecommendation(row) {
  return {
    id: toUiId(row.id),
    title: row.title || row.name || "",
    details: row.details || row.description || "",
    category: row.category || "Other",
    createdAt: row.created_at || row.createdAt || null,
    raw: row,
  };
}

function mapPreset(row) {
  return {
    id: toUiId(row.id),
    name: row.name || row.title || row.track_name || "Untitled preset",
    category: row.category || "",
    raw: row,
  };
}

export async function listActiveSymptoms() {
  const { data, error } = await supabase
    .from(TABLES.symptoms)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  throwIfError(error, "Failed to load symptoms");
  return mapRows(data, mapSymptom);
}

export async function createSymptom({
  title,
  description,
  isActive,
  createdBy,
}) {
  const payload = {
    title: title.trim(),
    description: description.trim(),
    is_active: Boolean(isActive),
  };

  if (createdBy) {
    payload.created_by = createdBy;
  }

  const { data, error } = await supabase
    .from(TABLES.symptoms)
    .insert(payload)
    .select("*")
    .single();

  throwIfError(error, "Failed to create symptom");
  return mapSymptom(data);
}

export async function listSetsBySymptom(symptomId) {
  if (!symptomId) return [];

  const { data, error } = await supabase
    .from(TABLES.sets)
    .select("*")
    .eq("symptom_id", symptomId)
    .order("created_at", { ascending: false });

  throwIfError(error, "Failed to load adjustment sets");
  return mapRows(data, mapSet);
}

export async function createAdjustmentSet({ symptomId, title, isActive }) {
  const payload = {
    symptom_id: symptomId,
    title: title.trim(),
    is_active: Boolean(isActive),
  };

  const { data, error } = await supabase
    .from(TABLES.sets)
    .insert(payload)
    .select("*")
    .single();

  throwIfError(error, "Failed to create adjustment set");
  return mapSet(data);
}

export async function listIssueOptionsBySymptom(symptomId) {
  if (!symptomId) return [];

  const { data, error } = await supabase
    .from(TABLES.issues)
    .select("*")
    .eq("symptom_id", symptomId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  throwIfError(error, "Failed to load issue options");
  return mapRows(data, mapIssue);
}

export async function getLinkedIssueIds(setId) {
  if (!setId) return [];

  const { data, error } = await supabase
    .from(TABLES.setIssues)
    .select("issue_option_id")
    .eq("set_id", setId);

  throwIfError(error, "Failed to load linked issue options");
  return mapRows(data, (item) => toUiId(item.issue_option_id));
}

export async function replaceIssueLinks({ setId, issueIds }) {
  const { error: deleteError } = await supabase
    .from(TABLES.setIssues)
    .delete()
    .eq("set_id", setId);

  throwIfError(deleteError, "Failed to reset issue links");

  if (!issueIds?.length) return [];

  const payload = issueIds.map((issueId) => ({
    set_id: setId,
    issue_option_id: issueId,
  }));

  const { data, error } = await supabase
    .from(TABLES.setIssues)
    .insert(payload)
    .select("issue_option_id");

  throwIfError(error, "Failed to save issue links");
  return data || [];
}

export async function listRecommendations() {
  const { data, error } = await supabase
    .from(TABLES.recommendations)
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(error, "Failed to load recommendations");
  return mapRows(data, mapRecommendation);
}

export async function createRecommendation({ title, details, category }) {
  const payload = {
    title: title.trim(),
    details: details.trim(),
    category: category || "Other",
  };

  const { data, error } = await supabase
    .from(TABLES.recommendations)
    .insert(payload)
    .select("*")
    .single();

  throwIfError(error, "Failed to create recommendation");
  return mapRecommendation(data);
}

export async function getRecommendationsForSet(setId) {
  if (!setId) return [];

  const { data, error } = await supabase
    .from(TABLES.setRecommendations)
    .select("priority_order, recommendation_id, adjustment_recommendations(*)")
    .eq("set_id", setId)
    .order("priority_order", { ascending: false });

  throwIfError(error, "Failed to load attached recommendations");

  return mapRows(data, (item) => {
    const recommendation = item.adjustment_recommendations || {};
    return {
      recommendationId: toUiId(item.recommendation_id),
      priorityOrder: item.priority_order ?? 0,
      ...mapRecommendation(recommendation),
    };
  });
}

export async function attachRecommendationToSet({
  setId,
  recommendationId,
  priorityOrder,
}) {
  const payload = {
    set_id: setId,
    recommendation_id: recommendationId,
    priority_order: Number(priorityOrder) || 100,
  };

  const { error } = await supabase.from(TABLES.setRecommendations).upsert(
    payload,
    {
      onConflict: "set_id,recommendation_id",
    }
  );

  throwIfError(error, "Failed to attach recommendation");
  return true;
}

export async function removeRecommendationFromSet({
  setId,
  recommendationId,
}) {
  const { error } = await supabase
    .from(TABLES.setRecommendations)
    .delete()
    .eq("set_id", setId)
    .eq("recommendation_id", recommendationId);

  throwIfError(error, "Failed to remove recommendation");
  return true;
}

export async function listTrackPresets() {
  try {
    const { data, error } = await supabase
      .from(TABLES.presets)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return mapRows(data, mapPreset);
  } catch {
    return [];
  }
}

export async function getLinkedPresetIds(setId) {
  if (!setId) return [];

  try {
    const { data, error } = await supabase
      .from(TABLES.setPresets)
      .select("preset_id")
      .eq("set_id", setId);

    if (error) return [];
    return mapRows(data, (item) => toUiId(item.preset_id));
  } catch {
    return [];
  }
}

export async function replacePresetLinks({ setId, presetIds }) {
  try {
    const { error: deleteError } = await supabase
      .from(TABLES.setPresets)
      .delete()
      .eq("set_id", setId);

    if (deleteError) throw deleteError;

    if (!presetIds?.length) return [];

    const payload = presetIds.map((presetId) => ({
      set_id: setId,
      preset_id: presetId,
    }));

    const { data, error } = await supabase
      .from(TABLES.setPresets)
      .insert(payload)
      .select("preset_id");

    if (error) throw error;

    return data || [];
  } catch (error) {
    throw new Error(error.message || "Failed to save track preset links");
  }
}
