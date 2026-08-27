"use client";

import { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

type NetPayResult = {
  gross_pay: number;
  total_tax_deduction: number;
  net_pay: number;
};

export default function NetPayPage() {
  const [grossPay, setGrossPay] = useState("");
  const [totalTax, setTotalTax] = useState("");

  const [result, setResult] = useState<NetPayResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const gross = Number(grossPay);
      const tax = Number(totalTax);

      if (Number.isNaN(gross) || Number.isNaN(tax)) {
        throw new Error("Please enter valid numbers in all fields.");
      }
      if (gross < 0 || tax < 0) {
        throw new Error("Values cannot be negative.");
      }
      if (tax > gross) {
        throw new Error("Total tax deduction cannot exceed gross pay.");
      }

      const net_pay = gross - tax;

      setResult({ gross_pay: gross, total_tax_deduction: tax, net_pay });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CalculatorShell
      title="Find the Net Pay"
      description="Net Pay = Gross Pay minus the Total Tax Deduction."
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:max-w-md">
          <FormField label="Gross Pay ($)" type="number" step="0.01" value={grossPay} onChange={setGrossPay} />
          <FormField label="Total Tax Deduction ($)" type="number" step="0.01" value={totalTax} onChange={setTotalTax} />

          <SubmitButton loading={loading}>Calculate Net Pay</SubmitButton>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="w-full lg:sticky lg:top-6 lg:max-w-md mt-6">
          {result ? (
            <div className="rounded-md border border-brand-gray/20 bg-white p-6">
              <h2 className="font-display text-sm font-bold text-brand-dark">Result</h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <Row label="Gross Pay" value={result.gross_pay} />
                <Row label="Total Tax Deduction" value={result.total_tax_deduction} />
                <div className="mt-2 border-t border-brand-gray/20 pt-3">
                  <Row label="Net Pay" value={result.net_pay} bold />
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
    <div className="flex justify-between">
      <dt className={`w-40 shrink-0 whitespace-nowrap ${bold ? "font-bold text-brand-dark" : "text-brand-gray"}`}>
        {label}
      </dt>
      <dd className={bold ? "font-bold text-brand-blue" : "text-brand-dark"}>
        ${value.toFixed(2)}
      </dd>
    </div>
  );
}

