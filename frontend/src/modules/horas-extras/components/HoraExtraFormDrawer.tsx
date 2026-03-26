import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateHoraExtra } from '../hooks/useHorasExtrasMutations';
import { useDrawerStore, useNotificationStore, useContextStore } from '@/shared/stores';
import { HORA_EXTRA_TIPO_LABELS, type HoraExtraTipo, type HoraExtraOrigem } from '../types';
import { mockFuncionarios } from '../../rh/data/funcionarios.mock';
import { mockCentrosCusto, mockAlocacoes } from '@/shared/lib/erpRelations';
import { mockHoraExtraRegras } from '../data/horas-extras.mock';
import { useEffect, useMemo } from 'react';

const horaExtraFormSchema = z.object({
  funcionarioId: z.string().min(1, 'Selecione um funcionário'),
  obraId: z.string().min(1, 'Selecione uma obra'),
  centroCustoId: z.string().min(1, 'Selecione um centro de custo'),
  filialId: z.string().min(1, 'Selecione uma filial'),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Formato inválido (AAAA-MM)'),
  dataLancamento: z.string().min(1, 'Informe a data'),
  quantidadeHoras: z.number().min(0.1, 'Mínimo de 0.1 horas'),
  tipo: z.enum(['he_50', 'he_100', 'he_noturna', 'adicional_noturno', 'domingo', 'feriado']),
  origem: z.enum(['obra', 'rh', 'integracao_ponto']),
  regraId: z.string().min(1, 'Selecione uma regra'),
  observacao: z.string().optional(),
});

type HoraExtraFormData = z.infer<typeof horaExtraFormSchema>;

export function HoraExtraFormDrawer() {
  const { closeDrawer } = useDrawerStore();
  const { addNotification } = useNotificationStore();
  const { mutate: createHoraExtra, isPending } = useCreateHoraExtra();
  const { obraId, filialId, competencia, options } = useContextStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HoraExtraFormData>({
    resolver: zodResolver(horaExtraFormSchema),
    defaultValues: {
      obraId: obraId ?? '',
      filialId: filialId ?? '',
      competencia: competencia ?? '',
      dataLancamento: new Date().toISOString().split('T')[0],
      quantidadeHoras: 1,
      tipo: 'he_50',
      origem: 'obra',
      regraId: 'regra-he50',
    },
  });

  const selectedFuncionarioId = watch('funcionarioId');

  // Auto-fill obra and centro de custo based on employee allocation
  useEffect(() => {
    if (selectedFuncionarioId) {
      const funcionario = mockFuncionarios.find((f) => f.id === selectedFuncionarioId);
      const alocacao = mockAlocacoes.find(
        (a) => a.funcionarioId === selectedFuncionarioId && a.status === 'ativa',
      );

      if (alocacao) {
        setValue('obraId', alocacao.obraId);
        setValue('centroCustoId', alocacao.centroCustoId);
      }

      if (funcionario) {
        setValue('filialId', funcionario.filialId);
      }
    }
  }, [selectedFuncionarioId, setValue]);

  const filteredCentrosCusto = useMemo(() => {
    const currentObraId = watch('obraId');
    return mockCentrosCusto.filter((cc) => cc.obraId === currentObraId);
  }, [watch('obraId')]);

  const onSubmit = (data: HoraExtraFormData) => {
    const funcionario = mockFuncionarios.find((f) => f.id === data.funcionarioId)!;
    const obra = options?.obras.find((o) => o.value === data.obraId)!;
    const centroCusto = mockCentrosCusto.find((cc) => cc.id === data.centroCustoId)!;
    const filial = options?.filiais.find((f) => f.value === data.filialId)!;

    createHoraExtra(
      {
        ...data,
        funcionarioNome: funcionario.nome,
        matricula: funcionario.matricula,
        cargo: funcionario.cargo,
        obraNome: obra.label,
        centroCustoNome: centroCusto.nome,
        filialNome: filial.label,
        tipo: data.tipo as HoraExtraTipo,
        origem: data.origem as HoraExtraOrigem,
      },
      {
        onSuccess: () => {
          addNotification({
            title: 'Lançamento criado',
            message: 'O lançamento de hora extra foi registrado com sucesso.',
            type: 'success',
          });
          closeDrawer();
        },
        onError: () => {
          addNotification({
            title: 'Erro ao criar',
            message: 'Ocorreu um erro ao registrar o lançamento.',
            type: 'error',
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-text-body">Funcionário</label>
        <select
          {...register('funcionarioId')}
          className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
        >
          <option value="">Selecione um funcionário</option>
          {mockFuncionarios.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nome} ({f.matricula})
            </option>
          ))}
        </select>
        {errors.funcionarioId && <p className="mt-1 text-xs text-danger">{errors.funcionarioId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">Obra</label>
          <select
            {...register('obraId')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          >
            <option value="">Selecione a obra</option>
            {options?.obras.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {errors.obraId && <p className="mt-1 text-xs text-danger">{errors.obraId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-body">Centro de Custo</label>
          <select
            {...register('centroCustoId')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          >
            <option value="">Selecione o CC</option>
            {filteredCentrosCusto.map((cc) => (
              <option key={cc.id} value={cc.id}>
                {cc.nome}
              </option>
            ))}
          </select>
          {errors.centroCustoId && <p className="mt-1 text-xs text-danger">{errors.centroCustoId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">Competência</label>
          <input
            type="text"
            placeholder="AAAA-MM"
            {...register('competencia')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          />
          {errors.competencia && <p className="mt-1 text-xs text-danger">{errors.competencia.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-body">Data</label>
          <input
            type="date"
            {...register('dataLancamento')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          />
          {errors.dataLancamento && <p className="mt-1 text-xs text-danger">{errors.dataLancamento.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">Horas</label>
          <input
            type="number"
            step="0.5"
            {...register('quantidadeHoras', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          />
          {errors.quantidadeHoras && <p className="mt-1 text-xs text-danger">{errors.quantidadeHoras.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-body">Regra</label>
          <select
            {...register('regraId')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          >
            {mockHoraExtraRegras.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
          {errors.regraId && <p className="mt-1 text-xs text-danger">{errors.regraId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">Tipo</label>
          <select
            {...register('tipo')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          >
            {Object.entries(HORA_EXTRA_TIPO_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-body">Origem</label>
          <select
            {...register('origem')}
            className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
          >
            <option value="obra">Obra</option>
            <option value="rh">RH</option>
            <option value="integracao_ponto">Integração Ponto</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-body">Observação</label>
        <textarea
          {...register('observacao')}
          rows={3}
          className="mt-1 block w-full rounded-md border border-border-default bg-white px-3 py-2 text-sm outline-none focus:border-jogab-500"
        />
      </div>

      <div className="mt-4 flex justify-end gap-3 border-t border-border-default pt-4">
        <button
          type="button"
          onClick={closeDrawer}
          className="rounded-md border border-border-default px-4 py-2 text-sm font-medium text-text-body hover:bg-surface-soft"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-jogab-700 px-4 py-2 text-sm font-medium text-white hover:bg-jogab-800 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar lançamento'}
        </button>
      </div>
    </form>
  );
}
