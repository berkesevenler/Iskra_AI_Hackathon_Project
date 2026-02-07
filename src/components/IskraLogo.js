import { cn } from "@/lib/utils";

// ============================================
// Iskra AI Logo — "Spark" mark
// A minimalist 6-pointed spark / starburst
// ============================================

export default function IskraLogo({
  size = 32,
  color = "currentColor",
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      {/* Main vertical spike */}
      <path
        d="M24 0 L30 19 L24 48 L18 19 Z"
        fill={color}
      />
      {/* Upper-right diagonal spike */}
      <path
        d="M42 4 L29 19 L6 44 L19 29 Z"
        fill={color}
      />
      {/* Upper-left diagonal spike */}
      <path
        d="M6 4 L19 19 L42 44 L29 29 Z"
        fill={color}
      />
      {/* Horizontal accent */}
      <path
        d="M1 24 L19 18.5 L47 24 L29 29.5 Z"
        fill={color}
      />
    </svg>
  );
}

export function IskraLogoMark({ size = 24, color = "currentColor", className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
    >
      <path
        d="M12 0 L15 9.5 L12 24 L9 9.5 Z"
        fill={color}
      />
      <path
        d="M21 2 L14.5 9.5 L3 22 L9.5 14.5 Z"
        fill={color}
      />
      <path
        d="M3 2 L9.5 9.5 L21 22 L14.5 14.5 Z"
        fill={color}
      />
      <path
        d="M0.5 12 L9.5 9.2 L23.5 12 L14.5 14.8 Z"
        fill={color}
      />
    </svg>
  );
}
