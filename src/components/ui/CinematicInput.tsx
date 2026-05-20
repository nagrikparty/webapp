import React from 'react';

interface CinematicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CinematicInput({ label, id, ...props }: CinematicInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="font-english text-xs font-medium text-black/60 tracking-wider uppercase pl-1">
        {label}
      </label>
      <input
        id={id}
        className="bg-white/60 backdrop-blur-sm border border-black/5 p-4 text-black placeholder-black/30 focus:outline-none focus:border-red focus:ring-1 focus:ring-red focus:bg-white transition-all duration-300 rounded-2xl shadow-sm"
        {...props}
      />
    </div>
  );
}

interface CinematicTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function CinematicTextarea({ label, id, ...props }: CinematicTextareaProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="font-english text-xs font-medium text-black/60 tracking-wider uppercase pl-1">
        {label}
      </label>
      <textarea
        id={id}
        className="bg-white/60 backdrop-blur-sm border border-black/5 p-4 text-black placeholder-black/30 focus:outline-none focus:border-red focus:ring-1 focus:ring-red focus:bg-white transition-all duration-300 rounded-2xl shadow-sm resize-none"
        {...props}
      />
    </div>
  );
}
