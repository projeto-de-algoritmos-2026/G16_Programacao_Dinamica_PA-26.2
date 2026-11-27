import React, { useMemo, useState } from 'react';
import { knapsackPresets } from '../utils/semesterData';
import { solveKnapsack01 } from '../utils/dynamicProgramming';
import ComparisonBanner from './ComparisonBanner';

/**
 * src/components/KnapsackPlanner.jsx
 * Painel 2: Alocação Ótima de Créditos via Mochila 0-1 (Seção 6.4 — Theta(n * W)).
 *
 * TODO (Daniel):
 * 1. Implementar slider interativo para capacidade máxima W (créditos/horas) e edição dos itens.
 * 2. Renderizar a Matriz DP interativa `analysis.dpMatrix` (n+1 x W+1), destacando cada célula
 *    presente em `analysis.backtrackPath` (verde para 'take', azul para 'skip', cinza para 'base').
 * 3. Exibir lado a lado os itens escolhidos pela PD vs. heurística Gulosa (v_i / w_i).
 */
export default function KnapsackPlanner() {
  const preset = knapsackPresets.classicSlide;
  const [capacityW, setCapacityW] = useState(preset.defaultCapacity);

  const analysis = useMemo(() => {
    return solveKnapsack01(preset.items, capacityW);
  }, [preset, capacityW]);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Alocação Ótima de Créditos (Mochila 0-1 / Knapsack)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Matriz M[i, w] em tempo pseudopolinomial O(n · W) com reconstrução visual por backtracking.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200">
          <label htmlFor="capacity-slider" className="text-xs font-bold uppercase text-slate-500">
            Capacidade W:
          </label>
          <input
            id="capacity-slider"
            type="range"
            min={0}
            max={preset.maxCapacity}
            value={capacityW}
            onChange={(e) => setCapacityW(Number(e.target.value))}
            className="accent-emerald-600 cursor-pointer"
          />
          <span className="font-mono font-bold text-slate-800 w-8 text-right">{capacityW}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <ComparisonBanner
          dpValue={analysis.optimalValue}
          greedyValue={analysis.greedyComparison.totalValue}
          valueLost={analysis.greedyComparison.valueLost}
          gainPercentage={analysis.greedyComparison.gainPercentage}
          unitLabel="valor"
          greedyMethodLabel="Guloso (Razão v_i / w_i)"
        />

        <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
          <strong>Scaffold pronto (consumindo dynamicProgramming.js):</strong>{' '}
          {analysis.selectedItems.length} item(ns) escolhido(s) ({analysis.totalWeightUsed}/{capacityW} créditos):{' '}
          {analysis.selectedItems.map((it) => it.name).join(', ') || 'nenhum'}.
          Substituir este bloco pela tabela de itens e pela Matriz DP interativa M[i, w].
        </div>
      </div>
    </section>
  );
}
