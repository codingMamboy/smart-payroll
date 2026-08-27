"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CalculatorShell from "@/components/CalculatorShell";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

const STATES = ["Michigan", "Colorado", "Indiana", "Illinois", "Utah"];

// TODO: replace with the exact rates from your Excel "Reference table" sheet
const STATE_TAX_RATES: Record<string, number> = {
  Michigan: 0.0425,
  Colorado: 0.044,
  Indiana: 0.0305,
  Illinois: 0.0495,
  Utah: 0.0465,
};

const FEDERAL_TAX_RATE = 0.10;
const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;

type TaxResult = {
  state_tax: number;
  federal_tax: number;
  social_security_tax: number;
  medicare_tax: number;
  total_tax_deduction: number;
};

export default function TaxDeductionPage() {
  const [grossPay, setGrossPay] = useState("");
  const [state, setState] = useState(STATES[0]);

  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const gross = Number(grossPay);

      if (Number.isNaN(gross)) {
        throw new Error("Please enter a valid gross pay amount.");
      }
      if (gross < 0) {
        throw new Error("Gross pay cannot be negative.");
      }

      const stateRate = STATE_TAX_RATES[state];
      if (stateRate === undefined) {
        throw new Error("Unknown state selected.");
      }

      const state_tax = gross * stateRate;
      const federal_tax = gross * FEDERAL_TAX_RATE;
      const social_security_tax = gross * SOCIAL_SECURITY_RATE;
      const medicare_tax = gross * MEDICARE_RATE;
      const total_tax_deduction = state_tax + federal_tax + social_security_tax + medicare_tax;

      setResult({ state_tax, federal_tax, social_security_tax, medicare_tax, total_tax_deduction });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CalculatorShell
      title="Calculate the Tax Deduction Amount"
      description="Applies state tax (varies by state), federal tax, Social Security, and Medicare."
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:max-w-md">
          <FormField label="Gross Pay ($)" type="number" step="0.01" value={grossPay} onChange={setGrossPay} />

          <label className="flex flex-col gap-1 text-left">
            <span className="text-sm font-semibold text-brand-dark">State</span>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full appearance-none rounded-md border border-brand-gray/30 px-3 py-2 pr-9 text-sm text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray"
                aria-hidden="true"
              />
            </div>
          </label>

          <SubmitButton loading={loading}>Calculate Tax Deduction</SubmitButton>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="w-full lg:sticky lg:top-6 lg:max-w-md mt-6">
          {result ? (
            <div className="rounded-md border border-brand-gray/20 bg-white p-6">
              <h2 className="font-display text-sm font-bold text-brand-dark">Result</h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <Row label="State Tax" value={result.state_tax} />
                <Row label="Federal Tax" value={result.federal_tax} />
                <Row label="Social Security Tax" value={result.social_security_tax} />
                <Row label="Medicare Tax" value={result.medicare_tax} />
                <div className="mt-2 border-t border-brand-gray/20 pt-3">
                  <Row label="Total Tax Deduction" value={result.total_tax_deduction} bold />
                </div>
              </dl>
            </div>
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-md border border-dashed border-brand-gray/30 p-6 text-center text-sm text-brand-gray">
              Your result will appear here.
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}

function Row({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex items-center">
      <dt className={`w-40 shrink-0 whitespace-nowrap ${bold ? "font-bold text-brand-dark" : "text-brand-gray"}`}>
        {label}
      </dt>
      <dd className={bold ? "font-bold text-brand-blue" : "text-brand-dark"}>
        ${value.toFixed(2)}
      </dd>
    </div>
  );
}