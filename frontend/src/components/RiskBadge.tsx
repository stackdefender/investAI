import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { getRiskBadgeColor } from '../utils/compliance';

export const RiskBadge: React.FC<{ label: string; score?: number }> = ({ label, score }) => {
  const colorClass = getRiskBadgeColor(label);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      <ShieldAlert className="w-3.5 h-3.5" />
      {label} {score !== undefined ? `(${score}/100)` : ''}
    </span>
  );
};
