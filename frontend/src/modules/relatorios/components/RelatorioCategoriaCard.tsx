import { Link } from 'react-router-dom';
import { RELATORIO_CATEGORIA_LABELS, RELATORIO_FORMATO_LABELS } from '../types';
import type { RelatorioCategoriaCardProps } from './types';

export function RelatorioCategoriaCard({ item }: RelatorioCategoriaCardProps) {
  return (
    <article className="rounded-xl border border-border-default bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-text-strong">{RELATORIO_CATEGORIA_LABELS[item.categoria]}</h3>
          <p className="mt-1 text-sm text-text-muted">{item.descricao}</p>
        </div>
        <span className="rounded-full bg-jogab-50 px-2.5 py-1 text-xs font-medium text-jogab-700">
          {item.quantidade}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-text-muted md:grid-cols-2">
        <div>
          <p className="font-medium text-text-strong">Disponíveis</p>
          <p>{item.disponiveis} pronto(s) para execução imediata.</p>
        </div>
        <div>
          <p className="font-medium text-text-strong">Formatos</p>
          <p>{(item.formatos ?? []).map((formato) => RELATORIO_FORMATO_LABELS[formato]).join(', ') || '—'}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-text-subtle">Módulos relacionados</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.modulosRelacionados.map((modulo) => (
            <span key={modulo} className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-medium text-text-body">
              {modulo}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-text-muted">
        <span>{item.titulo}</span>
        <Link to={`/relatorios/${item.categoria}`} className="font-medium text-jogab-700 hover:text-jogab-700">
          Abrir categoria
        </Link>
      </div>
    </article>
  );
}
