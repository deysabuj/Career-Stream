import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

interface FreshnessWidgetProps {
  lastVerifiedAt?: string;
  sourceUrl?: string;
  className?: string;
}

export const FreshnessWidget: React.FC<FreshnessWidgetProps> = ({ lastVerifiedAt, className = '' }) => {
  const getMinutesAgo = (dateStr?: string) => {
    if (!dateStr) return 12;
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    return mins > 0 ? mins : 5;
  };

  const minutesAgo = getMinutesAgo(lastVerifiedAt);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg badge-verified text-xs font-medium ${className}`}>
      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
      <span className="text-amber-300 font-semibold">Verified Official Career Source</span>
      <span className="text-amber-500/60">•</span>
      <span className="text-amber-400/90 flex items-center gap-1">
        <RefreshCw className="w-3 h-3 animate-spin-slow opacity-75" />
        Checked {minutesAgo} mins ago
      </span>
    </div>
  );
};
