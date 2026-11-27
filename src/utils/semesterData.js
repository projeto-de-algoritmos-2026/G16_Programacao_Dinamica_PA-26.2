/**
 * src/utils/semesterData.js
 * Catálogo de Disciplinas/Atividades da FGA-UnB e Presets de Teste
 * Responsável: Daniel de Oliveira Lira (@Daniellira540)
 *
 * TODO (Daniel):
 * 1. Expandir `schedulePresets` com 8 a 10 disciplinas reais da FGA/UnB (horários "HH:MM" e pesos)
 *    onde o Algoritmo Guloso (Módulo 2) perde claramente para a Programação Dinâmica.
 * 2. Manter/refinar o preset "Armadilha do Guloso" (Slide 7) para demonstração no vídeo.
 * 3. Expandir `knapsackPresets` com 6 a 8 atividades/disciplinas da UnB (créditos `weight` e ganho `value`),
 *    além do preset clássico W = 11 (Slides 24–29) onde a heurística v_i/w_i falha (35 vs 40).
 */

// ==========================================
// 1. PRESETS: WEIGHTED INTERVAL SCHEDULING
// Formato esperado por solveWeightedIntervalScheduling(jobs):
//   { id, code, name, start: "HH:MM" | number, finish: "HH:MM" | number, weight: number }
// ==========================================
export const schedulePresets = {
  unbDefault: {
    label: 'Semestre FGA-UnB (Exemplo Base)',
    description: 'Substituir/expandir com a grade completa de 8–10 matérias da UnB.',
    jobs: [
      { id: 'PAA', code: 'CIC-117536', name: 'Projeto e Análise de Algoritmos', start: '08:00', finish: '10:00', weight: 10 },
      { id: 'CMP1', code: 'FGA-101095', name: 'Compiladores 1', start: '10:00', finish: '12:00', weight: 12 },
      { id: 'PI2', code: 'FGA-208698', name: 'Projeto Integrador de Engenharia 2', start: '09:00', finish: '11:30', weight: 28 },
    ],
  },
  greedyTrap: {
    label: 'Armadilha do Guloso (Slide 7)',
    description: 'Mostra o Guloso (Módulo 2) escolhendo peso 1 e perdendo peso 999.',
    jobs: [
      { id: 'OPT1', code: 'FGA-000001', name: 'Optativa Curta (Baixa Prioridade)', start: '08:00', finish: '10:00', weight: 1 },
      { id: 'TCC1', code: 'FGA-208700', name: 'TCC 1 / Projeto Obrigatório', start: '08:00', finish: '16:00', weight: 999 },
    ],
  },
};

// ==========================================
// 2. PRESETS: MOCHILA 0-1 (KNAPSACK)
// Formato esperado por solveKnapsack01(items, capacityW):
//   { id, code, name, weight: number (inteiro > 0), value: number }
// ==========================================
export const knapsackPresets = {
  classicSlide: {
    label: 'Caso Clássico (Slides 24–29, W = 11)',
    description: 'Guloso por razão v/w faz 35 ({5, 2, 1}); PD ótima faz 40 ({3, 4}).',
    defaultCapacity: 11,
    maxCapacity: 20,
    items: [
      { id: 'it1', code: 'ATIV-01', name: 'Monitoria Voluntária', weight: 1, value: 1 },
      { id: 'it2', code: 'FGA-193631', name: 'Tópicos Especiais (2 créd.)', weight: 2, value: 6 },
      { id: 'it3', code: 'FGA-201286', name: 'Sistemas Operacionais (5 créd.)', weight: 5, value: 18 },
      { id: 'it4', code: 'CIC-117536', name: 'Projeto de Algoritmos (6 créd.)', weight: 6, value: 22 },
      { id: 'it5', code: 'FGA-208698', name: 'Projeto Integrador + Lab (7 créd.)', weight: 7, value: 28 },
    ],
  },
};
