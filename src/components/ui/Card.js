import { cn } from "@/lib/utils";

export default function Card({
  children,
  className = "",
  hover = false,
  dark = false,
  ...props
}) {
  return (
    <div
      className={cn(
        "p-6 border transition-all duration-300",
        dark
          ? "bg-dark-mid border-white/10 text-white"
          : "bg-white border-cream-dark/50 text-dark",
        hover &&
          (dark
            ? "hover:border-white/25 hover:bg-dark-soft cursor-pointer"
            : "hover:border-dark/20 hover:shadow-sm cursor-pointer"),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={cn("text-sm opacity-60 mt-1", className)}>{children}</p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={cn("", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-current/10 flex items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}
