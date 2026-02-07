import { cn } from "@/lib/utils";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-dark-soft/70 mb-2 tracking-wider uppercase">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 bg-white border border-cream-dark/60 text-dark",
          "focus:outline-none focus:border-accent/60",
          "placeholder:text-dark-soft/30 transition-all duration-300",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className = "",
  rows = 4,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-dark-soft/70 mb-2 tracking-wider uppercase">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full px-4 py-3 bg-white border border-cream-dark/60 text-dark",
          "focus:outline-none focus:border-accent/60",
          "placeholder:text-dark-soft/30 transition-all duration-300 resize-none",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
