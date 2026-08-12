import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { GLOBAL_SAFETY_DISCLAIMER } from '../utils/compliance';

export const SafetyDisclaimer: React.FC<{ customMessage?: string; compact?: boolean }> = ({
  customMessage,
  compact = false
}) => {
  return (
    <div className={`rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-amber-300 text-xs flex items-start gap-2.5 shadow-sm ${compact ? 'py-2 px-3 text-[11px]' : ''}`}>
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-400 block mb-0.5">Educational Disclaimer & Market Risk Notice</span>
        {customMessage || GLOBAL_SAFETY_DISCLAIMER}
      </div>
    </div>
  );
};
