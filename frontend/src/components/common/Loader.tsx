interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Загрузка..." }: LoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">{message}</div>
    </div>
  );
}
