import { GoogleGenAI } from "@google/genai";
import { SummaryMetrics, YearlyResult, InputState } from "../types";

export const generateInvestmentAdvice = async (
  inputs: InputState,
  summary: SummaryMetrics,
  yearly: YearlyResult[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare data for the prompt
    const cashFlowYear1 = yearly[0].cashFlow;
    const cashFlowYear5 = yearly.length >= 5 ? yearly[4].cashFlow : "N/A";
    
    const prompt = `
    Analyze this rental property investment deal. Here is the data:
    
    **Inputs:**
    - Purchase Price: $${inputs.purchasePrice}
    - Down Payment: ${inputs.downPaymentPercent}%
    - Loan Term: ${inputs.loanTermYears} years
    - Monthly Rent: $${inputs.monthlyRent}
    - Holding Period: ${inputs.holdingPeriod} years

    **Key Metrics:**
    - Initial Investment: $${summary.initialInvestment.toFixed(2)}
    - Cash on Cash Return (Year 1): ${summary.cashOnCash.toFixed(2)}%
    - Cap Rate (Year 1): ${summary.capRate.toFixed(2)}%
    - IRR (Internal Rate of Return): ${summary.irr.toFixed(2)}%
    - Total Profit over ${inputs.holdingPeriod} years: $${summary.totalProfit.toFixed(2)}
    
    **Cash Flow Trend:**
    - Year 1 Cash Flow: $${cashFlowYear1.toFixed(2)}
    - Year 5 Cash Flow: $${typeof cashFlowYear5 === 'number' ? cashFlowYear5.toFixed(2) : cashFlowYear5}

    **Task:**
    Provide a professional real estate investment analysis (approx 150 words). 
    1. Verdict: Is this a "Solid Deal", "Risky", or "Poor"?
    2. Highlight 1-2 strengths (e.g., strong cash flow, good equity build-up).
    3. Highlight 1-2 risks (e.g., negative cash flow, low cap rate, dependency on appreciation).
    4. Comment specifically on the interest rate strategy if the cash flow fluctuates significantly significantly.
    
    Format nicely with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate AI analysis at this time. Please ensure your API key is configured correctly.";
  }
};
