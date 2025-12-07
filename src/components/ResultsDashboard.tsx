import { useState } from 'react';
import { SummaryMetrics, YearlyResult, InputState } from '../types';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Line } from 'recharts';
import { DollarSign, Percent, TrendingUp, Wallet, BrainCircuit } from 'lucide-react';
import { generateInvestmentAdvice } from '../services/geminiService';

interface ResultsDashboardProps {
  summary: SummaryMetrics;
  yearly: YearlyResult[];
  inputs: InputState;
}

const MetricCard = ({ title, value, sub, icon: Icon, colorClass }: { title: string, value: string, sub?: string, icon: any, colorClass: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
      <h3 className={`text-2xl font-bold ${colorClass}`}>{value}</h3>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
    <div className={`p-2 rounded-lg ${colorClass.replace('text-', 'bg-').replace('600', '50')} ${colorClass}`}>
        <Icon className="w-6 h-6" />
    </div>
  </div>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ summary, yearly, inputs }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiAnalyze = async () => {
    setLoadingAi(true);
    const analysis = await generateInvestmentAdvice(inputs, summary, yearly);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            title="Cash Flow (Yr 1)" 
            value={`$${yearly[0].cashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            sub={`$${(yearly[0].cashFlow / 12).toFixed(0)} / mo`}
            icon={Wallet}
            colorClass={yearly[0].cashFlow >= 0 ? "text-emerald-600" : "text-rose-600"}
        />
        <MetricCard 
            title="Cash on Cash" 
            value={`${summary.cashOnCash.toFixed(2)}%`}
            sub="Year 1 Return"
            icon={Percent}
            colorClass="text-indigo-600"
        />
        <MetricCard 
            title="Cap Rate" 
            value={`${summary.capRate.toFixed(2)}%`}
            sub="Unleveraged Return"
            icon={TrendingUp}
            colorClass="text-blue-600"
        />
        <MetricCard 
            title="IRR" 
            value={`${summary.irr.toFixed(2)}%`}
            sub={`${inputs.holdingPeriod} Yr Annualized`}
            icon={DollarSign}
            colorClass="text-purple-600"
        />
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                    <BrainCircuit className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900">Gemini Investment Advisor</h3>
                    <p className="text-sm text-indigo-600">Get an AI opinion on this deal structure</p>
                </div>
            </div>
            {!aiAnalysis && (
                <button 
                    onClick={handleAiAnalyze}
                    disabled={loadingAi}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {loadingAi ? 'Analyzing...' : 'Analyze Deal'}
                </button>
            )}
        </div>
        
        {aiAnalysis && (
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-slate-800 text-sm leading-relaxed border border-indigo-100 markdown-content animate-in fade-in duration-500">
                {aiAnalysis.split('\n').map((line, i) => (
                    <p key={i} className={`mb-2 ${line.startsWith('#') || line.startsWith('**') ? 'font-bold text-indigo-900' : ''}`}>
                        {line.replace(/\*\*/g, '')}
                    </p>
                ))}
                <button 
                    onClick={handleAiAnalyze} 
                    className="text-xs text-indigo-500 hover:text-indigo-700 underline mt-2"
                >
                    Regenerate
                </button>
            </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
            <h3 className="font-semibold text-slate-700 mb-4 flex-shrink-0">Revenue vs Expenses</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={yearly}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{fontSize: 12}} />
                        <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{fontSize: 12}} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="rentalIncome" name="Income" fill="#10b981" stackId="a" />
                        <Bar dataKey="operatingExpenses" name="Expenses" fill="#f43f5e" stackId="b" />
                        <Bar dataKey="mortgagePayment" name="Mortgage" fill="#f59e0b" stackId="b" />
                        <Line type="monotone" dataKey="cashFlow" name="Cash Flow" stroke="#6366f1" strokeWidth={3} dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
            <h3 className="font-semibold text-slate-700 mb-4 flex-shrink-0">Equity Accumulation</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yearly}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{fontSize: 12}} />
                        <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{fontSize: 12}} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Area type="monotone" dataKey="propertyValue" name="Property Value" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="remainingLoanBalance" name="Loan Balance" stackId="2" stroke="#64748b" fill="#64748b" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="equity" name="Net Equity" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Annual Breakdown</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-3 py-3 text-left font-medium">Year</th>
                        <th className="px-3 py-3 font-medium">Rate %</th>
                        <th className="px-3 py-3 font-medium">Income</th>
                        <th className="px-3 py-3 font-medium">Expenses</th>
                        <th className="px-3 py-3 font-medium">NOI</th>
                        <th className="px-3 py-3 font-medium">Mortgage</th>
                        <th className="px-3 py-3 font-medium text-indigo-600">Cash Flow</th>
                        <th className="px-3 py-3 font-medium">Equity</th>
                        <th className="px-3 py-3 font-medium">Loan Bal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {yearly.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-3 text-left font-medium text-slate-700">{row.year}</td>
                            <td className="px-3 py-3 text-slate-500">{row.rateApplied.toFixed(3)}%</td>
                            <td className="px-3 py-3 text-emerald-600 font-medium">{(row.rentalIncome + row.otherIncome).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-3 py-3 text-rose-500">{(row.operatingExpenses).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-3 py-3 text-slate-700">{row.noi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-3 py-3 text-amber-600">{(row.mortgagePayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className={`px-3 py-3 font-bold ${row.cashFlow >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                                {row.cashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="px-3 py-3 text-slate-600">{row.equity.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            <td className="px-3 py-3 text-slate-400">{row.remainingLoanBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};