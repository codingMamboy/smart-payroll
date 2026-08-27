"use client";

import { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

type GrossPayResult = {
  regular_pay: number;
  overtime_pay: number;
  pto_pay: number;
  nontaxable_income: number;
  gross_pay: number;
};

export default function GrossPayPage() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [regularHours, setRegularHours] = useState("");
  const [overtimeHours, setOvertimeHours] = useState("0");
  const [ptoHours, setPtoHours] = useState("0");
  const [nontaxableIncome, setNontaxableIncome] = useState("0");

  const [result, setResult] = useState<GrossPayResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const rate = Number(hourlyRate);
      const regHours = Number(regularHours);
      const otHours = Number(overtimeHours);
      const pto = Number(ptoHours);
      const nontaxable = Number(nontaxableIncome);

      if ([rate, regHours, otHours, pto, nontaxable].some((n) => Number.isNaN(n))) {
        throw new Error("Please enter valid numbers in all fields.");
      }
      if (rate < 0 || regHours < 0 || otHours < 0 || pto < 0 || nontaxable < 0) {
        throw new Error("Values cannot be negative.");
      }

      const regular_pay = rate * regHours;
      const overtime_pay = rate * 1.25 * otHours;
      const pto_pay = rate * pto;
      const gross_pay = regular_pay + overtime_pay + pto_pay + nontaxable;

      setResult({ regular_pay, overtime_pay, pto_pay, nontaxable_income: nontaxable, gross_pay });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CalculatorShell
      title="Find the Gross Pay"
      description="Overtime is paid at 1.25× the regular rate. PTO is paid at the regular rate."
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:max-w-md">
          <FormField label="Hourly Rate ($)" type="number" step="0.01" value={hourlyRate} onChange={setHourlyRate} />
          <FormField label="Regular Hours" type="number" step="0.01" value={regularHours} onChange={setRegularHours} />
          <FormField label="Overtime Hours" type="number" step="0.01" value={overtimeHours} onChange={setOvertimeHours} required={false} />
          <FormField label="Paid Time Off (Hours)" type="number" step="0.01" value={ptoHours} onChange={setPtoHours} required={false} />
          <FormField label="Nontaxable Income ($)" type="number" step="0.01" value={nontaxableIncome} onChange={setNontaxableIncome} required={false} />

          <SubmitButton loading={loading}>Calculate Gross Pay</SubmitButton>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="w-full lg:sticky lg:top-6 lg:max-w-sm">
          {result ? (
            <div className="rounded-md border mt-5 border-brand-gray/20 bg-white p-6">
              <h2 className="font-display text-sm font-bold text-brand-dark">Result</h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <Row label="Regular Pay" value={result.regular_pay} />
                <Row label="Overtime Pay" value={result.overtime_pay} />
                <Row label="PTO Pay" value={result.pto_pay} />
                <Row label="Nontaxable Income" value={result.nontaxable_income} />
                <div className="mt-2 border-t border-brand-gray/20 pt-3">
                  <Row label="Gross Pay" value={result.gross_pay} bold />
                </div>
              </dl>
            </div>
          ) : (
            <div className="flex h-full min-h-[240px] mt-5 items-center justify-center rounded-md border border-dashed border-brand-gray/30 p-6 text-center text-sm text-brand-gray">
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
    <div className="flex justify-between">
      <dt className={bold ? "font-bold text-brand-dark" : "text-brand-gray"}>{label}</dt>
      <dd className={bold ? "font-bold text-brand-blue" : "text-brand-dark"}>
        ${value.toFixed(2)}
      </dd>
    </div>
  );
}