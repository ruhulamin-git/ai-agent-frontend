import { Button } from "@/shared/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "We encountered an error while fetching the data. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] text-center p-8 ${className}`}
    >
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/10 mb-6 border border-red-100 dark:border-red-900/20">
        <span className="material-symbols-outlined text-4xl text-red-500">error</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          size="lg"
          className="rounded-full px-8 gap-2 hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">refresh</span>
          Retry Request
        </Button>
      )}
    </div>
  );
};
