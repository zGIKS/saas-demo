import { ThemeToggle } from "./theme-toggle";

interface BackgroundProps {
  children: React.ReactNode;
}

export function Background({ children }: BackgroundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(circle_at_1px_1px,var(--grid-color)_1px,transparent_0)] bg-size-[24px_24px] relative">
      <ThemeToggle />
      {children}
    </div>
  );
}