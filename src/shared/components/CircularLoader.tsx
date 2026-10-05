import { Spinner } from "@/shared/ui/spinner";

interface CircularLoaderProps {
  height?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const CircularLoader = ({ height = "100vh", size = "lg", className }: CircularLoaderProps) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex w-full items-center justify-center bg-white/80 ${
        className || ""
      }`}
      style={{ height }}
    >
      <Spinner size={size} />
    </div>
  );
};

export { CircularLoader };
