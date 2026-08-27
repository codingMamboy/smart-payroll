"use client";

import { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

type WorkingHoursResult = {
  time_worked_hours: number;
  late_entry_hours: number;
  overtime_hours: number;
};

function timeToHours(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function hoursToHM(decimalHours: number): string {
  const totalMinutes = Math.round(decimalHours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  const hourText = h > 0 ? `${h} hour${h !== 1 ? "s" : ""}` : "";
  const minuteText = m > 0 ? `${m} minute${m !== 1 ? "s" : ""}` : "";

  if (hourText && minuteText) return `${hourText} and ${minuteText}`;
  if (hourText) return hourText;
  if (minuteText) return minuteText;
  return "0 minutes";
}

export default function WorkingHoursPage() {
  const [enterTime, setEnterTime] = useState("");
  const [exitTime, setExitTime] = useState("");

  const [result, setResult] = useState<WorkingHoursResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      if (!enterTime || !exitTime) {
        throw new Error("Please enter both enter time and exit time.");
      }

      const enterHours = timeToHours(enterTime);
      const exitHours = timeToHours(exitTime);
      const timeWorked = exitHours - enterHours;

      if (timeWorked < 0) {
        throw new Error("Exit time must be after enter time.");
      }

      const late_entry_hours = Math.max(0, enterHours - 8);
      const overtime_hours = Math.max(0, timeWorked - 8);

      setResult({
        time_worked_hours: Number(timeWorked.toFixed(2)),
        late_entry_hours: Number(late_entry_hours.toFixed(2)),
        overtime_hours: Number(overtime_hours.toFixed(2)),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CalculatorShell
      title="Calculate Working Hours"
      description="Entry after 8:00 AM counts as late. More than 8 hours worked counts as overtime."
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:max-w-md">
          <FormField label="Enter Time" type="time" value={enterTime} onChange={setEnterTime} />
          <FormField label="Exit Time" type="time" value={exitTime} onChange={setExitTime} />

          <SubmitButton loading={loading}>Calculate</SubmitButton>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="w-full lg:sticky lg:top-6 lg:max-w-md mt-6">
          {result ? (
            <div className="rounded-md border border-brand-gray/20 bg-white p-6 ">
              <h2 className="font-display text-sm font-bold text-brand-dark">Result</h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <Row label="Time Worked" value={result.time_worked_hours} />
                <Row label="Late Entry" value={result.late_entry_hours} />
                <Row label="Overtime" value={result.overtime_hours} />
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

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center">
      <dt className="w-40 shrink-0 whitespace-nowrap text-brand-gray">{label}</dt>
      <dd className="text-brand-dark">{hoursToHM(value)}</dd>
    </div>
  );
}