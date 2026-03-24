import { Link } from 'react-router-dom';
import { RELATORIO_CATEGORIA_LABELS, RELATORIO_FORMATO_LABELS } from '../types';
import type { RelatorioCategoriaCardProps } from './types';

export function RelatorioCategoriaCard({ item }: RelatorioCategoriaCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {RELATORIO_CATEGORIA_LABELS[item.categoria]}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{item.descricao}</p>
        </div>
        <span className="rounded-full bg-jogab-50 px-2.5 py-1 text-xs font-medium text-jogab-700">
          {item.quantidade}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
        <div>
          <p className="font-medium text-gray-900">Disponíveis</p>
          <p>{item.disponiveis} pronto(s) para execução imediata.</p>
        </div>
        <div>
          <p className="font-medium text-gray-900">Formatos</p>
          <p>{item.formatos.map((formato) => RELATORIO_FORMATO_LABELS[formato]).join(', ') || '—'}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">Módulos relacionados</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {item.modulosRelacionados.map((modulo) => (
            <span key={modulo} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {modulo}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>{item.titulo}</span>
        <Link to={`/relatorios/${item.categoria}`} className="font-medium text-jogab-600 hover:text-jogab-700">
          Abrir categoria
        </Link>
      </div>
    </article>
  );
}
