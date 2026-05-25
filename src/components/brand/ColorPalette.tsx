import React from 'react';

const COLORS = [
  { name: 'Warm Cream', hex: '#F5F1E8', class: 'bg-[#F5F1E8]', textClass: 'text-[#0A0A0A]', desc: 'Canvas / Background' },
  { name: 'Matte Black', hex: '#0A0A0A', class: 'bg-[#0A0A0A]', textClass: 'text-[#F5F1E8]', desc: 'Ink / Text' },
  { name: 'Crimson Red', hex: '#A11212', class: 'bg-[#A11212]', textClass: 'text-white', desc: 'Emergency Accent' },
  { name: 'Indigo Slate', hex: '#0B2553', class: 'bg-[#0B2553]', textClass: 'text-white', desc: 'Shadow Accents' },
];

export function ColorPalette() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {COLORS.map((color) => (
        <div key={color.hex} className="group flex flex-col border border-black/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          <div className={`${color.class} h-32 w-full`} />
          <div className="p-4 bg-white/60 backdrop-blur-md">
            <h3 className="font-bold text-sm text-[#0A0A0A]">{color.name}</h3>
            <p className="text-xs text-black/50 font-mono mt-1">{color.hex}</p>
            <p className="text-xs text-black/70 mt-2">{color.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
