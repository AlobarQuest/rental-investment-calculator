import React from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { RateSegment } from '../types';

interface RateManagerProps {
  segments: RateSegment[];
  onChange: (segments: RateSegment[]) => void;
}

export const RateManager: React.FC<RateManagerProps> = ({ segments, onChange }) => {
  const addSegment = () => {
    // Propose next start year based on last segment
    const lastStart = segments.length > 0 ? segments[segments.length - 1].startYear : 1;
    const newSegment: RateSegment = {
      id: Math.random().toString(36).substr(2, 9),
      startYear: lastStart + 5, // Suggest 5 years later by default
      interestRate: 6.5,
    };
    onChange([...segments, newSegment].sort((a, b) => a.startYear - b.startYear));
  };

  const updateSegment = (id: string, field: keyof RateSegment, value: number) => {
    const updated = segments.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    // Ensure Start Year 1 for first segment is locked logically (handled in UI)
    onChange(updated.sort((a, b) => a.startYear - b.startYear));
  };

  const removeSegment = (id: string) => {
    if (segments.length <= 1) return; // Prevent removing the base rate
    onChange(segments.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-4 border-l-4 border-l-indigo-500">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3>Interest Rate Schedule (Variable)</h3>
        </div>
        <button 
            onClick={addSegment}
            className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
        >
            <Plus className="w-3 h-3" /> Add Period
        </button>
      </div>

      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div key={segment.id} className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
             <div className="flex-1">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Start Year</label>
                <input 
                    type="number"
                    min={1}
                    value={segment.startYear}
                    disabled={index === 0} // First segment always starts at year 1
                    onChange={(e) => updateSegment(segment.id, 'startYear', parseInt(e.target.value))}
                    className={`w-full text-sm rounded border-slate-300 py-1.5 px-2 focus:ring-2 focus:ring-indigo-500 ${index === 0 ? 'bg-slate-200 text-slate-500' : 'bg-white'}`}
                />
             </div>
             <div className="flex-1">
                <label className="text-xs font-medium text-slate-500 mb-1 block">Interest Rate (%)</label>
                <input 
                    type="number"
                    step="0.125"
                    value={segment.interestRate}
                    onChange={(e) => updateSegment(segment.id, 'interestRate', parseFloat(e.target.value))}
                    className="w-full text-sm rounded border-slate-300 py-1.5 px-2 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
             </div>
             {index > 0 && (
                 <button 
                    onClick={() => removeSegment(segment.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded transition-colors mb-[2px]"
                    title="Remove period"
                 >
                     <Trash2 className="w-4 h-4" />
                 </button>
             )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2 italic">
        * Rates apply from the Start Year until the next defined period or the end of the loan.
      </p>
    </div>
  );
};
