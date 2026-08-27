"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="flex w-full max-w-md flex-col items-center px-6 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold leading-tight text-brand-dark sm:text-5xl">
          Smart Payroll
        </h1>
        <h1 className="font-display text-3xl font-semibold leading-tight text-brand-blue sm:text-5xl">
          Made Simple.
        </h1>

        <p className="mt-4 font-extralight text-center font-display text-xs leading-relaxed text-brand-gray sm:text-sm">
          Calculate gross pay, tax deductions, net pay, working hours, and
          monthly pay — one clear step at a time.
        </p>

        <button
          onClick={()=>{router.push('/menu')}}
          type="button"
          className="mt-10 w-full rounded-md border-[0.5] border-transparent bg-brand-blue px-8 py-3 font-display text-sm font-regular text-white shadow-sm 
          transition-colors 
          duration-300 
          ease-in-out 
          active:bg-gray-300
          hover:border-brand-dark 
          hover:bg-white 
          hover:text-brand-dark 
          focus:outline-none 
          focus-visible:ring-2 
          focus-visible:ring-brand-blue 
          focus-visible:ring-offset-2 sm:w-auto"
        >
          Get Started
        </button>

        <p className="mt-8 font-display text-[11px] uppercase tracking-widest text-brand-gray/60">
          by Bryan A. Dela Paz &amp; Ma. Charishma S. Cuaderno
        </p>
      </div>
    </main>
  );
}