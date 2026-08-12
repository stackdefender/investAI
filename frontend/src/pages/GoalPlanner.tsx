import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Sparkles, TrendingUp, Calculator } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { goalService } from '../services/goalService';
import { formatCurrency } from '../utils/formatters';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { FinancialGoal } from '../types';

export const GoalPlanner: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Goal Form
  const [title, setTitle] = useState('Dream Home Down Payment');
  const [category, setCategory] = useState('House');
  const [targetAmount, setTargetAmount] = useState<number | string>(5000000);
  const [currentAmount, setCurrentAmount] = useState<number | string>(500000);
  const [targetYears, setTargetYears] = useState<number | string>(10);
  const [expectedReturn, setExpectedReturn] = useState<number | string>(11);

  const resetForm = () => {
    setTitle('');
    setCategory('House');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetYears('');
    setExpectedReturn(11);
  };

  const openCreateModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const fetchGoals = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await goalService.getGoals(user.id);
      setGoals(res);
    } catch (err) {
      console.error('Goal fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user?.id]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await goalService.createGoal(user.id, {
        title: title.trim() || `${category} Goal`,
        goal_category: category,
        target_amount: Number(targetAmount) || 0,
        current_amount: Number(currentAmount) || 0,
        target_years: Number(targetYears) || 1,
        expected_return_rate: Number(expectedReturn) || 10
      });
      setShowAddModal(false);
      fetchGoals();
    } catch (err) {
      console.error('Create goal error:', err);
    }
  };

  const handleDeleteGoal = async (goalId?: number) => {
    if (!goalId) return;
    try {
      await goalService.deleteGoal(goalId);
      fetchGoals();
    } catch (err) {
      console.error('Delete goal error:', err);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20 mb-2">
            <Target className="w-3.5 h-3.5" />
            FINANCIAL GOAL ALGORITHM
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Financial Goal Planner</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Calculate the exact monthly SIP required to achieve your house, education, or wealth creation goals.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          const progressPct = Math.min(100, Math.round((g.current_amount / (g.target_amount || 1)) * 100));
          return (
            <div key={g.id} className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-xl glass-panel relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">{g.goal_category}</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{g.title}</h3>
                  <span className="text-xs text-slate-400">Target Timeframe: {g.target_years} Years (@{g.expected_return_rate}% Return)</span>
                </div>
                <button
                  onClick={() => handleDeleteGoal(g.id)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Accumulated: {formatCurrency(g.current_amount)}</span>
                  <span className="text-white">Target: {formatCurrency(g.target_amount)} ({progressPct}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Required Monthly SIP Box */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-400 font-bold block">Required Monthly SIP</span>
                  <span className="text-[11px] text-slate-400">To bridge shortfall before target year</span>
                </div>
                <div className="text-base font-extrabold text-emerald-300">
                  {formatCurrency(g.monthly_sip_required)} / mo
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Create Financial Goal</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="House">House / Real Estate</option>
                    <option value="Education">Higher Education</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Vehicle">Dream Vehicle</option>
                    <option value="Wealth">Wealth Creation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Goal Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream Home Down Payment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000000"
                    value={targetAmount}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setTargetAmount(e.target.value === '' ? '' : e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Current Savings (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={currentAmount}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCurrentAmount(e.target.value === '' ? '' : e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10"
                    value={targetYears}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setTargetYears(e.target.value === '' ? '' : e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Expected Return (%)</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    placeholder="e.g. 11"
                    value={expectedReturn}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setExpectedReturn(e.target.value === '' ? '' : e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-glow-emerald"
                >
                  Calculate & Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SafetyDisclaimer />
    </div>
  );
};
