import { useState, useMemo, useEffect } from 'react';
import { Building2, Calculator, Home, PiggyBank, Receipt, Settings2, Share2 } from 'lucide-react';
import { InputState, RateSegment } from './types';
import { InputGroup, InputField } from './components/InputSection';
import { RateManager } from './components/RateManager';
import { ResultsDashboard } from './components/ResultsDashboard';
import { calculateAnalysis } from './utils/financials';

const INITIAL_INPUTS: InputState = {
  purchasePrice: 420000,
  downPaymentPercent: 20,
  closingCosts: 9000,
  loanTermYears: 30,
  monthlyRent: 2200,
  annualRentIncrease: 3,
  otherMonthlyIncome: 0,
  annualOtherIncomeIncrease: 3,
  vacancyRate: 5,
  propertyTax: 4000,
  annualTaxIncrease: 3,
  insurance: 1800,
  annualInsuranceIncrease: 3,
  hoaMonthly: 0,
  annualHoaIncrease: 3,
  maintenanceMonthly: 200,
  annualMaintenanceIncrease: 3,
  managementFeePercent: 0,
  appreciationRate: 4,
  holdingPeriod: 30,
  costToSell: 6
};

const INITIAL_RATES: RateSegment[] = [
  { id: 'initial', startYear: 1, interestRate: 6.875 },
];

function App() {
  const [inputs, setInputs] = useState<InputState>(INITIAL_INPUTS);
  const [rateSegments, setRateSegments] = useState<RateSegment[]>(INITIAL_RATES);
  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs');

  // Switch to results tab automatically on large screens, or keep manual on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateInput = (key: keyof InputState, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const { yearly, summary } = useMemo(() => {
    return calculateAnalysis(inputs, rateSegments);
  }, [inputs, rateSegments]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-10">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">RateShift</h1>
                <p className="text-xs text-indigo-200">Rental Property & ARM Analyzer</p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Inputs Column */}
          <div className={`lg:w-[360px] xl:w-[400px] flex-shrink-0 space-y-6 ${isMobile && activeTab !== 'inputs' ? 'hidden' : 'block'}`}>
            
            <RateManager segments={rateSegments} onChange={setRateSegments} />

            <InputGroup title="Purchase & Loan" icon={Building2}>
              <InputField label="Purchase Price" prefix="$" value={inputs.purchasePrice} onChange={(v) => updateInput('purchasePrice', v)} step="1000" />
              <InputField label="Closing Costs" prefix="$" value={inputs.closingCosts} onChange={(v) => updateInput('closingCosts', v)} step="100" />
              <InputField label="Down Payment" suffix="%" value={inputs.downPaymentPercent} onChange={(v) => updateInput('downPaymentPercent', v)} step="1" />
              <InputField label="Loan Term" suffix="Yrs" value={inputs.loanTermYears} onChange={(v) => updateInput('loanTermYears', v)} />
            </InputGroup>

            <InputGroup title="Income" icon={PiggyBank}>
              <InputField label="Monthly Rent" prefix="$" value={inputs.monthlyRent} onChange={(v) => updateInput('monthlyRent', v)} step="50" />
              <InputField label="Rent Increase" suffix="%" value={inputs.annualRentIncrease} onChange={(v) => updateInput('annualRentIncrease', v)} step="0.1" />
              <InputField label="Other Income" prefix="$" value={inputs.otherMonthlyIncome} onChange={(v) => updateInput('otherMonthlyIncome', v)} step="10" />
              <InputField label="Vacancy Rate" suffix="%" value={inputs.vacancyRate} onChange={(v) => updateInput('vacancyRate', v)} step="0.5" />
            </InputGroup>

            <InputGroup title="Expenses" icon={Receipt}>
              <InputField label="Property Tax (Yr)" prefix="$" value={inputs.propertyTax} onChange={(v) => updateInput('propertyTax', v)} step="100" />
              <InputField label="Insurance (Yr)" prefix="$" value={inputs.insurance} onChange={(v) => updateInput('insurance', v)} step="50" />
              <InputField label="HOA (Mo)" prefix="$" value={inputs.hoaMonthly} onChange={(v) => updateInput('hoaMonthly', v)} step="10" />
              <InputField label="Maintenance (Mo)" prefix="$" value={inputs.maintenanceMonthly} onChange={(v) => updateInput('maintenanceMonthly', v)} step="10" />
              <InputField label="Management Fee" suffix="%" value={inputs.managementFeePercent} onChange={(v) => updateInput('managementFeePercent', v)} step="0.5" />
            </InputGroup>

            <InputGroup title="Valuation" icon={Settings2}>
              <InputField label="Appreciation" suffix="%" value={inputs.appreciationRate} onChange={(v) => updateInput('appreciationRate', v)} step="0.1" />
              <InputField label="Holding Period" suffix="Yrs" value={inputs.holdingPeriod} onChange={(v) => updateInput('holdingPeriod', v)} />
              <InputField label="Cost to Sell" suffix="%" value={inputs.costToSell} onChange={(v) => updateInput('costToSell', v)} />
            </InputGroup>

             {/* Padding for mobile bottom nav */}
             <div className="h-16 lg:hidden"></div>
          </div>

          {/* Results Column */}
          <div className={`flex-1 min-w-0 ${isMobile && activeTab !== 'results' ? 'hidden' : 'block'}`}>
            <ResultsDashboard summary={summary} yearly={yearly} inputs={inputs} />
             {/* Padding for mobile bottom nav */}
             <div className="h-16 lg:hidden"></div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-40">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('inputs')}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 ${activeTab === 'inputs' ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-xs">Inputs</span>
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 ${activeTab === 'results' ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Results</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;