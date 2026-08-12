import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { educationService } from '../services/educationService';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';

export const Learn: React.FC = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [activeModule, setActiveModule] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const res = await educationService.getModules();
        setModules(res);
        if (res.length > 0) setActiveModule(res[0]);
      } catch (err) {
        console.error('Education fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const handleSelectModule = (mod: any) => {
    setActiveModule(mod);
    setSelectedOption(null);
    setShowResult(false);
  };

  const handleCheckQuiz = () => {
    if (selectedOption !== null) {
      setShowResult(true);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          FINANCIAL LITERACY & INTERACTIVE QUIZZES
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Financial Education Center</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Master stock market basics, compounding rules, SIP strategies, and investment tax rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Module Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Educational Modules</h3>
          
          <div className="space-y-2">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelectModule(m)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  activeModule?.id === m.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-glow-emerald'
                    : 'bg-[#131A29] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-bold">{m.category}</span>
                  <span className="text-[10px] text-slate-400">{m.read_time}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{m.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{m.summary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Lesson Content & Interactive Quiz */}
        {activeModule && (
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#131A29] p-6 sm:p-8 space-y-6 shadow-xl glass-panel">
            
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{activeModule.category} • {activeModule.level}</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{activeModule.title}</h2>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 leading-relaxed whitespace-pre-line">
              {activeModule.content}
            </div>

            {/* Quiz Box */}
            {activeModule.quiz && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Knowledge Check Quiz</h3>
                </div>

                <p className="text-xs text-slate-200 font-semibold">{activeModule.quiz.question}</p>

                <div className="space-y-2 text-xs">
                  {activeModule.quiz.options.map((opt: string, optIdx: number) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        setSelectedOption(optIdx);
                        setShowResult(false);
                      }}
                      className={`w-full p-3 rounded-xl border text-left font-medium transition-all ${
                        selectedOption === optIdx
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleCheckQuiz}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold text-xs shadow-glow-emerald transition-all"
                  >
                    Submit Answer
                  </button>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-xl border text-xs space-y-1 ${
                    selectedOption === activeModule.quiz.correct_index
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {selectedOption === activeModule.quiz.correct_index ? (
                        <> <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct! Excellent work. </>
                      ) : (
                        <> <XCircle className="w-4 h-4 text-rose-400" /> Incorrect Answer </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed pt-1 text-slate-300">
                      {activeModule.quiz.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      <SafetyDisclaimer />
    </div>
  );
};
