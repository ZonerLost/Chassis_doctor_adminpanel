import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SectionCard from "../../components/ui/common/SectionCard";
import SearchInput from "../../components/ui/common/SearchInput";

const ChassisDoctorManagement = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const symptoms = [
    { id: 1, name: "Entry Understeer", description: "Car pushes at turn-in." },
    { id: 2, name: "Mid-Corner Push", description: "Front washes mid-corner." },
    { id: 3, name: "Exit Traction Loss", description: "Rear steps out on throttle." },
  ];

  const trackConfigs = [
    { id: 1, type: "Oval", surface: "Tarmac", condition: "Dry" },
    { id: 2, type: "Road Course", surface: "Tarmac", condition: "Wet" },
    { id: 3, type: "Street Circuit", surface: "Concrete", condition: "Damp" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            Chassis Doctor Management
          </h1>
          <p className="mt-1" style={{ color: colors.text2 }}>
            Manage diagnostic symptoms, track configurations, and mapping rules
          </p>
        </div>
      </div>

      {/* Symptom Library Section */}
      <SectionCard
        title="Symptom Library"
        headerRight={
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: colors.accent,
              color: colors.bg,
            }}
          >
            Add Symptom
          </button>
        }
      >
        <div className="space-y-4">
          <SearchInput
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {/* Symptoms Table */}
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: colors.ring }}>
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: colors.hover,
                    borderColor: colors.ring,
                  }}
                >
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Description
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: colors.ring }}>
                {symptoms.map((symptom) => (
                  <tr
                    key={symptom.id}
                    className="transition-colors duration-150 hover:bg-opacity-50"
                    style={{ backgroundColor: colors.bg2 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.bg2;
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: colors.text }}>
                        {symptom.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.text2 }}>
                        {symptom.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200"
                        style={{
                          backgroundColor: colors.hover,
                          color: colors.text,
                          border: `1px solid ${colors.ring}`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.accent;
                          e.target.style.color = colors.bg;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.hover;
                          e.target.style.color = colors.text;
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      {/* Track Configurations Section */}
      <SectionCard
        title="Track Configurations"
        headerRight={
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: colors.accent,
              color: colors.bg,
            }}
          >
            Add Configuration
          </button>
        }
      >
        <div className="space-y-4">
          {/* Track Configs Table */}
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: colors.ring }}>
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: colors.hover,
                    borderColor: colors.ring,
                  }}
                >
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Type
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Surface
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Condition
                  </th>
                  <th
                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={{ color: colors.accent }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: colors.ring }}>
                {trackConfigs.map((config) => (
                  <tr
                    key={config.id}
                    className="transition-colors duration-150 hover:bg-opacity-50"
                    style={{ backgroundColor: colors.bg2 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.bg2;
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: colors.text }}>
                        {config.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: colors.text }}>
                        {config.surface}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: colors.accent + "20",
                          color: colors.accent,
                        }}
                      >
                        {config.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200"
                        style={{
                          backgroundColor: colors.hover,
                          color: colors.text,
                          border: `1px solid ${colors.ring}`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = colors.accent;
                          e.target.style.color = colors.bg;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = colors.hover;
                          e.target.style.color = colors.text;
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default ChassisDoctorManagement;
