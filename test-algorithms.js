// test-algorithms.js
// Suite de validação formal — Módulo 4: Programação Dinâmica (UnB Grade Planner Pro)
import {
  solveWeightedIntervalScheduling,
  solveKnapsack01,
  toMinutes,
  toTimeString,
} from './src/utils/dynamicProgramming.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${testName}`);
    passed += 1;
  } else {
    console.error(`\x1b[31m✖ FAIL:\x1b[0m ${testName}`);
    failed += 1;
  }
}

console.log('\n=================================================');
console.log('1. TESTES: WEIGHTED INTERVAL SCHEDULING (Cap. 6.1)');
console.log('=================================================');

// Teste 1: Armadilha do Guloso (Slide 7 — Kleinberg & Tardos)
const greedyTrapJobs = [
  { id: 'a', name: 'Matéria Curta', start: 0, finish: 3, weight: 1 },
  { id: 'b', name: 'Matéria Prioritária', start: 0, finish: 10, weight: 999 },
];
const trapResult = solveWeightedIntervalScheduling(greedyTrapJobs);
assert(trapResult.optimalValue === 999, 'Slide 7: PD seleciona valor ótimo 999 em vez da armadilha gulosa');
assert(trapResult.selectedJobIds.length === 1 && trapResult.selectedJobIds[0] === 'b', 'Slide 7: Reconstrução seleciona exatamente o job b');
assert(trapResult.greedyComparison.totalValue === 1, 'Slide 7: Algoritmo Guloso (EFT) cai na armadilha e obtém apenas 1');
assert(trapResult.greedyComparison.valueLost === 998, 'Slide 7: Perda do algoritmo guloso calculada corretamente (998)');

// Teste 2: Exemplo clássico de 8 intervalos (Slide 8 — verificação de p(j))
const slide8Jobs = [
  { id: 'j3', name: 'Job 3', start: 0, finish: 6, weight: 6 },
  { id: 'j1', name: 'Job 1', start: 1, finish: 4, weight: 3 },
  { id: 'j2', name: 'Job 2', start: 3, finish: 5, weight: 4 },
  { id: 'j4', name: 'Job 4', start: 4, finish: 7, weight: 5 },
  { id: 'j5', name: 'Job 5', start: 3, finish: 8, weight: 7 },
  { id: 'j6', name: 'Job 6', start: 5, finish: 9, weight: 8 },
  { id: 'j7', name: 'Job 7', start: 6, finish: 10, weight: 6 },
  { id: 'j8', name: 'Job 8', start: 8, finish: 11, weight: 4 },
];
const slide8Result = solveWeightedIntervalScheduling(slide8Jobs);
assert(slide8Result.predecessors[2] === 0, 'Slide 8: p(2) = 0 calculado corretamente via busca binária');
assert(slide8Result.predecessors[7] === 3, 'Slide 8: p(7) = 3 calculado corretamente via busca binária');
assert(slide8Result.predecessors[8] === 5, 'Slide 8: p(8) = 5 calculado corretamente via busca binária');
const sumSelectedSlide8 = slide8Result.selectedJobs.reduce((acc, j) => acc + j.weight, 0);
assert(sumSelectedSlide8 === slide8Result.optimalValue, 'Slide 8: Soma dos pesos reconstruídos confere com M[n]');

// Teste 3: Horários em formato "HH:MM" e intervalos adjacentes (f_i === s_j)
const unbAdjacentJobs = [
  { id: 'PAA', name: 'Projeto de Algoritmos', start: '08:00', finish: '10:00', weight: 10 },
  { id: 'CMP', name: 'Compiladores 1', start: '10:00', finish: '12:00', weight: 12 },
  { id: 'CONFLITO', name: 'Optativa Longa', start: '09:00', finish: '11:00', weight: 15 },
];
const adjacentResult = solveWeightedIntervalScheduling(unbAdjacentJobs);
assert(toMinutes('08:00') === 480 && toTimeString(480) === '08:00', 'Utilitários toMinutes/toTimeString convertem corretamente');
assert(adjacentResult.optimalValue === 22, 'Intervalos adjacentes (10:00 -> 10:00) são compatíveis e superam optativa conflitante');
assert(adjacentResult.selectedJobIds.join(',') === 'PAA,CMP', 'Reconstrução mantém ordem cronológica PAA -> CMP');

// Teste 4: Casos de borda do Weighted Interval Scheduling (vazio e unitário)
const emptySchedule = solveWeightedIntervalScheduling([]);
assert(emptySchedule.optimalValue === 0 && emptySchedule.selectedJobs.length === 0, 'Lista vazia retorna solução neutra sem erro');

const singleSchedule = solveWeightedIntervalScheduling([
  { id: 'S1', name: 'Única', start: '14:00', finish: '16:00', weight: 8 },
]);
assert(singleSchedule.optimalValue === 8 && singleSchedule.selectedJobIds[0] === 'S1', 'Lista unitária retorna exatamente o único intervalo');

console.log('\n=================================================');
console.log('2. TESTES: MOCHILA 0-1 / KNAPSACK (Cap. 6.4)');
console.log('=================================================');

// Teste 5: Exemplo clássico dos Slides 24–29 (W = 11)
// Itens: {1:(w=1,v=1), 2:(w=2,v=6), 3:(w=5,v=18), 4:(w=6,v=22), 5:(w=7,v=28)}
// Guloso (v/w) escolhe {5, 2, 1} = 35 | PD ótima escolhe {3, 4} = 40
const slideKnapsackItems = [
  { id: 'item1', name: 'Item 1', weight: 1, value: 1 },
  { id: 'item2', name: 'Item 2', weight: 2, value: 6 },
  { id: 'item3', name: 'Item 3', weight: 5, value: 18 },
  { id: 'item4', name: 'Item 4', weight: 6, value: 22 },
  { id: 'item5', name: 'Item 5', weight: 7, value: 28 },
];
const ksSlideResult = solveKnapsack01(slideKnapsackItems, 11);
assert(ksSlideResult.optimalValue === 40, 'Slide 29: Mochila 0-1 encontra valor ótimo M[5][11] = 40');
assert(ksSlideResult.dpMatrix[5][11] === 40 && ksSlideResult.dpMatrix[3][5] === 18, 'Slide 29: Células intermediárias da matriz M[i][w] batem com o livro');
assert(ksSlideResult.selectedItemIds.join(',') === 'item3,item4', 'Slide 29: Backtracking reconstrói exatamente {Item 3, Item 4}');
assert(ksSlideResult.totalWeightUsed === 11 && ksSlideResult.remainingCapacity === 0, 'Slide 29: Peso utilizado = 11 (capacidade exata)');
assert(ksSlideResult.greedyComparison.totalValue === 35, 'Slide 25: Heurística gulosa (v/w) obtém apenas 35 ({5, 2, 1})');
assert(ksSlideResult.greedyComparison.valueLost === 5, 'Slide 25: Diferença de 5 pontos entre PD (40) e Guloso (35) comprovada');
assert(
  ksSlideResult.backtrackPath[0].i === 5 &&
    ksSlideResult.backtrackPath[0].w === 11 &&
    ksSlideResult.backtrackPath[ksSlideResult.backtrackPath.length - 1].action === 'base',
  'Backtracking registra o caminho completo de M[n][W] até a linha base i=0'
);

// Teste 6: Casos de borda da Mochila 0-1
const ksZeroW = solveKnapsack01(slideKnapsackItems, 0);
assert(ksZeroW.optimalValue === 0 && ksZeroW.selectedItems.length === 0, 'Capacidade W = 0 retorna 0 itens e valor 0');

const ksEmpty = solveKnapsack01([], 20);
assert(ksEmpty.optimalValue === 0 && ksEmpty.selectedItems.length === 0, 'Lista de itens vazia retorna valor 0 com segurança');

const ksTooHeavy = solveKnapsack01(
  [
    { id: 'heavy1', name: 'Pesada 1', weight: 12, value: 50 },
    { id: 'heavy2', name: 'Pesada 2', weight: 15, value: 80 },
  ],
  10
);
assert(ksTooHeavy.optimalValue === 0 && ksTooHeavy.selectedItems.length === 0, 'Quando todos os itens excedem W, nenhum item é escolhido');

console.log('\n-------------------------------------------------');
console.log(`Resumo dos Testes: ${passed} passaram | ${failed} falharam\n`);

if (failed > 0) {
  process.exit(1);
}
