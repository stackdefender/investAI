import React, { useState } from 'react';
import { UserCheck, Save, Sparkles, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RiskBadge } from '../components/RiskBadge';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const Profile: React.FC = () => {
  const { user, profile, updateUserProfile } = useAuth();
  
  const [age, setAge] = useState<number | string>(profile?.age || 30);
  const [country, setCountry] = useState(profile?.country || 'India');
  const [employmentStatus, setEmploymentStatus] = useState(profile?.employment_status || 'Salaried');

  const [income, setIncome] = useState<number | string>(profile?.monthly_income || 120000);
  const [expenses, setExpenses] = useState<number | string>(profile?.monthly_expenses || 50000);
  const [savings, setSavings] = useState<number | string>(profile?.monthly_savings || 70000);

  const [existingInvestments, setExistingInvestments] = useState<number | string>(profile?.existing_investments || 650000);
  const [existingLoans, setExistingLoans] = useState<number | string>(profile?.existing_loans !== undefined && profile?.existing_loans !== 0 ? profile.existing_loans : '');
  const [emergencyFund, setEmergencyFund] = useState<number | string>(profile?.emergency_fund || 300000);

  const [monthlyCapacity, setMonthlyCapacity] = useState<number | string>(profile?.monthly_investment_capacity || 25000);
  const [durationYears, setDurationYears] = useState<number | string>(profile?.investment_duration || 15);
  const [riskScore, setRiskScore] = useState<number | string>(profile?.risk_score || 62);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleNumChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setter(val === '' ? '' : Number(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      age,
      country,
      employment_status: employmentStatus,
      monthly_income: Number(income),
      monthly_expenses: Number(expenses),
      monthly_savings: Number(savings),
      existing_investments: Number(existingInvestments),
      existing_loans: Number(existingLoans),
      emergency_fund: Number(emergencyFund),
      monthly_investment_capacity: Number(monthlyCapacity),
      investment_duration: Number(durationYears),
      risk_score: Number(riskScore)
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            FINANCIAL PROFILE SETTINGS
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Your Financial Profile</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update your income, cash flow, and risk score to refine AI investment plan outputs.
          </p>
        </div>

        <RiskBadge label={profile?.risk_tolerance_label || 'Moderate'} score={profile?.risk_score || 62} />
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 sm:p-8 space-y-6 shadow-xl glass-panel">
        
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            ✓ Financial profile saved successfully! AI engine updated.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={handleNumChange(setAge)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Employment Status</label>
            <input
              type="text"
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-800">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Monthly Gross Income (₹)</label>
            <input
              type="number"
              value={income}
              onChange={handleNumChange(setIncome)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Monthly Expenses (₹)</label>
            <input
              type="number"
              value={expenses}
              onChange={handleNumChange(setExpenses)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Emergency Fund (₹)</label>
            <input
              type="number"
              value={emergencyFund}
              onChange={handleNumChange(setEmergencyFund)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-800">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Monthly Investment Capacity (₹)</label>
            <input
              type="number"
              value={monthlyCapacity}
              onChange={handleNumChange(setMonthlyCapacity)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Investment Horizon (Years)</label>
            <input
              type="number"
              value={durationYears}
              onChange={handleNumChange(setDurationYears)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Risk Score (0 - 100)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={riskScore}
              onChange={handleNumChange(setRiskScore)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" /> Save Financial Profile
          </button>
        </div>
      </form>

      <SafetyDisclaimer />
    </div>
  );
};
