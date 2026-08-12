import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, DollarSign, Wallet, Target, ShieldAlert, ArrowRight, ArrowLeft, 
  CheckCircle2, Sparkles 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const OnboardingQuestionnaire: React.FC = () => {
  const { profile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
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
  const [initialAmount, setInitialAmount] = useState<number | string>(profile?.initial_investment_amount || 100000);
  const [durationYears, setDurationYears] = useState<number | string>(profile?.investment_duration || 15);

  const handleNumChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setter(val === '' ? '' : Number(val));
  };

  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile?.financial_goals && profile.financial_goals.length > 0
      ? profile.financial_goals
      : ['Wealth Creation', 'Retirement']
  );

  // Risk Tolerance Questionnaire Answers (Points 0 - 100)
  const [q1, setQ1] = useState<number>(25); // Market drop reaction
  const [q2, setQ2] = useState<number>(25); // Investment objective priority
  const [q3, setQ3] = useState<number>(25); // Financial stability buffer

  const goalOptions = [
    'Wealth Creation',
    'Retirement',
    'House Purchase',
    'Children Education',
    'Emergency Fund',
    'Children\'s Future',
    'Travel & Lifestyle',
    'Other'
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const calculateRiskScore = (): { score: number; label: 'Conservative' | 'Moderately Conservative' | 'Moderate' | 'Moderately Aggressive' | 'Aggressive' } => {
    const rawScore = q1 + q2 + q3; // 0 to 100 max sum
    const score = Math.min(100, Math.max(10, rawScore));
    let label: 'Conservative' | 'Moderately Conservative' | 'Moderate' | 'Moderately Aggressive' | 'Aggressive' = 'Moderate';

    if (score <= 25) label = 'Conservative';
    else if (score <= 45) label = 'Moderately Conservative';
    else if (score <= 65) label = 'Moderate';
    else if (score <= 82) label = 'Moderately Aggressive';
    else label = 'Aggressive';

    return { score, label };
  };

  const handleFinish = async () => {
    const { score, label } = calculateRiskScore();

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
      initial_investment_amount: Number(initialAmount),
      investment_duration: Number(durationYears),
      financial_goals: selectedGoals,
      risk_score: score,
      risk_tolerance_label: label
    });

    // Navigate to AI Personal Planner
    navigate('/ai-planner');
  };

  const totalSteps = 6;

  return (
    <div className="min-h-screen bg-[#0B0F17] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            FINANCIAL PROFILE QUESTIONNAIRE
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Let's Personalize Your AI Investment Engine</h1>
          <p className="text-xs sm:text-sm text-slate-400">Step {currentStep} of {totalSteps} — Takes less than 2 minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Questionnaire Form Container */}
        <div className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 sm:p-8 shadow-2xl glass-panel space-y-6">

          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Personal Information
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={handleNumChange(setAge)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Country of Residence</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="UAE">UAE</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Employment Status</label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Salaried Employee">Salaried Employee</option>
                  <option value="Business / Self-Employed">Business / Self-Employed</option>
                  <option value="Professional (Doctor/Lawyer/CA)">Professional</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Income & Expenses */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Monthly Cash Flow (₹)
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Monthly Gross Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={handleNumChange(setIncome)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Monthly Expenses (Rent, Food, EMI) (₹)</label>
                <input
                  type="number"
                  value={expenses}
                  onChange={handleNumChange(setExpenses)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Surplus Monthly Savings (Income - Expenses) (₹)</label>
                <input
                  type="number"
                  value={savings}
                  onChange={handleNumChange(setSavings)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Existing Finances */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                Current Balance Sheet
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Existing Investments Total Value (Stocks, Funds, FD, EPF) (₹)</label>
                <input
                  type="number"
                  value={existingInvestments}
                  onChange={handleNumChange(setExistingInvestments)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Existing Loans & Liabilities (Personal / Home Loan) (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={existingLoans}
                  onChange={handleNumChange(setExistingLoans)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Emergency Fund Balance (Liquid Savings / FD) (₹)</label>
                <input
                  type="number"
                  value={emergencyFund}
                  onChange={handleNumChange(setEmergencyFund)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Investment Capacity */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Investment Capacity & Horizon
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Monthly Investment Capacity (SIP Amount) (₹)</label>
                <input
                  type="number"
                  value={monthlyCapacity}
                  onChange={handleNumChange(setMonthlyCapacity)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Initial Lump Sum Capital Available (₹)</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={handleNumChange(setInitialAmount)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Investment Duration Horizon (Years)</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={durationYears}
                  onChange={handleNumChange(setDurationYears)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Goals */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Financial Goals (Select All That Apply)
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {goalOptions.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Risk Tolerance Questionnaire */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                Risk Tolerance Assessment
              </h3>

              {/* Q1 */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  1. If the stock market drops 20% in a single month, how would you react?
                </label>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setQ1(10)}
                    className={`w-full p-2.5 rounded-xl border text-left ${q1 === 10 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    Sell all investments immediately to prevent further loss. (Conservative)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ1(25)}
                    className={`w-full p-2.5 rounded-xl border text-left ${q1 === 25 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    Hold steady and wait for market recovery. (Moderate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ1(40)}
                    className={`w-full p-2.5 rounded-xl border text-left ${q1 === 40 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    Invest more aggressively at lower discount prices! (Aggressive)
                  </button>
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  2. What is your primary investment objective?
                </label>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setQ2(10)}
                    className={`w-full p-2.5 rounded-xl border text-left ${q2 === 10 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    Capital preservation with zero risk of nominal loss.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ2(25)}
                    className={`w-full p-2.5 rounded-xl border text-left ${q2 === 25 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    Balanced growth beating inflation with moderate fluctuations.
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ2(35)}
                    className={`w-full p-2.5 rounded-xl border text-left ${q2 === 35 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    Maximum long-term wealth compounding, tolerating high volatility.
                  </button>
                </div>
              </div>

              {/* Score Live Preview */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Calculated Risk Score:</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {calculateRiskScore().label} ({calculateRiskScore().score}/100)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-extrabold shadow-glow-emerald flex items-center gap-1.5"
              >
                Generate My AI Plan <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        <SafetyDisclaimer />
      </div>
    </div>
  );
};
