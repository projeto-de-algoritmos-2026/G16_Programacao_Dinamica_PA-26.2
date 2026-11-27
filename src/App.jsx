import React, { useState } from 'react';
import WeightedSchedule from './components/WeightedSchedule';
import KnapsackPlanner from './components/KnapsackPlanner';

function App() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          UnB Grade Planner Pro
        </h1>
        <p className="text-slate-600 mt-2 font-medium">
          Otimização de Grade Horária Ponderada e Alocação de Créditos via Programação Dinâmica
        </p>

        <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm mt-6 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Grade Ponderada (Weighted Interval)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('knapsack')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'knapsack'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Mochila de Créditos (Knapsack 0-1)
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {activeTab === 'schedule' ? <WeightedSchedule /> : <KnapsackPlanner />}
      </main>
    </div>
  );
}

export default App;
