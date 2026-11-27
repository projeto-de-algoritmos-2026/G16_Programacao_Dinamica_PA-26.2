/**
 * src/utils/dynamicProgramming.js
 * Módulo 4: Programação Dinâmica (Dynamic Programming) - UnB Grade Planner Pro
 * Dupla 16: Rodrigo Henrique Donato (@Fofodoido) & Daniel de Oliveira Lira (@Daniellira540)
 *
 * Implementação 100% do zero (sem bibliotecas externas nem métodos prontos de ordenação),
 * desacoplada de React/DOM e baseada em Kleinberg & Tardos (Capítulo 6: Seções 6.1 e 6.4).
 */

// ==========================================
// 1. UTILITÁRIOS DE TEMPO E ORDENAÇÃO PURA
// ==========================================

/**
 * Converte string de horário ("HH:MM") para minutos desde 00:00.
 * Também aceita números diretamente (ex.: unidades abstratas 0..11 dos slides).
 */
export const toMinutes = (time) => {
  if (typeof time === 'number') return Number.isFinite(time) ? time : 0;
  if (typeof time === 'string' && time.includes(':')) {
    const [hours, minutes] = time.split(':').map(Number);
    return (Number.isFinite(hours) ? hours : 0) * 60 + (Number.isFinite(minutes) ? minutes : 0);
  }
  const parsed = Number(time);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Converte minutos acumulados para string legível "HH:MM".
 */
export const toTimeString = (totalMinutes) => {
  const safe = Math.max(0, Math.floor(Number(totalMinutes) || 0));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * MergeSort estável implementado manualmente em O(n log n) para ordenação
 * determinística sem dependência de bibliotecas ou sort nativo.
 */
export const mergeSort = (arr, compareFn) => {
  if (!Array.isArray(arr) || arr.length <= 1) {
    return Array.isArray(arr) ? [...arr] : [];
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);

  const merged = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      merged.push(left[i]);
      i += 1;
    } else {
      merged.push(right[j]);
      j += 1;
    }
  }

  while (i < left.length) {
    merged.push(left[i]);
    i += 1;
  }

  while (j < right.length) {
    merged.push(right[j]);
    j += 1;
  }

  return merged;
};

// ==========================================
// 2. WEIGHTED INTERVAL SCHEDULING (Seção 6.1)
// Complexidade: O(n log n) tempo | O(n) espaço
// ==========================================

/**
 * Calcula o vetor p(j) para j = 1..n usando Busca Binária em O(n log n).
 * p(j) = maior índice i < j (1-based) tal que o intervalo i é compatível com j (f_i <= s_j).
 * Retorna 0 caso não exista nenhum intervalo compatível anterior.
 *
 * @param {Array<Object>} sortedJobs - Jobs já ordenados por finishMinutes crescente
 * @returns {Array<number>} Vetor 1-indexed de tamanho n + 1 (p[0] = 0)
 */
export const computePredecessors = (sortedJobs) => {
  const n = sortedJobs.length;
  const p = new Array(n + 1).fill(0);

  for (let j = 1; j <= n; j += 1) {
    const currentStart = sortedJobs[j - 1].startMinutes;
    let low = 0;
    let high = j - 2;
    let bestIndex = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (sortedJobs[mid].finishMinutes <= currentStart) {
        bestIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    p[j] = bestIndex + 1;
  }

  return p;
};

/**
 * Estratégia Gulosa (Earliest Finish Time — Módulo 2) usada para contraste visual,
 * demonstrando por que o algoritmo ambicioso falha quando há pesos arbitrários.
 */
export const greedyIntervalScheduling = (sortedJobs) => {
  const selectedJobs = [];
  let lastFinish = -Infinity;
  let totalValue = 0;

  for (let i = 0; i < sortedJobs.length; i += 1) {
    const job = sortedJobs[i];
    if (job.startMinutes >= lastFinish) {
      selectedJobs.push(job);
      lastFinish = job.finishMinutes;
      totalValue += job.weight;
    }
  }

  return {
    selectedJobs,
    selectedJobIds: selectedJobs.map((j) => j.id),
    totalValue,
  };
};

/**
 * Resolve o Weighted Interval Scheduling via Programação Dinâmica Bottom-Up
 * e reconstrói a solução ótima via Find-Solution em O(n).
 *
 * Recorrência:
 *   M[0] = 0
 *   M[j] = max(v_j + M[p(j)], M[j - 1])
 *
 * @param {Array<Object>} jobs - Lista de disciplinas/intervalos [{ id, code, name, start, finish, weight }]
 */
export const solveWeightedIntervalScheduling = (jobs) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return {
      sortedJobs: [],
      predecessors: [0],
      dpTable: [0],
      selectedJobs: [],
      selectedJobIds: [],
      optimalValue: 0,
      decisionTrace: [],
      backtrackSteps: [],
      greedyComparison: {
        selectedJobs: [],
        selectedJobIds: [],
        totalValue: 0,
        valueLost: 0,
        gainPercentage: 0,
      },
    };
  }

  // Normaliza tempos e pesos sem mutar o array original
  const normalized = jobs.map((job) => ({
    ...job,
    startMinutes: toMinutes(job.start),
    finishMinutes: toMinutes(job.finish),
    weight: Number(job.weight ?? job.value ?? 0),
  }));

  // 1. Ordena por horário de término crescente: f_1 <= f_2 <= ... <= f_n
  const sortedRaw = mergeSort(normalized, (a, b) => {
    if (a.finishMinutes !== b.finishMinutes) return a.finishMinutes - b.finishMinutes;
    if (a.startMinutes !== b.startMinutes) return a.startMinutes - b.startMinutes;
    return b.weight - a.weight;
  });

  // 2. Calcula p(1..n) em O(n log n) via busca binária
  const predecessors = computePredecessors(sortedRaw);

  // Anexa metadados 1-based (dpIndex e pIndex) para facilitar a visualização no frontend
  const sortedJobs = sortedRaw.map((job, idx) => ({
    ...job,
    dpIndex: idx + 1,
    pIndex: predecessors[idx + 1],
  }));

  const n = sortedJobs.length;

  // 3. Preenchimento Bottom-Up da tabela M[0..n] em O(n)
  const dpTable = new Array(n + 1).fill(0);
  const decisionTrace = [];

  for (let j = 1; j <= n; j += 1) {
    const job = sortedJobs[j - 1];
    const pJ = predecessors[j];
    const includeValue = job.weight + dpTable[pJ];
    const excludeValue = dpTable[j - 1];
    const shouldInclude = includeValue > excludeValue;

    dpTable[j] = shouldInclude ? includeValue : excludeValue;

    decisionTrace.push({
      j,
      jobId: job.id,
      jobCode: job.code ?? job.id,
      jobName: job.name,
      start: job.start,
      finish: job.finish,
      weight: job.weight,
      pIndex: pJ,
      pJobName: pJ > 0 ? sortedJobs[pJ - 1].name : null,
      includeValue,
      excludeValue,
      optimalUpToJ: dpTable[j],
      chosen: shouldInclude ? 'include' : 'exclude',
    });
  }

  // 4. Reconstrução da solução ótima (Find-Solution) em O(n)
  const selectedJobs = [];
  const backtrackSteps = [];
  let curr = n;

  while (curr > 0) {
    const job = sortedJobs[curr - 1];
    const pCurr = predecessors[curr];
    const includeValue = job.weight + dpTable[pCurr];
    const excludeValue = dpTable[curr - 1];

    if (includeValue > excludeValue) {
      selectedJobs.push(job);
      backtrackSteps.push({
        j: curr,
        jobId: job.id,
        jobName: job.name,
        action: 'include',
        nextJ: pCurr,
        weight: job.weight,
        dpValue: dpTable[curr],
      });
      curr = pCurr;
    } else {
      backtrackSteps.push({
        j: curr,
        jobId: job.id,
        jobName: job.name,
        action: 'exclude',
        nextJ: curr - 1,
        weight: job.weight,
        dpValue: dpTable[curr],
      });
      curr -= 1;
    }
  }

  selectedJobs.reverse();

  const optimalValue = dpTable[n];

  // 5. Comparativo direto com o algoritmo Guloso (Módulo 2)
  const greedyResult = greedyIntervalScheduling(sortedJobs);
  const valueLost = optimalValue - greedyResult.totalValue;
  const gainPercentage =
    greedyResult.totalValue > 0
      ? Number((((optimalValue - greedyResult.totalValue) / greedyResult.totalValue) * 100).toFixed(1))
      : optimalValue > 0
        ? 100
        : 0;

  return {
    sortedJobs,
    predecessors,
    dpTable,
    selectedJobs,
    selectedJobIds: selectedJobs.map((j) => j.id),
    optimalValue,
    decisionTrace,
    backtrackSteps,
    greedyComparison: {
      ...greedyResult,
      valueLost,
      gainPercentage,
    },
  };
};

// ==========================================
// 3. PROBLEMA DA MOCHILA 0-1 / KNAPSACK (Seção 6.4)
// Complexidade: O(n * W) tempo e espaço (pseudopolinomial)
// ==========================================

/**
 * Heurística Gulosa por maior razão valor/peso (v_i / w_i) — Slide 25.
 * Utilizada no frontend para demonstrar casos onde a escolha local não é ótima.
 */
export const greedyKnapsackByRatio = (items, capacityW) => {
  const safeW = Math.max(0, Math.floor(Number(capacityW) || 0));
  if (!Array.isArray(items) || items.length === 0 || safeW === 0) {
    return {
      selectedItems: [],
      selectedItemIds: [],
      totalValue: 0,
      totalWeightUsed: 0,
    };
  }

  const sortedByRatio = mergeSort(items, (a, b) => {
    const ratioA = a.weight > 0 ? a.value / a.weight : Infinity;
    const ratioB = b.weight > 0 ? b.value / b.weight : Infinity;
    if (ratioB !== ratioA) return ratioB - ratioA;
    if (b.value !== a.value) return b.value - a.value;
    return a.weight - b.weight;
  });

  const selectedItems = [];
  let remaining = safeW;
  let totalValue = 0;
  let totalWeightUsed = 0;

  for (let i = 0; i < sortedByRatio.length; i += 1) {
    const item = sortedByRatio[i];
    if (item.weight <= remaining && item.value > 0) {
      selectedItems.push(item);
      remaining -= item.weight;
      totalValue += item.value;
      totalWeightUsed += item.weight;
    }
  }

  return {
    selectedItems,
    selectedItemIds: selectedItems.map((it) => it.id),
    totalValue,
    totalWeightUsed,
  };
};

/**
 * Resolve o Problema da Mochila 0-1 via Programação Dinâmica Bottom-Up
 * gerando a matriz completa M[0..n][0..W] e o rastreio exato do backtracking.
 *
 * Recorrência:
 *   M[0, w] = 0
 *   M[i, w] = M[i - 1, w]                                     se w_i > w
 *   M[i, w] = max(M[i - 1, w], v_i + M[i - 1, w - w_i])       caso contrário
 *
 * @param {Array<Object>} items - Lista de itens/disciplinas [{ id, code, name, weight, value }]
 * @param {number} capacityW - Capacidade máxima inteira (ex.: créditos ou horas semanais)
 */
export const solveKnapsack01 = (items, capacityW) => {
  const W = Math.max(0, Math.floor(Number(capacityW) || 0));
  const normalizedItems = Array.isArray(items)
    ? items.map((item, idx) => ({
        ...item,
        itemIndex: idx + 1,
        weight: Math.max(0, Math.floor(Number(item.weight) || 0)),
        value: Number(item.value) || 0,
        ratio:
          Number(item.weight) > 0
            ? Number((Number(item.value || 0) / Number(item.weight)).toFixed(2))
            : 0,
      }))
    : [];

  const n = normalizedItems.length;

  // Matriz (n + 1) x (W + 1) inicializada com zeros
  const dpMatrix = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  if (n === 0 || W === 0) {
    return {
      items: normalizedItems,
      capacityW: W,
      dpMatrix,
      selectedItems: [],
      selectedItemIds: [],
      optimalValue: 0,
      totalWeightUsed: 0,
      remainingCapacity: W,
      backtrackPath: [],
      greedyComparison: {
        selectedItems: [],
        selectedItemIds: [],
        totalValue: 0,
        totalWeightUsed: 0,
        valueLost: 0,
        gainPercentage: 0,
      },
    };
  }

  // 1. Preenchimento Bottom-Up da matriz M[i][w] em Theta(n * W)
  for (let i = 1; i <= n; i += 1) {
    const { weight: wi, value: vi } = normalizedItems[i - 1];
    for (let w = 0; w <= W; w += 1) {
      if (wi > w) {
        dpMatrix[i][w] = dpMatrix[i - 1][w];
      } else {
        const excludeVal = dpMatrix[i - 1][w];
        const includeVal = vi + dpMatrix[i - 1][w - wi];
        dpMatrix[i][w] = includeVal > excludeVal ? includeVal : excludeVal;
      }
    }
  }

  // 2. Reconstrução (Backtracking) a partir de M[n][W] em O(n)
  const selectedItems = [];
  const backtrackPath = [];
  let currW = W;

  for (let i = n; i >= 1; i -= 1) {
    const item = normalizedItems[i - 1];
    const cellValue = dpMatrix[i][currW];
    const excludeVal = dpMatrix[i - 1][currW];
    const canFit = item.weight <= currW;
    const includeVal = canFit ? item.value + dpMatrix[i - 1][currW - item.weight] : -Infinity;

    if (canFit && includeVal === cellValue && includeVal > excludeVal) {
      selectedItems.push(item);
      backtrackPath.push({
        i,
        w: currW,
        itemId: item.id,
        itemName: item.name,
        action: 'take',
        nextI: i - 1,
        nextW: currW - item.weight,
        cellValue,
      });
      currW -= item.weight;
    } else {
      backtrackPath.push({
        i,
        w: currW,
        itemId: item.id,
        itemName: item.name,
        action: 'skip',
        nextI: i - 1,
        nextW: currW,
        cellValue,
      });
    }
  }

  // Registra a célula base (0, currW) onde o backtracking encerra
  backtrackPath.push({
    i: 0,
    w: currW,
    itemId: null,
    itemName: null,
    action: 'base',
    nextI: null,
    nextW: null,
    cellValue: dpMatrix[0][currW],
  });

  selectedItems.reverse();

  const optimalValue = dpMatrix[n][W];
  const totalWeightUsed = selectedItems.reduce((acc, it) => acc + it.weight, 0);

  // 3. Comparativo direto com a heurística Gulosa (v_i / w_i)
  const greedyResult = greedyKnapsackByRatio(normalizedItems, W);
  const valueLost = optimalValue - greedyResult.totalValue;
  const gainPercentage =
    greedyResult.totalValue > 0
      ? Number((((optimalValue - greedyResult.totalValue) / greedyResult.totalValue) * 100).toFixed(1))
      : optimalValue > 0
        ? 100
        : 0;

  return {
    items: normalizedItems,
    capacityW: W,
    dpMatrix,
    selectedItems,
    selectedItemIds: selectedItems.map((it) => it.id),
    optimalValue,
    totalWeightUsed,
    remainingCapacity: W - totalWeightUsed,
    backtrackPath,
    greedyComparison: {
      ...greedyResult,
      valueLost,
      gainPercentage,
    },
  };
};
