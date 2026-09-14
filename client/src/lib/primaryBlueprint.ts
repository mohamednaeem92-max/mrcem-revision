export const PRIMARY_BLUEPRINT = [
  { category: "Anatomy", targetCount: 60 },
  { category: "Physiology", targetCount: 60 },
  { category: "Pharmacology", targetCount: 24 },
  { category: "Microbiology", targetCount: 17 },
  { category: "Pathology", targetCount: 9 },
  { category: "Evidence-based medicine", targetCount: 10 },
] as const;

export type PrimaryBlueprintCategory = (typeof PRIMARY_BLUEPRINT)[number]["category"];

export const PRIMARY_BLUEPRINT_TARGET_TOTAL = PRIMARY_BLUEPRINT.reduce((total, item) => total + item.targetCount, 0);

export function isPrimaryBlueprintCategory(value: unknown): value is PrimaryBlueprintCategory {
  return typeof value === "string" && PRIMARY_BLUEPRINT.some((item) => item.category === value);
}
