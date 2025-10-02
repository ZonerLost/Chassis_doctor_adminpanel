export const SYMPTOMS = [
  { id: "s1", name: "Entry Understeer", description: "Car pushes at turn-in." },
  {
    id: "s2",
    name: "Mid-Corner Push",
    description: "Front washes mid-corner.",
  },
  {
    id: "s3",
    name: "Exit Traction Loss",
    description: "Rear steps out on throttle.",
  },
];

export const CAUSES = [
  { id: "c1", name: "Front Grip Deficit" },
  { id: "c2", name: "Rear Lateral Instability" },
  { id: "c3", name: "Weight Transfer Imbalance" },
];

export const FIXES = [
  {
    id: "f1",
    name: "Soften Front ARB",
    description: "Reduce front anti-roll bar rate one step",
  },
  {
    id: "f2",
    name: "Add Rear Wing Angle",
    description: "+1° rear wing or add gurney",
  },
  {
    id: "f3",
    name: "Stiffen Rear Rebound",
    description: "+2 clicks RR/LR rebound",
  },
  {
    id: "f4",
    name: "Lower Front Ride Height",
    description: "-2mm front RH (ensure rake)",
  },
];

export const TRACK_TYPES = [
  { id: "t1", type: "Oval", surface: "Tarmac", condition: "Dry" },
  { id: "t2", type: "Oval", surface: "Tarmac", condition: "Wet" },
  { id: "t3", type: "Oval", surface: "Dirt", condition: "Dry" },
];

// Simple rules (symptom+optional track → cause → fix) with a weight used in scoring
export const DIAGNOSTIC_RULES = [
  {
    id: "r1",
    symptomId: "s1",
    trackTypeId: "t1",
    causeId: "c1",
    fixId: "f1",
    weight: 3,
  },
  {
    id: "r2",
    symptomId: "s1",
    trackTypeId: "t1",
    causeId: "c3",
    fixId: "f4",
    weight: 2,
  },
  {
    id: "r3",
    symptomId: "s2",
    trackTypeId: "t1",
    causeId: "c1",
    fixId: "f4",
    weight: 2,
  },
  {
    id: "r4",
    symptomId: "s3",
    trackTypeId: "t1",
    causeId: "c2",
    fixId: "f2",
    weight: 3,
  },
  {
    id: "r5",
    symptomId: "s3",
    trackTypeId: "t1",
    causeId: "c3",
    fixId: "f3",
    weight: 2,
  },
  // generic rules (no track filter)
  {
    id: "r6",
    symptomId: "s2",
    trackTypeId: null,
    causeId: "c1",
    fixId: "f1",
    weight: 1,
  },
];
