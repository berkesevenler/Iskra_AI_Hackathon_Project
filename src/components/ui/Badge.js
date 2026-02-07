import { cn } from "@/lib/utils";

const variants = {
  default: "bg-cream-dark/50 text-dark-soft",
  primary: "bg-accent/10 text-accent",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  dark: "bg-dark-mid text-white/70",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium tracking-wider uppercase",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
