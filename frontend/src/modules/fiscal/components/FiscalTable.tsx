import { Link } from 'react-router-dom';
import { formatCompetencia, formatCurrency } from '@/shared/lib/utils';
import { FISCAL_DOCUMENTO_TIPO_LABELS, FISCAL_TIPO_OPERACAO_LABELS } from '../types';
import type { DocumentoFiscal } from '../types';
import { FiscalStatusBadge } from './FiscalStatusBadge';
import { VirtualizedTable } from '@/shared/components';

export function FiscalTable({ items }: { items: DocumentoFiscal[] }) {
  return (
    <div className="h-[500px] w-full">
      <VirtualizedTable
        data={items}
        columns={[
          {
            key: 'codigo',
            header: 'Documento',
            width: '20%',
            render: (val, item) => (
              <div>
                <p className="font-semibold text-text-strong">{val}</p>
                <p className="text-xs text-text-muted truncate">
                  {FISCAL_DOCUMENTO_TIPO_LABELS[item.documentoTipo]} · Nº {item.numero}
                </p>
              </div>
            ),
          },
          {
            key: 'tipoOperacao',
            header: 'Operação',
            width: '12%',
            render: (val) => FISCAL_TIPO_OPERACAO_LABELS[val as keyof typeof FISCAL_TIPO_OPERACAO_LABELS],
          },
          {
            key: 'emitenteNome',
            header: 'Partes',
            width: '18%',
            render: (val, item) => (
              <div>
                <p className="truncate">{val}</p>
                <p className="text-xs text-text-muted truncate">{item.destinatarioNome}</p>
              </div>
            ),
          },
          {
            key: 'obraNome',
            header: 'Obra',
            width: '15%',
            render: (val) => val ?? 'Sem obra',
          },
          {
            key: 'competencia',
            header: 'Competência',
            width: '12%',
            render: (val) => formatCompetencia(val as string),
          },
          {
            key: 'valorDocumento',
            header: 'Valor',
            width: '12%',
            render: (val) => <span className="font-medium text-text-strong">{formatCurrency(val as number)}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            width: '10%',
            render: (val) => <FiscalStatusBadge status={val as any} />,
          },
          {
            key: 'actions',
            header: 'Ações',
            width: '8%',
            render: (_, item) => (
              <Link to={`/fiscal/documentos/${item.id}`} className="font-medium text-jogab-700 hover:text-jogab-700">
                Ver
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
