export function AdminPreviewPlaceholder({ title, description }: { title: string; description: string }) {
  return <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4"><h4 className="text-sm font-semibold text-gray-900">{title}</h4><p className="mt-1 text-sm text-gray-600">{description}</p></div>;
}
