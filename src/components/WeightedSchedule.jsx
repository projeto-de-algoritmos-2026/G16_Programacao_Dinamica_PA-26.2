import React, { useMemo, useState } from 'react';
import { schedulePresets } from '../utils/semesterData';
import { solveWeightedIntervalScheduling } from '../utils/dynamicProgramming';
import ComparisonBanner from './ComparisonBanner';

/**
 * src/components/WeightedSchedule.jsx
 * Painel 1: Weighted Interval Scheduling (Seção 6.1 — O(n log n)).
 *
 * TODO (Daniel):
 * 1. Implementar visualização em linha do tempo (Gantt) comparando seleção da PD vs. Guloso.
 * 2. Permitir editar pesos (sliders/inputs) ou ativar/desativar disciplinas dinamicamente.
 * 3. Construir o inspetor expansível da Tabela DP exibindo `j`, `p(j)`, `v_j + M[p(j)]`,
 *    `M[j-1]`, `M[j]` e os passos de reconstrução (`analysis.backtrackSteps`).
 */
export default function WeightedSchedule() {
  const [presetKey, setPresetKey] = useState('unbDefault');
  const currentPreset = schedulePresets[presetKey];

  const analysis = useMemo(() => {
    return solveWeightedIntervalScheduling(currentPreset.jobs);
  }, [currentPreset]);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Grade Horária Ponderada (Weighted Interval Scheduling)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            PD Bottom-Up em O(n log n) com busca binária para p(j) e reconstrução ótima.
          </p>
        </div>

        <select
          value={presetKey}
          onChange={(e) => setPresetKey(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 font-medium"
        >
          {Object.entries(schedulePresets).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-6 space-y-6">
        <ComparisonBanner
          dpValue={analysis.optimalValue}
          greedyValue={analysis.greedyComparison.totalValue}
          valueLost={analysis.greedyComparison.valueLost}
          gainPercentage={analysis.greedyComparison.gainPercentage}
          unitLabel="pts"
          greedyMethodLabel="Guloso (Earliest Finish Time)"
        />

        <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
          <strong>Scaffold pronto (consumindo dynamicProgramming.js):</strong>{' '}
          {analysis.selectedJobs.length} disciplina(s) escolhida(s) pela PD (
          {analysis.selectedJobs.map((j) => j.name).join(', ') || 'nenhuma'}).
          Substituir este bloco pelo diagrama de Gantt interativo e pela tabela DP M[j] / p(j).
        </div>
      </div>
    </section>
  );
}
