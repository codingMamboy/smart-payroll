type FormFieldProps = {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  step?: string;
  required?: boolean;
  placeholder?: string;
};

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  step,
  required = true,
  placeholder,
}: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="flex-1 font-display text-sm text-brand-dark font-regular">{label}</span>
      <input
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-brand-gray/30 px-3 py-2 text-sm text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
      />
    </label>
  );
}
