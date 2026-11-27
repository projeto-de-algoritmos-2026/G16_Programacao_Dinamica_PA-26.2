import React from 'react';

/**
 * src/components/ComparisonBanner.jsx
 * Cards comparativos entre Programação Dinâmica (Ótimo Global) e Algoritmo Guloso (Heurística Local).
 * TODO (Daniel): Refinar visual, badges de alerta quando valueLost > 0 e explicação didática.
 */
export default function ComparisonBanner({
  dpValue,
  greedyValue,
  valueLost,
  gainPercentage,
  unitLabel = 'pts',
  greedyMethodLabel = 'Algoritmo Guloso',
}) {
  const greedyFailed = valueLost > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Programação Dinâmica (Ótimo)
        </div>
        <div className="text-2xl font-extrabold text-emerald-900 mt-1">
          {dpValue} <span className="text-sm font-medium text-emerald-700">{unitLabel}</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          {greedyMethodLabel}
        </div>
        <div className="text-2xl font-extrabold text-amber-900 mt-1">
          {greedyValue} <span className="text-sm font-medium text-amber-700">{unitLabel}</span>
        </div>
      </div>

      <div
        className={`rounded-xl p-4 border ${
          greedyFailed
            ? 'bg-indigo-50 border-indigo-200'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Ganho da PD sobre o Guloso
        </div>
        <div className="text-2xl font-extrabold text-slate-900 mt-1">
          {greedyFailed ? `+${valueLost} ${unitLabel} (+${gainPercentage}%)` : 'Empate neste cenário'}
        </div>
      </div>
    </div>
  );
}
