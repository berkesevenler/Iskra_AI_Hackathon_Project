import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "bg-dark-mid text-white hover:bg-dark-soft",
  outline:
    "border border-accent text-accent hover:bg-accent hover:text-white",
  "outline-white":
    "border border-white/40 text-white hover:border-white hover:bg-white/10",
  ghost:
    "text-dark-soft/70 hover:text-dark hover:bg-dark/5",
  "ghost-light":
    "text-white/60 hover:text-white hover:bg-white/10",
  danger:
    "bg-red-700 text-white hover:bg-red-800",
};

const sizes = {
  sm: "px-4 py-1.5 text-xs tracking-wider",
  md: "px-5 py-2.5 text-sm tracking-wider",
  lg: "px-8 py-3.5 text-sm tracking-wider",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300",
        "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:ring-offset-1",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
