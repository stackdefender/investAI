import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, Bell, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { formatPercent } from '../utils/formatters';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { WatchlistItem } from '../types';

export const Watchlist: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [targetAlert, setTargetAlert] = useState(0);

  const fetchWatchlist = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/watchlist/${user.id}`);
      setItems(res.data);
    } catch (err) {
      console.error('Watchlist fetch error:', err);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user?.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !symbol) return;
    try {
      await api.post(`/watchlist/${user.id}`, {
        symbol: symbol.toUpperCase(),
        name: name || symbol.toUpperCase(),
        asset_type: 'stock',
        added_price: 1500.0,
        target_price_alert: Number(targetAlert) || null
      });
      setShowModal(false);
      setSymbol('');
      setName('');
      fetchWatchlist();
    } catch (err) {
      console.error('Add watchlist error:', err);
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      await api.delete(`/watchlist/${itemId}`);
      fetchWatchlist();
    } catch (err) {
      console.error('Delete watchlist error:', err);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            CUSTOM PRICE ALERTS & WATCHLIST
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Market Watchlist</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor asset movements and configure target price triggers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-bold shadow-glow-emerald flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add to Watchlist
        </button>
      </div>

      {/* Watchlist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-3 shadow-md glass-panel flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">{item.symbol}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{item.name}</h3>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-rose-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Target Alert Trigger:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" />
                  {item.target_price_alert ? `₹${item.target_price_alert}` : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#131A29] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add Watchlist Item</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Symbol (e.g. INFY, NVDA)</label>
                <input
                  type="text"
                  required
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Asset Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Infosys Ltd."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Price Alert (₹ / $)</label>
                <input
                  type="number"
                  value={targetAlert}
                  onChange={(e) => setTargetAlert(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-glow-emerald"
                >
                  Save Watchlist
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
