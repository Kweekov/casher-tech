interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-3 text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Повторить
          </button>
        )}
      </div>
    </div>
  );
}
