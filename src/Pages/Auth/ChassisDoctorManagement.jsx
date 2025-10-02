import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SymptomTable from "../../Components/chassis-doctor/symptoms/SymptomTable";
import MappingRulesTable from "../../components/chassis-doctor/mappings/MappingRulesTable";
import TrackConfigsTable from "../../Components/chassis-doctor/tracks/TrackConfigsTable";
import SymptomEditorDrawer from "../../components/chassis-doctor/symptoms/SymptomEditorDrawer";
import MappingRuleEditorDrawer from "../../components/chassis-doctor/mappings/MappingRuleEditorDrawer";
import TrackConfigEditorDrawer from "../../components/chassis-doctor/tracks/TrackConfigEditorDrawer";
import {
  MdAdd,
  MdBugReport,
  MdSettings,
  MdSpeed, // Use MdSpeed instead of MdRaceTrack
} from "react-icons/md";

export default function ChassisDoctorManagement() {
  const { colors } = useTheme();

  const TABS = [
    { key: "symptoms", label: "Symptoms", icon: MdBugReport },
    { key: "mappings", label: "Mapping Rules", icon: MdSettings },
    { key: "tracks", label: "Track Configs", icon: MdSpeed }, // Changed icon
  ];

  const [activeTab, setActiveTab] = useState("symptoms");
  const [symptomEditorOpen, setSymptomEditorOpen] = useState(false);
  const [mappingEditorOpen, setMappingEditorOpen] = useState(false);
  const [trackEditorOpen, setTrackEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Mock data
  const [symptoms, setSymptoms] = useState([
    {
      id: 1,
      name: "Oversteer on Exit",
      category: "Handling",
      severity: "High",
      description: "Car loses rear grip when accelerating out of corners",
      possibleCauses: [
        "Rear wing angle too low",
        "Rear tire pressure too high",
        "Differential settings",
      ],
      solutions: [
        "Increase rear wing angle",
        "Reduce rear tire pressure",
        "Adjust differential preload",
      ],
      frequency: 75,
      lastReported: "2024-01-20T14:30:00Z",
    },
    {
      id: 2,
      name: "Brake Lock-up",
      category: "Braking",
      severity: "Medium",
      description: "Front wheels lock under heavy braking",
      possibleCauses: [
        "Brake balance too forward",
        "Brake fluid temperature too high",
      ],
      solutions: ["Move brake balance rearward", "Increase brake cooling"],
      frequency: 45,
      lastReported: "2024-01-18T10:15:00Z",
    },
    {
      id: 3,
      name: "Understeer in Slow Corners",
      category: "Handling",
      severity: "Medium",
      description: "Front end pushes wide in low-speed corners",
      possibleCauses: [
        "Front wing angle too high",
        "Front tire pressure too low",
      ],
      solutions: ["Reduce front wing angle", "Increase front tire pressure"],
      frequency: 60,
      lastReported: "2024-01-22T16:45:00Z",
    },
  ]);

  const [mappingRules, setMappingRules] = useState([
    {
      id: 1,
      name: "Oversteer → Wing Adjustment",
      condition: "symptom = 'Oversteer' AND severity > 'Medium'",
      action: "Increase rear wing by 2 clicks",
      priority: "High",
      isActive: true,
      successRate: 85,
      timesUsed: 24,
    },
    {
      id: 2,
      name: "Brake Issues → Balance Shift",
      condition: "category = 'Braking' AND frequency > 50",
      action: "Adjust brake balance by 1% rearward",
      priority: "Medium",
      isActive: true,
      successRate: 72,
      timesUsed: 18,
    },
  ]);

  const [trackConfigs, setTrackConfigs] = useState([
    {
      id: 1,
      trackName: "Monaco",
      category: "Street Circuit",
      frontWing: 8,
      rearWing: 6,
      suspension: "Soft",
      brakeBalance: 58,
      differential: "Locked",
      notes: "High downforce setup for tight corners",
      lastUsed: "2024-01-15T12:00:00Z",
    },
    {
      id: 2,
      trackName: "Monza",
      category: "High Speed",
      frontWing: 3,
      rearWing: 2,
      suspension: "Stiff",
      brakeBalance: 55,
      differential: "Open",
      notes: "Low drag setup for straight line speed",
      lastUsed: "2024-01-20T15:30:00Z",
    },
  ]);

  // Handlers
  const handleEditSymptom = (symptom) => {
    setEditingItem(symptom);
    setSymptomEditorOpen(true);
  };

  const handleEditMapping = (mapping) => {
    setEditingItem(mapping);
    setMappingEditorOpen(true);
  };

  const handleEditTrackConfig = (config) => {
    setEditingItem(config);
    setTrackEditorOpen(true);
  };

  const handleAddSymptom = () => {
    setEditingItem(null);
    setSymptomEditorOpen(true);
  };

  const handleAddMapping = () => {
    setEditingItem(null);
    setMappingEditorOpen(true);
  };

  const handleAddTrackConfig = () => {
    setEditingItem(null);
    setTrackEditorOpen(true);
  };

  const handleSaveSymptom = async (symptomData) => {
    if (editingItem) {
      setSymptoms((prev) =>
        prev.map((symptom) =>
          symptom.id === editingItem.id
            ? {
                ...symptomData,
                id: editingItem.id,
                lastReported: new Date().toISOString(),
              }
            : symptom
        )
      );
    } else {
      const newSymptom = {
        ...symptomData,
        id: Date.now(),
        lastReported: new Date().toISOString(),
        frequency: 1,
      };
      setSymptoms((prev) => [...prev, newSymptom]);
    }
  };

  const handleSaveMapping = async (mappingData) => {
    if (editingItem) {
      setMappingRules((prev) =>
        prev.map((mapping) =>
          mapping.id === editingItem.id
            ? { ...mappingData, id: editingItem.id }
            : mapping
        )
      );
    } else {
      setMappingRules((prev) => [
        ...prev,
        { ...mappingData, id: Date.now(), timesUsed: 0, successRate: 0 },
      ]);
    }
  };

  const handleSaveTrackConfig = async (configData) => {
    if (editingItem) {
      setTrackConfigs((prev) =>
        prev.map((config) =>
          config.id === editingItem.id
            ? {
                ...configData,
                id: editingItem.id,
                lastUsed: new Date().toISOString(),
              }
            : config
        )
      );
    } else {
      setTrackConfigs((prev) => [
        ...prev,
        { ...configData, id: Date.now(), lastUsed: new Date().toISOString() },
      ]);
    }
  };

  const getAddButtonConfig = () => {
    switch (activeTab) {
      case "symptoms":
        return {
          onClick: handleAddSymptom,
          text: "Add Symptom",
          icon: MdBugReport,
        };
      case "mappings":
        return {
          onClick: handleAddMapping,
          text: "Add Mapping Rule",
          icon: MdSettings,
        };
      case "tracks":
        return {
          onClick: handleAddTrackConfig,
          text: "Add Track Config",
          icon: MdSpeed, // Changed icon
        };
      default:
        return null;
    }
  };

  const addButtonConfig = getAddButtonConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: colors.text }}>
            Chassis Doctor Management
          </h1>
          <div className="text-sm mt-1" style={{ color: colors.text2 }}>
            Diagnostic system for chassis setup and performance issues
          </div>
        </div>

        {addButtonConfig && (
          <button
            onClick={addButtonConfig.onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: colors.accent,
              color: "#000",
            }}
          >
            <addButtonConfig.icon size={18} />
            {addButtonConfig.text}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${colors.ring}` }}
      >
        <div style={{ backgroundColor: colors.accent + "10" }}>
          <div className="flex items-center gap-6 px-4 py-3">
            {TABS.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 uppercase text-xs font-semibold"
                  style={{
                    color: colors.accent,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background:
                      activeTab === tab.key
                        ? colors.accent + "15"
                        : "transparent",
                    boxShadow:
                      activeTab === tab.key
                        ? `inset 0 -2px 0 ${colors.accent}`
                        : "none",
                  }}
                >
                  <IconComponent size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div
        className="rounded-2xl p-4"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        {activeTab === "symptoms" && (
          <SymptomTable
            rows={symptoms}
            loading={false}
            onEdit={handleEditSymptom}
          />
        )}

        {activeTab === "mappings" && (
          <MappingRulesTable
            rows={mappingRules}
            loading={false}
            onEdit={handleEditMapping}
          />
        )}

        {activeTab === "tracks" && (
          <TrackConfigsTable
            rows={trackConfigs}
            loading={false}
            onEdit={handleEditTrackConfig}
          />
        )}
      </div>

      {/* Drawers */}
      <SymptomEditorDrawer
        isOpen={symptomEditorOpen}
        onClose={() => setSymptomEditorOpen(false)}
        symptom={editingItem}
        onSave={handleSaveSymptom}
      />

      <MappingRuleEditorDrawer
        isOpen={mappingEditorOpen}
        onClose={() => setMappingEditorOpen(false)}
        mapping={editingItem}
        onSave={handleSaveMapping}
      />

      <TrackConfigEditorDrawer
        isOpen={trackEditorOpen}
        onClose={() => setTrackEditorOpen(false)}
        config={editingItem}
        onSave={handleSaveTrackConfig}
      />
    </div>
  );
}
