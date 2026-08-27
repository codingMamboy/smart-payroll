export default function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-10 w-full rounded-md border-[0.5] border-transparent bg-brand-blue px-8 py-3 font-display text-sm font-regular text-white shadow-sm 
      transition-colors 
      duration-300 
      ease-in-out 
      hover:border-brand-dark 
      hover:bg-white 
      hover:text-brand-dark 
      focus:outline-none 
      focus-visible:ring-2 
      focus-visible:ring-brand-blue 
      focus-visible:ring-offset-2 
      disabled:pointer-events-none
      disabled:hover:border-transparent
      disabled:hover:bg-brand-blue
      disabled:hover:text-white
      disabled:opacity-80
      disabled:cursor-not-allowed
      sm:w-auto"
    >
      {loading ? "Calculating..." : children}
    </button>
  );
}