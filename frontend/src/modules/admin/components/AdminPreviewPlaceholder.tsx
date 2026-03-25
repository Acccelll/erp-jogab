export function AdminPreviewPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-surface-soft p-4">
      <h4 className="text-sm font-semibold text-text-strong">{title}</h4>
      <p className="mt-1 text-sm text-text-muted">{description}</p>
    </div>
  );
}
