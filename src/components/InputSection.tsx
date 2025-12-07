import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputGroupProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-4">
    <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold border-b border-slate-100 pb-2">
      <Icon className="w-5 h-5 text-indigo-600" />
      <h3>{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, prefix, suffix, step = "1" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
    <div className="relative rounded-md shadow-sm">
      {prefix && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-slate-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type="number"
        step={step}
        className={`block w-full rounded-md border-slate-200 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm bg-slate-50 border ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      {suffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-slate-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  </div>
);
