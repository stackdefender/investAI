import React from 'react';
import { Database } from 'lucide-react';

export const DemoDataBadge: React.FC<{ label?: string }> = ({ label = "Demo Data Mode" }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
      <Database className="w-3 h-3" />
      {label}
    </span>
  );
};
