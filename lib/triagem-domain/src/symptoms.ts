/**
 * Catálogo pré-definido de sintomas agrupados por categoria.
 * IDs são estáveis — nunca renomear um ID existente, apenas adicionar novos.
 */

export interface Symptom {
  id: string;
  label: string;
  category: string;
}

export const SYMPTOMS: Symptom[] = [
  // Dor
  { id: "dor_cabeca", label: "Dor de cabeça", category: "Dor" },
  { id: "dor_peito", label: "Dor no peito", category: "Dor" },
  { id: "dor_abdominal", label: "Dor abdominal", category: "Dor" },
  { id: "dor_costas", label: "Dor nas costas", category: "Dor" },
  { id: "dor_garganta", label: "Dor de garganta", category: "Dor" },
  { id: "dor_ouvido", label: "Dor de ouvido", category: "Dor" },
  { id: "dor_articulacao", label: "Dor nas articulações", category: "Dor" },
  { id: "dor_muscular", label: "Dor muscular", category: "Dor" },

  // Cabeça e neurológico
  { id: "tontura", label: "Tontura ou vertigem", category: "Cabeça e neurológico" },
  { id: "desmaio", label: "Desmaio ou perda de consciência", category: "Cabeça e neurológico" },
  { id: "confusao_mental", label: "Confusão mental", category: "Cabeça e neurológico" },
  { id: "fala_alterada", label: "Fala alterada ou travada", category: "Cabeça e neurológico" },
  { id: "fraqueza_facial", label: "Fraqueza ou assimetria facial", category: "Cabeça e neurológico" },
  { id: "convulsao", label: "Convulsão ou tremores intensos", category: "Cabeça e neurológico" },
  { id: "formigamento", label: "Formigamento ou dormência", category: "Cabeça e neurológico" },
  { id: "visao_alterada", label: "Alteração na visão", category: "Cabeça e neurológico" },

  // Respiratório
  { id: "falta_ar", label: "Falta de ar", category: "Respiratório" },
  { id: "tosse", label: "Tosse", category: "Respiratório" },
  { id: "tosse_sangue", label: "Tosse com sangue", category: "Respiratório" },
  { id: "chiado", label: "Chiado no peito", category: "Respiratório" },
  { id: "coriza", label: "Coriza ou nariz entupido", category: "Respiratório" },

  // Cardiovascular
  { id: "palpitacao", label: "Palpitações ou coração acelerado", category: "Cardiovascular" },
  { id: "aperto_peito", label: "Aperto ou pressão no peito", category: "Cardiovascular" },
  { id: "inchaco_pernas", label: "Inchaço nas pernas ou tornozelos", category: "Cardiovascular" },

  // Digestivo
  { id: "nausea", label: "Náusea", category: "Digestivo" },
  { id: "vomito", label: "Vômito", category: "Digestivo" },
  { id: "diarreia", label: "Diarreia", category: "Digestivo" },
  { id: "constipacao", label: "Prisão de ventre", category: "Digestivo" },
  { id: "sangue_fezes", label: "Sangue nas fezes", category: "Digestivo" },
  { id: "ictericia", label: "Amarelamento da pele ou olhos", category: "Digestivo" },

  // Urinário
  { id: "dor_urinar", label: "Dor ou ardência ao urinar", category: "Urinário" },
  { id: "urina_sangue", label: "Sangue na urina", category: "Urinário" },
  { id: "urina_frequente", label: "Urinar com muita frequência", category: "Urinário" },

  // Pele
  { id: "erupcao", label: "Erupção ou vermelhidão na pele", category: "Pele" },
  { id: "manchas_roxas", label: "Manchas roxas ou petéquias", category: "Pele" },
  { id: "coceira", label: "Coceira intensa", category: "Pele" },
  { id: "palidez", label: "Palidez acentuada", category: "Pele" },

  // Geral e sistêmico
  { id: "febre", label: "Febre", category: "Geral e sistêmico" },
  { id: "calafrio", label: "Calafrios", category: "Geral e sistêmico" },
  { id: "cansaco", label: "Cansaço extremo ou fraqueza", category: "Geral e sistêmico" },
  { id: "perda_peso", label: "Perda de peso sem motivo", category: "Geral e sistêmico" },
  { id: "falta_apetite", label: "Falta de apetite", category: "Geral e sistêmico" },
  { id: "suor_noturno", label: "Suor noturno excessivo", category: "Geral e sistêmico" },
  { id: "sangramento", label: "Sangramento intenso", category: "Geral e sistêmico" },

  // Mental e emocional
  { id: "ansiedade", label: "Ansiedade ou nervosismo intenso", category: "Mental e emocional" },
  { id: "tristeza", label: "Tristeza persistente", category: "Mental e emocional" },
  { id: "insonia", label: "Insônia ou dificuldade para dormir", category: "Mental e emocional" },
  { id: "pensamentos_auto", label: "Pensamentos de se machucar", category: "Mental e emocional" },
];

export const SYMPTOM_IDS: readonly string[] = SYMPTOMS.map((s) => s.id);

export function isValidSymptomId(id: string): boolean {
  return SYMPTOM_BY_ID.has(id);
}

export const SYMPTOM_BY_ID: Map<string, Symptom> = new Map(
  SYMPTOMS.map((s) => [s.id, s]),
);

export const SYMPTOM_CATEGORIES: string[] = Array.from(
  new Set(SYMPTOMS.map((s) => s.category)),
);

export function getSymptomsById(ids: readonly string[]): Symptom[] {
  return ids
    .map((id) => SYMPTOM_BY_ID.get(id))
    .filter((s): s is Symptom => s !== undefined);
}

export function getSymptomLabels(ids: readonly string[]): string {
  return getSymptomsById(ids)
    .map((s) => s.label)
    .join(", ");
}
