import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  const [purchasePrice, setPurchasePrice] = useState<string>('250000');
  const [downPayment, setDownPayment] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('7.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [monthlyRent, setMonthlyRent] = useState<string>('2000');
  const [expenses, setExpenses] = useState<string>('500');
  
  const [results, setResults] = useState<any>(null);

  const calculateInvestment = () => {
    try {
      const price = parseFloat(purchasePrice);
      const down = parseFloat(downPayment);
      const rate = parseFloat(interestRate);
      const term = parseFloat(loanTerm);
      const rent = parseFloat(monthlyRent);
      const exp = parseFloat(expenses);

      // Calculate loan amount
      const downPaymentAmount = price * (down / 100);
      const loanAmount = price - downPaymentAmount;

      // Calculate monthly mortgage payment
      const monthlyRate = rate / 100 / 12;
      const numPayments = term * 12;
      const monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);

      // Calculate cash flow
      const totalMonthlyExpenses = monthlyPayment + exp;
      const monthlyCashFlow = rent - totalMonthlyExpenses;
      const annualCashFlow = monthlyCashFlow * 12;

      // Calculate ROI
      const totalInvestment = downPaymentAmount;
      const cashOnCashReturn = (annualCashFlow / totalInvestment) * 100;

      setResults({
        loanAmount: loanAmount.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2),
        monthlyCashFlow: monthlyCashFlow.toFixed(2),
        annualCashFlow: annualCashFlow.toFixed(2),
        cashOnCashReturn: cashOnCashReturn.toFixed(2),
        totalInvestment: totalInvestment.toFixed(2)
      });
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Please enter valid numbers');
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="container">
          <h1>🏠 Rental Investment Calculator</h1>
          <p className="subtitle">Calculate your potential rental property returns</p>

          <div className="calculator-card">
            <div className="input-grid">
              <div className="input-group">
                <label>Purchase Price ($)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="250000"
                />
              </div>

              <div className="input-group">
                <label>Down Payment (%)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="20"
                  min="0"
                  max="100"
                />
              </div>

              <div className="input-group">
                <label>Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="7.5"
                  step="0.1"
                />
              </div>

              <div className="input-group">
                <label>Loan Term (years)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="30"
                />
              </div>

              <div className="input-group">
                <label>Monthly Rent ($)</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder="2000"
                />
              </div>

              <div className="input-group">
                <label>Monthly Expenses ($)</label>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  placeholder="500"
                />
                <small>Property tax, insurance, maintenance, etc.</small>
              </div>
            </div>

            <button className="calculate-btn" onClick={calculateInvestment}>
              Calculate Returns
            </button>
          </div>

          {results && (
            <div className="results-card">
              <h2>Investment Analysis</h2>
              
              <div className="results-grid">
                <div className="result-item">
                  <div className="result-label">Total Investment</div>
                  <div className="result-value">${results.totalInvestment}</div>
                </div>

                <div className="result-item">
                  <div className="result-label">Loan Amount</div>
                  <div className="result-value">${results.loanAmount}</div>
                </div>

                <div className="result-item">
                  <div className="result-label">Monthly Mortgage</div>
                  <div className="result-value">${results.monthlyPayment}</div>
                </div>

                <div className="result-item highlight">
                  <div className="result-label">Monthly Cash Flow</div>
                  <div className={`result-value ${parseFloat(results.monthlyCashFlow) >= 0 ? 'positive' : 'negative'}`}>
                    ${results.monthlyCashFlow}
                  </div>
                </div>

                <div className="result-item">
                  <div className="result-label">Annual Cash Flow</div>
                  <div className={`result-value ${parseFloat(results.annualCashFlow) >= 0 ? 'positive' : 'negative'}`}>
                    ${results.annualCashFlow}
                  </div>
                </div>

                <div className="result-item highlight">
                  <div className="result-label">Cash-on-Cash Return</div>
                  <div className={`result-value ${parseFloat(results.cashOnCashReturn) >= 0 ? 'positive' : 'negative'}`}>
                    {results.cashOnCashReturn}%
                  </div>
                </div>
              </div>

              <div className="roi-interpretation">
                {parseFloat(results.cashOnCashReturn) > 8 && (
                  <p className="good">✅ Strong investment! ROI above 8%</p>
                )}
                {parseFloat(results.cashOnCashReturn) >= 5 && parseFloat(results.cashOnCashReturn) <= 8 && (
                  <p className="ok">⚠️ Moderate investment. ROI between 5-8%</p>
                )}
                {parseFloat(results.cashOnCashReturn) < 5 && (
                  <p className="poor">❌ Weak investment. ROI below 5%</p>
                )}
              </div>
            </div>
          )}

          <footer className="footer">
            <p>Built with Vite + React • Deployed on Cloudflare Pages</p>
            <p className="disclaimer">
              <small>
                Disclaimer: This calculator provides estimates only. 
                Consult with financial advisors before making investment decisions.
              </small>
            </p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
