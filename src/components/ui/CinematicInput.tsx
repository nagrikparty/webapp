import React from 'react';

interface CinematicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CinematicInput({ label, id, ...props }: CinematicInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="font-english text-sm font-medium text-black/70 tracking-wide uppercase">
        {label}
      </label>
      <input
        id={id}
        className="bg-stone-50 border border-black/15 p-4 text-black placeholder-black/40 focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all duration-300 rounded-none"
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
      <label htmlFor={id} className="font-english text-sm font-medium text-black/70 tracking-wide uppercase">
        {label}
      </label>
      <textarea
        id={id}
        className="bg-stone-50 border border-black/15 p-4 text-black placeholder-black/40 focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all duration-300 rounded-none resize-none"
        {...props}
      />
    </div>
  );
}
