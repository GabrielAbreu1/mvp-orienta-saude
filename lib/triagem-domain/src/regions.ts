/**
 * Catálogo de regiões corporais — onde o usuário localiza o sintoma.
 */

export type RegionGroup = "superior" | "tronco" | "inferior" | "geral";

export interface Region {
  id: string;
  label: string;
  group: RegionGroup;
}

export const REGIONS: Region[] = [
  { id: "cabeca", label: "Cabeça", group: "superior" },
  { id: "olhos", label: "Olhos", group: "superior" },
  { id: "ouvidos", label: "Ouvidos", group: "superior" },
  { id: "nariz", label: "Nariz", group: "superior" },
  { id: "boca_garganta", label: "Boca / Garganta", group: "superior" },
  { id: "pescoco", label: "Pescoço", group: "superior" },
  { id: "ombros", label: "Ombros", group: "superior" },
  { id: "bracos", label: "Braços / Mãos", group: "superior" },
  { id: "peito", label: "Peito", group: "tronco" },
  { id: "costas_sup", label: "Costas (superior)", group: "tronco" },
  { id: "abdomen", label: "Abdômen", group: "tronco" },
  { id: "costas_inf", label: "Costas (inferior)", group: "tronco" },
  { id: "quadril", label: "Quadril / Virilha", group: "tronco" },
  { id: "pernas", label: "Pernas / Joelhos", group: "inferior" },
  { id: "tornozelos", label: "Tornozelos / Pés", group: "inferior" },
  { id: "corpo_todo", label: "Corpo todo", group: "geral" },
  { id: "nao_sei", label: "Não sei localizar", group: "geral" },
];

export const REGION_IDS: readonly string[] = REGIONS.map((r) => r.id);

export function isValidRegionId(id: string): boolean {
  return REGION_BY_ID.has(id);
}

export const REGION_BY_ID: Map<string, Region> = new Map(
  REGIONS.map((r) => [r.id, r]),
);

export function getRegionsById(ids: readonly string[]): Region[] {
  return ids
    .map((id) => REGION_BY_ID.get(id))
    .filter((r): r is Region => r !== undefined);
}

export function getRegionLabels(ids: readonly string[]): string {
  return getRegionsById(ids)
    .map((r) => r.label)
    .join(", ");
}
