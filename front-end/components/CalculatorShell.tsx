import Link from "next/link";
import {ChevronLeft} from "lucide-react";
export default function CalculatorShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-brand-bg px-6 py-16">
      <div className="w-full max-w-md">

         <Link
          href="/menu"
          className="flex items-center gap-1 mb-4 text-sm font-semibold text-brand-gray transition-colors duration-300 hover:text-brand-blue"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back to Menu
        </Link>

        <h1 className="font-display text-3xl font-semibold leading-tight text-brand-dark sm:text-4xl"        >
          {title}
        </h1>
        <p className="text-sm font-extralight font-display leading-relaxed text-brand-gray">
          {description}
        </p>

        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
