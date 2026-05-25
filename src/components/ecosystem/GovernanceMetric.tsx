"use client";

import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GovernanceMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'bad' | 'neutral';
}

export function GovernanceMetric({ label, value, unit, trend, trendValue, status = 'neutral' }: GovernanceMetricProps) {
  return (
    <div className="bg-white border border-black/10 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-[10px] font-mono text-black/50 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div className="flex items-end gap-1 mb-3">
        <span className="text-3xl font-bold tracking-tight text-[#0A0A0A] leading-none">{value}</span>
        {unit && <span className="text-sm font-bold text-black/40 mb-0.5">{unit}</span>}
      </div>
      
      {(trend || trendValue) && (
        <div className={clsx(
          "flex items-center gap-1.5 text-xs font-mono px-2 py-1 inline-flex rounded-sm",
          status === 'good' && "bg-[#2E7D32]/10 text-[#2E7D32]",
          status === 'bad' && "bg-[#A11212]/10 text-[#A11212]",
          status === 'neutral' && "bg-black/5 text-black/60"
        )}>
          {trend === 'up' && <TrendingUp size={12} />}
          {trend === 'down' && <TrendingDown size={12} />}
          {trend === 'neutral' && <Minus size={12} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
