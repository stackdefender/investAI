import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User as UserIcon, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useAuth } from '../contexts/AuthContext';
import { SafetyDisclaimer } from './SafetyDisclaimer';

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; followups?: string[] }>>([
    {
      sender: 'ai',
      text: `Hello ${user?.full_name ? user.full_name.split(' ')[0] : 'there'}! I'm your InvestAI Financial Assistant. Ask me anything about stock markets, asset allocation, mutual funds, or market timing.`,
      followups: [
        'How should I divide my ₹10,000 monthly investment?',
        'Is Nifty 50 risky right now?',
        'What is a good SIP strategy for retirement?'
      ]
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim() || loading) return;

    const userMsg = query;
    setPrompt('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const context = profile ? {
        risk_profile: profile.risk_tolerance_label,
        risk_score: profile.risk_score,
        monthly_income: profile.monthly_income,
        monthly_capacity: profile.monthly_investment_capacity,
        age: profile.age
      } : undefined;

      const res = await aiService.askChatbot(userMsg, context);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          followups: res.suggested_followups
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Here is key guidance regarding "${userMsg}":\n\n• Maintain 6 months emergency funds in liquid assets.\n• Stagger equity investments via monthly SIPs (e.g. Nifty 50 & Flexi-Cap).\n• Rebalance your portfolio annually according to your risk tolerance.`,
          followups: [
            'How should I divide my monthly investment?',
            'Is Nifty 50 risky right now?',
            'What is a good SIP strategy for retirement?'
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-glow-emerald transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          <span className="text-xs sm:text-sm">Ask InvestAI</span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[550px] rounded-2xl border border-slate-800 bg-[#0F172A] shadow-2xl flex flex-col overflow-hidden glass-panel">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Ask InvestAI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-slate-400">Context-Aware AI Financial Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Followups */}
                  {msg.followups && msg.followups.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] text-slate-400 font-semibold">Suggested Questions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followups.map((f, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSend(f)}
                            className="text-[11px] text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full text-left transition-colors"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>InvestAI is analyzing financial data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Safety Notice */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800">
            <SafetyDisclaimer compact />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask e.g. How to allocate ₹15,000 monthly?"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
