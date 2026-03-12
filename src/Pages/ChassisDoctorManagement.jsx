/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-finally */
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdCheckCircle,
  MdFlag,
  MdLayers,
  MdLink,
  MdPlaylistAddCheck,
  MdRemoveCircleOutline,
  MdSpeed,
  MdTune,
  MdWarningAmber,
} from "react-icons/md";
import { useTheme } from "../contexts/ThemeContext";
import DoctorButton from "../components/chassis-doctor/shared/DoctorButton";
import DoctorSectionCard from "../components/chassis-doctor/shared/DoctorSectionCard";
import CreateAdjustmentSetModal from "../components/chassis-doctor/modals/CreateAdjustmentSetModal";
import CreateRecommendationModal from "../components/chassis-doctor/modals/CreateRecommendationModal";
import {
  attachRecommendationToSet,
  createAdjustmentSet,
  createRecommendation,
  getLinkedIssueIds,
  getLinkedPresetIds,
  getRecommendationsForSet,
  listActiveSymptoms,
  listIssueOptionsBySymptom,
  listRecommendations,
  listSetsBySymptom,
  listTrackPresets,
  removeRecommendationFromSet,
  replaceIssueLinks,
  replacePresetLinks,
} from "../services/chassisDoctor.service";

const INITIAL_LOADING = {
  symptoms: false,
  sets: false,
  issues: false,
  recommendations: false,
  setContext: false,
  presets: false,
  createSet: false,
  createRecommendation: false,
  saveIssues: false,
  attachRecommendation: false,
  savePresets: false,
  removeRecommendation: false,
};

function EmptyState({ icon: Icon, title, description, colors }) {
  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        backgroundColor: colors.card || colors.bg,
        border: `1px dashed ${colors.ring}`,
      }}
    >
      {Icon ? (
        <div className="mb-3 flex justify-center">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.accent}20`,
              color: colors.accent,
            }}
          >
            <Icon size={22} />
          </div>
        </div>
      ) : null}

      <h3 className="text-sm font-semibold" style={{ color: colors.text }}>
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function InlineLoader({ label, colors }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-4"
      style={{
        backgroundColor: colors.card || colors.bg,
        border: `1px solid ${colors.ring}`,
        color: colors.text2,
      }}
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  colors,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-xl px-3 py-3 text-sm outline-none disabled:cursor-not-allowed"
      style={{
        backgroundColor: colors.card || colors.bg,
        border: `1px solid ${colors.ring}`,
        color: colors.text,
        opacity: disabled ? 0.65 : 1,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ChoiceChip({ label, selected, onClick, colors }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-2 text-sm transition"
      style={{
        backgroundColor: selected ? `${colors.accent}18` : colors.card || colors.bg,
        color: selected ? colors.accent : colors.text,
        border: `1px solid ${selected ? colors.accent : colors.ring}`,
      }}
    >
      {label}
    </button>
  );
}

function SummaryPill({ icon: Icon, label, value, colors }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{
        backgroundColor: colors.bg2,
        border: `1px solid ${colors.ring}`,
      }}
    >
      <Icon size={16} style={{ color: colors.accent }} />
      <div>
        <div className="text-[11px] uppercase tracking-wide" style={{ color: colors.text2 }}>
          {label}
        </div>
        <div className="text-sm font-medium" style={{ color: colors.text }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function ChassisDoctorManagement() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(INITIAL_LOADING);

  const [symptoms, setSymptoms] = useState([]);
  const [sets, setSets] = useState([]);
  const [issues, setIssues] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [attachedRecommendations, setAttachedRecommendations] = useState([]);
  const [presets, setPresets] = useState([]);

  const [selectedSymptomId, setSelectedSymptomId] = useState("");
  const [selectedSetId, setSelectedSetId] = useState("");
  const [selectedRecommendationId, setSelectedRecommendationId] = useState("");
  const [selectedIssueIds, setSelectedIssueIds] = useState([]);
  const [selectedPresetIds, setSelectedPresetIds] = useState([]);
  const [priorityOrder, setPriorityOrder] = useState("100");

  const [setModalOpen, setSetModalOpen] = useState(false);
  const [recommendationModalOpen, setRecommendationModalOpen] = useState(false);

  const setLoadingFlag = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const selectedSymptom = useMemo(
    () => symptoms.find((item) => item.id === selectedSymptomId) || null,
    [symptoms, selectedSymptomId]
  );

  const selectedSet = useMemo(
    () => sets.find((item) => item.id === selectedSetId) || null,
    [sets, selectedSetId]
  );

  const selectedRecommendation = useMemo(
    () =>
      recommendations.find((item) => item.id === selectedRecommendationId) ||
      null,
    [recommendations, selectedRecommendationId]
  );

  const symptomOptions = useMemo(
    () =>
      symptoms.map((item) => ({
        id: item.id,
        label: item.name,
      })),
    [symptoms]
  );

  const setOptions = useMemo(
    () =>
      sets.map((item) => ({
        id: item.id,
        label: item.title,
      })),
    [sets]
  );

  const recommendationOptions = useMemo(
    () =>
      recommendations.map((item) => ({
        id: item.id,
        label: `${item.title} • ${item.category}`,
      })),
    [recommendations]
  );

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      setLoadingFlag("symptoms", true);
      setLoadingFlag("recommendations", true);
      setLoadingFlag("presets", true);

      try {
        const [symptomRows, recommendationRows, presetRows] = await Promise.all([
          listActiveSymptoms(),
          listRecommendations(),
          listTrackPresets(),
        ]);

        if (!mounted) return;

        setSymptoms(symptomRows);
        setRecommendations(recommendationRows);
        setPresets(presetRows);
      } catch (error) {
        if (!mounted) return;
        toast.error(error.message || "Failed to load chassis doctor data");
      } finally {
        if (!mounted) return;
        setLoadingFlag("symptoms", false);
        setLoadingFlag("recommendations", false);
        setLoadingFlag("presets", false);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSymptomContext = async () => {
      if (!selectedSymptomId) {
        setSets([]);
        setIssues([]);
        setSelectedSetId("");
        setSelectedIssueIds([]);
        setSelectedPresetIds([]);
        setAttachedRecommendations([]);
        return;
      }

      setLoadingFlag("sets", true);
      setLoadingFlag("issues", true);

      try {
        const [setRows, issueRows] = await Promise.all([
          listSetsBySymptom(selectedSymptomId),
          listIssueOptionsBySymptom(selectedSymptomId),
        ]);

        if (!mounted) return;

        setSets(setRows);
        setIssues(issueRows);
        setSelectedSetId((prev) =>
          setRows.some((item) => item.id === prev) ? prev : setRows[0]?.id || ""
        );
        setSelectedIssueIds([]);
        setSelectedPresetIds([]);
        setAttachedRecommendations([]);
      } catch (error) {
        if (!mounted) return;
        toast.error(error.message || "Failed to load symptom data");
      } finally {
        if (!mounted) return;
        setLoadingFlag("sets", false);
        setLoadingFlag("issues", false);
      }
    };

    loadSymptomContext();

    return () => {
      mounted = false;
    };
  }, [selectedSymptomId]);

  useEffect(() => {
    let mounted = true;

    const loadSetContext = async () => {
      if (!selectedSetId) {
        setSelectedIssueIds([]);
        setSelectedPresetIds([]);
        setAttachedRecommendations([]);
        return;
      }

      setLoadingFlag("setContext", true);

      try {
        const [issueIds, attachedRows, presetIds] = await Promise.all([
          getLinkedIssueIds(selectedSetId),
          getRecommendationsForSet(selectedSetId),
          getLinkedPresetIds(selectedSetId),
        ]);

        if (!mounted) return;

        setSelectedIssueIds(issueIds);
        setAttachedRecommendations(attachedRows);
        setSelectedPresetIds(presetIds);
      } catch (error) {
        if (!mounted) return;
        toast.error(error.message || "Failed to load set details");
      } finally {
        if (!mounted) return;
        setLoadingFlag("setContext", false);
      }
    };

    loadSetContext();

    return () => {
      mounted = false;
    };
  }, [selectedSetId]);

  const toggleSelection = (list, value) => {
    if (list.includes(value)) {
      return list.filter((item) => item !== value);
    }
    return [...list, value];
  };

  const handleCreateSet = async ({ title, isActive }) => {
    if (!selectedSymptomId) {
      toast.error("Please select a symptom first");
      return false;
    }

    setLoadingFlag("createSet", true);

    try {
      const created = await createAdjustmentSet({
        symptomId: selectedSymptomId,
        title,
        isActive,
      });

      const nextSets = await listSetsBySymptom(selectedSymptomId);
      setSets(nextSets);
      setSelectedSetId(created.id);

      toast.success("Adjustment set created successfully");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to create adjustment set");
      return false;
    } finally {
      setLoadingFlag("createSet", false);
    }
  };

  const handleSaveIssueLinks = async () => {
    if (!selectedSetId) {
      toast.error("Please select an adjustment set first");
      return;
    }

    setLoadingFlag("saveIssues", true);

    try {
      await replaceIssueLinks({
        setId: selectedSetId,
        issueIds: selectedIssueIds,
      });

      toast.success("Issue links saved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save issue links");
    } finally {
      setLoadingFlag("saveIssues", false);
    }
  };

  const handleCreateRecommendation = async ({ title, details, category }) => {
    setLoadingFlag("createRecommendation", true);

    try {
      const created = await createRecommendation({
        title,
        details,
        category,
      });

      const recommendationRows = await listRecommendations();
      setRecommendations(recommendationRows);
      setSelectedRecommendationId(created.id);

      toast.success("Recommendation created successfully");
      return true;
    } catch (error) {
      toast.error(error.message || "Failed to create recommendation");
      return false;
    } finally {
      setLoadingFlag("createRecommendation", false);
    }
  };

  const refreshAttachedRecommendations = async (setId) => {
    const rows = await getRecommendationsForSet(setId);
    setAttachedRecommendations(rows);
  };

  const handleAttachRecommendation = async () => {
    if (!selectedSetId) {
      toast.error("Please select an adjustment set first");
      return;
    }

    if (!selectedRecommendationId) {
      toast.error("Please select a recommendation first");
      return;
    }

    setLoadingFlag("attachRecommendation", true);

    try {
      await attachRecommendationToSet({
        setId: selectedSetId,
        recommendationId: selectedRecommendationId,
        priorityOrder: Number(priorityOrder) || 100,
      });

      await refreshAttachedRecommendations(selectedSetId);
      setPriorityOrder("100");
      toast.success("Recommendation attached successfully");
    } catch (error) {
      toast.error(error.message || "Failed to attach recommendation");
    } finally {
      setLoadingFlag("attachRecommendation", false);
    }
  };

  const handleRemoveRecommendation = async (recommendationId) => {
    if (!selectedSetId) return;

    setLoadingFlag("removeRecommendation", true);

    try {
      await removeRecommendationFromSet({
        setId: selectedSetId,
        recommendationId,
      });

      await refreshAttachedRecommendations(selectedSetId);
      toast.success("Recommendation removed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to remove recommendation");
    } finally {
      setLoadingFlag("removeRecommendation", false);
    }
  };

  const handleSavePresetLinks = async () => {
    if (!selectedSetId) {
      toast.error("Please select an adjustment set first");
      return;
    }

    setLoadingFlag("savePresets", true);

    try {
      await replacePresetLinks({
        setId: selectedSetId,
        presetIds: selectedPresetIds,
      });

      toast.success("Track presets linked successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save track preset links");
    } finally {
      setLoadingFlag("savePresets", false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: colors.text }}>
            Chassis Doctor Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: colors.text2 }}>
            Manage symptom-based adjustment sets, issue links, recommendations,
            and track preset bindings in one production-ready workflow.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <SummaryPill
            icon={MdWarningAmber}
            label="Selected Symptom"
            value={selectedSymptom?.name || "Not selected"}
            colors={colors}
          />
          <SummaryPill
            icon={MdLayers}
            label="Selected Set"
            value={selectedSet?.title || "Not selected"}
            colors={colors}
          />
        </div>
      </div>

      <DoctorSectionCard
        title="Section 1: Select Symptom"
        subtitle="Start by choosing the active chassis symptom you want to configure."
      >
        {loading.symptoms ? (
          <InlineLoader label="Loading symptoms..." colors={colors} />
        ) : symptoms.length === 0 ? (
          <EmptyState
            icon={MdWarningAmber}
            title="No active symptoms found"
            description="Create or activate symptoms first, then come back here."
            colors={colors}
          />
        ) : (
          <SelectField
            value={selectedSymptomId}
            onChange={(e) => setSelectedSymptomId(e.target.value)}
            options={symptomOptions}
            placeholder="Select a symptom..."
            colors={colors}
          />
        )}
      </DoctorSectionCard>

      <DoctorSectionCard
        title="Section 2: Adjustment Set"
        subtitle="Each symptom can have one or more adjustment sets. Select one or create a new set."
        right={
          <DoctorButton
            icon={MdAdd}
            onClick={() => setSetModalOpen(true)}
            disabled={!selectedSymptomId}
          >
            Create Set
          </DoctorButton>
        }
      >
        {!selectedSymptomId ? (
          <EmptyState
            icon={MdLayers}
            title="No symptom selected"
            description="Select a symptom first to load its adjustment sets."
            colors={colors}
          />
        ) : loading.sets ? (
          <InlineLoader label="Loading adjustment sets..." colors={colors} />
        ) : (
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <SelectField
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
              options={setOptions}
              placeholder="Select or create a set..."
              colors={colors}
            />

            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.card || colors.bg,
                border: `1px solid ${colors.ring}`,
              }}
            >
              <div className="text-xs uppercase" style={{ color: colors.text2 }}>
                Set Stats
              </div>
              <div className="mt-2 text-sm" style={{ color: colors.text }}>
                Total sets: <strong>{sets.length}</strong>
              </div>
              <div className="mt-1 text-sm" style={{ color: colors.text }}>
                Active:{" "}
                <strong>{sets.filter((item) => item.isActive).length}</strong>
              </div>
            </div>
          </div>
        )}
      </DoctorSectionCard>

      <DoctorSectionCard
        title="Section 3: Link Issue Options"
        subtitle="Pick which issue options should belong to the selected adjustment set."
        right={
          <DoctorButton
            variant="secondary"
            icon={MdLink}
            onClick={handleSaveIssueLinks}
            loading={loading.saveIssues}
            disabled={!selectedSetId}
          >
            Save Issue Links
          </DoctorButton>
        }
      >
        {!selectedSetId ? (
          <EmptyState
            icon={MdLink}
            title="No adjustment set selected"
            description="Choose a set first to manage issue option links."
            colors={colors}
          />
        ) : loading.issues || loading.setContext ? (
          <InlineLoader label="Loading issue options..." colors={colors} />
        ) : issues.length === 0 ? (
          <EmptyState
            icon={MdTune}
            title="No issue options found"
            description="This symptom does not have any active issue options yet."
            colors={colors}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {issues.map((issue) => (
              <ChoiceChip
                key={issue.id}
                label={issue.name}
                selected={selectedIssueIds.includes(issue.id)}
                onClick={() =>
                  setSelectedIssueIds((prev) => toggleSelection(prev, issue.id))
                }
                colors={colors}
              />
            ))}
          </div>
        )}
      </DoctorSectionCard>

      <DoctorSectionCard
        title="Section 4: Manage Recommendations"
        subtitle="Choose an existing recommendation from the catalog or create a new reusable one."
        right={
          <DoctorButton
            icon={MdAdd}
            onClick={() => setRecommendationModalOpen(true)}
          >
            Create Recommendation
          </DoctorButton>
        }
      >
        {loading.recommendations ? (
          <InlineLoader label="Loading recommendations..." colors={colors} />
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={MdPlaylistAddCheck}
            title="No recommendations found"
            description="Create your first recommendation to continue."
            colors={colors}
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_300px]">
            <SelectField
              value={selectedRecommendationId}
              onChange={(e) => setSelectedRecommendationId(e.target.value)}
              options={recommendationOptions}
              placeholder="Select recommendation..."
              colors={colors}
            />

            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.card || colors.bg,
                border: `1px solid ${colors.ring}`,
              }}
            >
              <div className="mb-1 text-xs uppercase" style={{ color: colors.text2 }}>
                Selected Recommendation
              </div>

              {selectedRecommendation ? (
                <>
                  <div className="font-semibold" style={{ color: colors.text }}>
                    {selectedRecommendation.title}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
                    {selectedRecommendation.details}
                  </div>
                  <div
                    className="mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${colors.accent}18`,
                      color: colors.accent,
                    }}
                  >
                    {selectedRecommendation.category}
                  </div>
                </>
              ) : (
                <div className="text-sm" style={{ color: colors.text2 }}>
                  Select a recommendation to preview it here.
                </div>
              )}
            </div>
          </div>
        )}
      </DoctorSectionCard>

      <DoctorSectionCard
        title="Section 5: Attach to Set"
        subtitle="Attach the selected recommendation to the chosen set and control its priority order."
        right={
          <DoctorButton
            icon={MdCheckCircle}
            onClick={handleAttachRecommendation}
            loading={loading.attachRecommendation}
            disabled={!selectedSetId || !selectedRecommendationId}
          >
            Attach to Set
          </DoctorButton>
        }
      >
        {!selectedSetId ? (
          <EmptyState
            icon={MdCheckCircle}
            title="No adjustment set selected"
            description="Select a set first, then attach recommendations to it."
            colors={colors}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
              <div
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: colors.card || colors.bg,
                  border: `1px solid ${colors.ring}`,
                }}
              >
                <div className="text-xs uppercase" style={{ color: colors.text2 }}>
                  Ready To Attach
                </div>
                <div className="mt-2 text-sm" style={{ color: colors.text }}>
                  {selectedRecommendation
                    ? selectedRecommendation.title
                    : "No recommendation selected"}
                </div>
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Priority Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={priorityOrder}
                  onChange={(e) => setPriorityOrder(e.target.value)}
                  className="w-full rounded-xl px-3 py-3 text-sm outline-none"
                  style={{
                    backgroundColor: colors.card || colors.bg,
                    border: `1px solid ${colors.ring}`,
                    color: colors.text,
                  }}
                />
              </div>
            </div>

            {loading.setContext ? (
              <InlineLoader
                label="Loading attached recommendations..."
                colors={colors}
              />
            ) : attachedRecommendations.length === 0 ? (
              <EmptyState
                icon={MdPlaylistAddCheck}
                title="No recommendations attached yet"
                description="Attach one or more recommendations to build the set logic."
                colors={colors}
              />
            ) : (
              <div className="grid gap-3">
                {attachedRecommendations.map((item) => (
                  <div
                    key={item.recommendationId}
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: colors.card || colors.bg,
                      border: `1px solid ${colors.ring}`,
                    }}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="text-sm font-semibold"
                            style={{ color: colors.text }}
                          >
                            {item.title}
                          </h3>

                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                            style={{
                              backgroundColor: `${colors.accent}18`,
                              color: colors.accent,
                            }}
                          >
                            Priority: {item.priorityOrder}
                          </span>

                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                            style={{
                              backgroundColor: "rgba(34,197,94,0.12)",
                              color: "#22c55e",
                            }}
                          >
                            {item.category}
                          </span>
                        </div>

                        <p className="mt-2 text-sm" style={{ color: colors.text2 }}>
                          {item.details}
                        </p>
                      </div>

                      <DoctorButton
                        variant="danger"
                        icon={MdRemoveCircleOutline}
                        onClick={() =>
                          handleRemoveRecommendation(item.recommendationId)
                        }
                        loading={loading.removeRecommendation}
                      >
                        Remove
                      </DoctorButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DoctorSectionCard>

      <DoctorSectionCard
        title="Section 6: Link Track Presets"
        subtitle="Optionally link track presets that should be associated with the selected set."
        right={
          <DoctorButton
            variant="secondary"
            icon={MdSpeed}
            onClick={handleSavePresetLinks}
            loading={loading.savePresets}
            disabled={!selectedSetId || presets.length === 0}
          >
            Save Presets
          </DoctorButton>
        }
      >
        {!selectedSetId ? (
          <EmptyState
            icon={MdSpeed}
            title="No adjustment set selected"
            description="Choose a set first to link track presets."
            colors={colors}
          />
        ) : loading.presets || loading.setContext ? (
          <InlineLoader label="Loading track presets..." colors={colors} />
        ) : presets.length === 0 ? (
          <EmptyState
            icon={MdFlag}
            title="No track presets available"
            description="Track preset configuration is optional. Add presets in the database to use this section."
            colors={colors}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <ChoiceChip
                key={preset.id}
                label={preset.category ? `${preset.name} • ${preset.category}` : preset.name}
                selected={selectedPresetIds.includes(preset.id)}
                onClick={() =>
                  setSelectedPresetIds((prev) =>
                    toggleSelection(prev, preset.id)
                  )
                }
                colors={colors}
              />
            ))}
          </div>
        )}
      </DoctorSectionCard>

      <CreateAdjustmentSetModal
        isOpen={setModalOpen}
        onClose={() => setSetModalOpen(false)}
        onSubmit={handleCreateSet}
        loading={loading.createSet}
      />

      <CreateRecommendationModal
        isOpen={recommendationModalOpen}
        onClose={() => setRecommendationModalOpen(false)}
        onSubmit={handleCreateRecommendation}
        loading={loading.createRecommendation}
      />
    </div>
  );
}