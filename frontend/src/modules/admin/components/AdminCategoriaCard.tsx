import { Link } from 'react-router-dom';
import { ADMIN_CATEGORIA_LABELS } from '../types';
import type { AdminCategoriaCardData } from '../types';

export function AdminCategoriaCard({ item }: { item: AdminCategoriaCardData }) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-text-strong">{ADMIN_CATEGORIA_LABELS[item.categoria]}</h3>
          <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
        </div>

        <span className="rounded-full bg-jogab-50 px-2.5 py-1 text-xs font-medium text-jogab-700">
          {item.quantidade}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
        <span>{item.ativos} ativos</span>
        <Link to={`/admin/${item.categoria}`} className="font-medium text-jogab-700 hover:text-jogab-700">
          Abrir
        </Link>
      </div>
    </article>
  );
}
