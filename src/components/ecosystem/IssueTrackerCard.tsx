"use client";

import React from 'react';
import { MapPin, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface IssueTrackerCardProps {
  id: string;
  title: string;
  location: string;
  daysOpen: number;
  status: 'resolved' | 'unresolved' | 'escalated';
  category: string;
}

export function IssueTrackerCard({ id, title, location, daysOpen, status, category }: IssueTrackerCardProps) {
  return (
    <div className="bg-white border border-black/10 p-5 relative overflow-hidden group">
      {/* Status indicator line */}
      <div className={clsx(
        "absolute left-0 top-0 bottom-0 w-1",
        status === 'resolved' ? 'bg-[#2E7D32]' : status === 'escalated' ? 'bg-[#A11212]' : 'bg-[#0B2553]'
      )} />
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-black/50">
          <span className="bg-black/5 px-2 py-0.5 rounded-sm">{category}</span>
          <span>TKT-{id}</span>
        </div>
        <div className={clsx(
          "flex items-center gap-1 text-[10px] font-mono uppercase font-bold",
          status === 'resolved' ? 'text-[#2E7D32]' : status === 'escalated' ? 'text-[#A11212]' : 'text-[#0B2553]'
        )}>
          {status === 'resolved' && <CheckCircle2 size={12} />}
          {status === 'escalated' && <AlertCircle size={12} />}
          {status === 'unresolved' && <Clock size={12} />}
          {status}
        </div>
      </div>

      <h3 className="font-bold text-lg leading-tight mb-2 text-[#0A0A0A] group-hover:text-[#A11212] transition-colors cursor-pointer">
        {title}
      </h3>

      <div className="flex items-center gap-4 text-xs font-medium text-black/60">
        <div className="flex items-center gap-1">
          <MapPin size={14} className="text-black/40" />
          {location}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-black/40" />
          {status === 'resolved' ? `Resolved in ${daysOpen}d` : `Open for ${daysOpen}d`}
        </div>
      </div>
    </div>
  );
}
