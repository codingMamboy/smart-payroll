"use client"

import Link from "next/link";
import {
  DollarSign,
  Receipt,
  Wallet,
  Clock,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { icon: DollarSign, label: "Find the Gross Pay", href: "/menu/gross-pay" },
  { icon: Receipt, label: "Calculate the Tax Deduction Amount", href: "/menu/tax-deduction" },
  { icon: Wallet, label: "Find the Net Pay", href: "/menu/net-pay" },
  { icon: Clock, label: "Calculate Working Hours", href: "/menu/working-hours" },
  { icon: CalendarDays, label: "Calculate the Monthly Pay of an Employee", href: "/menu/monthly-pay" },
];

export default function MenuPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-brand-bg px-6 py-30">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold leading-tight text-brand-dark sm:text-4xl">
          Main Menu
        </h1>
        <p className="text-sm font-extralight font-display leading-relaxed text-brand-gray">
          Choose the operation you need to perform.
        </p>

        <div className="mt-8 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex border mx-[-40] border-[0.5px] border-transparent items-center gap-3.5 rounded-lg bg-white px-4 py-3.5
                transition-all 
                duration-300
                ease-in-out  
                hover:bg-brand-light-gray
                hover:translate-x-0.5
                hover:border-brand-gray"
              >
                <span className="flex items-center justify-center ">
                  <Icon className="h-[17px] w-[17px] text-brand-blue" strokeWidth={2} />
                </span>


                <span className="flex-1 font-display text-md text-brand-dark font-light
                ">
                    {item.label}
                </span>

                <ChevronRight className="h-[18px] w-[18px] shrink-0 text-brand-gray/50" strokeWidth={2} />
              </Link>
            );
          })}
        </div>

        <Link
          href="/"
          className="mt-5 block w-full py-3 text-center text-[15px] text-brand-gray/70 transition-colors duration-150 hover:text-brand-dark"
        >
          Exit
        </Link>
      </div>
    </main>
  );
}