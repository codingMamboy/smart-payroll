"use client";

import { useState } from "react";
import CalculatorShell from "@/components/CalculatorShell";
import FormField from "@/components/FormField";
import SubmitButton from "@/components/SubmitButton";

type DayEntry = {
  date: string;
  enter_time: string;
  exit_time: string;
};

type DailyBreakdown = {
  date: string;
  time_worked_hours: number;
  overtime_hours: number;
  late_entry_hours: number;
  penalty_applied: boolean;
  daily_gross_pay: number;
  daily_actual_pay: number;
};

type MonthlyPayResult = {
  days: DailyBreakdown[];
  total_monthly_pay: number;
};

function emptyDay(): DayEntry {
  return { date: "", enter_time: "", exit_time: "" };
}

function timeToHours(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function hoursToHM(decimalHours: number): string {
  const totalMinutes = Math.round(decimalHours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  const hourText = h > 0 ? `${h} hr${h !== 1 ? "s" : ""}` : "";
  const minuteText = m > 0 ? `${m} min${m !== 1 ? "s" : ""}` : "";

  if (hourText && minuteText) return `${hourText} and ${minuteText}`;
  if (hourText) return hourText;
  if (minuteText) return minuteText;
  return "0 minutes";
}

export default function MonthlyPayPage() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [latePenaltyRate, setLatePenaltyRate] = useState("0.10");
  const [days, setDays] = useState<DayEntry[]>([emptyDay()]);

  const [result, setResult] = useState<MonthlyPayResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateDay(index: number, field: keyof DayEntry, value: string) {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  }

  function addDay() {
    setDays((prev) => [...prev, emptyDay()]);
  }

  function removeDay(index: number) {
    setDays((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const rate = Number(hourlyRate);
      const penaltyRate = Number(latePenaltyRate);

      if (Number.isNaN(rate) || rate < 0) {
        throw new Error("Please enter a valid hourly rate.");
      }
      if (Number.isNaN(penaltyRate) || penaltyRate < 0 || penaltyRate > 1) {
        throw new Error("Late penalty rate must be a number between 0 and 1.");
      }
      if (days.some((d) => !d.date || !d.enter_time || !d.exit_time)) {
        throw new Error("Please fill in date, enter time, and exit time for every day.");
      }

      const dailyBreakdowns: DailyBreakdown[] = days.map((d) => {
        const enterHours = timeToHours(d.enter_time);
        const exitHours = timeToHours(d.exit_time);
        const timeWorked = exitHours - enterHours;

        if (timeWorked < 0) {
          throw new Error(`Exit time must be after enter time (Day: ${d.date || "unnamed"}).`);
        }

        const regularHours = Math.min(timeWorked, 8);
        const overtimeHours = Math.max(0, timeWorked - 8);
        const lateEntryHours = Math.max(0, enterHours - 8);
        const penaltyApplied = enterHours > 10;

        let dailyGrossPay = regularHours * rate + overtimeHours * rate * 1.25;
        if (penaltyApplied) {
          dailyGrossPay = dailyGrossPay * (1 - penaltyRate);
        }

        const dailyActualPay = dailyGrossPay * 0.88; // flat 12% tax

        return {
          date: d.date,
          time_worked_hours: Number(timeWorked.toFixed(2)),
          overtime_hours: Number(overtimeHours.toFixed(2)),
          late_entry_hours: Number(lateEntryHours.toFixed(2)),
          penalty_applied: penaltyApplied,
          daily_gross_pay: Number(dailyGrossPay.toFixed(2)),
          daily_actual_pay: Number(dailyActualPay.toFixed(2)),
        };
      });

      const total_monthly_pay = dailyBreakdowns.reduce((sum, d) => sum + d.daily_actual_pay, 0);

      setResult({ days: dailyBreakdowns, total_monthly_pay });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CalculatorShell
      title="Calculate the Monthly Pay of an Employee"
      description="Entry after 10:00 AM applies a late penalty. A flat 12% tax applies to each day's gross pay."
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 lg:max-w-md">
          <FormField label="Hourly Rate ($)" type="number" step="0.01" value={hourlyRate} onChange={setHourlyRate} />
          <FormField
            label="Late Penalty Rate (0–1)"
            type="number"
            step="0.01"
            value={latePenaltyRate}
            onChange={setLatePenaltyRate}
            required={false}
          />

          <div className="flex flex-col gap-4">
            {days.map((day, i) => (
              <div key={i} className="rounded-md border border-brand-gray/20 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-dark">Day {i + 1}</span>
                  {days.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(i)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <FormField label="Date" type="date" value={day.date} onChange={(v) => updateDay(i, "date", v)} />
                  <FormField label="Enter Time" type="time" value={day.enter_time} onChange={(v) => updateDay(i, "enter_time", v)} />
                  <FormField label="Exit Time" type="time" value={day.exit_time} onChange={(v) => updateDay(i, "exit_time", v)} />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addDay}
            className="rounded-md border border-dashed border-brand-blue/40 px-4 py-2 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue/5"
          >
            + Add another day
          </button>

          <SubmitButton loading={loading}>Calculate Monthly Pay</SubmitButton>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="w-full lg:sticky lg:top-6 lg:max-w-md mt-6">
          {result ? (
            <div className="rounded-md border border-brand-gray/20 bg-white p-6">
              <h2 className="font-display text-sm font-bold text-brand-dark">Daily Breakdown</h2>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                {result.days.map((d, i) => (
                  <div
                    key={`${d.date}-${i}`}
                    className={i < result.days.length - 1 ? "border-b border-brand-gray/10 pb-3" : ""}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="whitespace-nowrap font-semibold text-brand-dark">{d.date || `Day ${i + 1}`}</span>
                      <span className="font-semibold text-brand-blue">${d.daily_actual_pay.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex flex-col gap-0.5 text-xs text-brand-gray">
                      <span>Worked: {hoursToHM(d.time_worked_hours)}</span>
                      <span>Overtime: {hoursToHM(d.overtime_hours)}</span>
                      <span>Late: {hoursToHM(d.late_entry_hours)}</span>
                      {d.penalty_applied && <span className="text-red-600">Penalty applied</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-8 border-t border-brand-gray/20 pt-3">
                <span className="w-40 shrink-0 whitespace-nowrap font-display text-sm font-bold text-brand-dark">
                  Total Monthly Pay
                </span>
                <span className="font-display text-sm font-bold text-brand-blue">
                  ${result.total_monthly_pay.toFixed(2)}
                </span>
              </div>
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