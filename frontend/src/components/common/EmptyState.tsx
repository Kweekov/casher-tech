interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Нет данных",
  description = "Попробуйте изменить параметры фильтрации.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
      <p className="mb-1 text-lg font-medium">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
