export function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = value == null ? '' : String(value);
  const escaped = normalized.replaceAll('"', '""');
  return `"${escaped}"`;
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
