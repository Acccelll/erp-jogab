import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2, Save, XCircle } from 'lucide-react';
import { z } from 'zod';
import { useFormDirty } from '@/shared/hooks';
import { getAlocacaoById, getCentrosCustoByObraId } from '@/shared/lib/erpRelations';
import { useContextStore, useDrawerStore, useDirtyStore } from '@/shared/stores';
import type { AlocacaoCreatePayload, AlocacaoUpdatePayload } from '@/shared/types';
import { mockObras } from '@/modules/obras/data/obras.mock';
import { useCreateAlocacao, useEncerrarAlocacao, useUpdateAlocacao } from '../hooks';

interface AlocacaoMutationDrawerFormProps {
  funcionarioId: string;
  alocacaoId?: string;
}

const alocacaoFormSchema = z
  .object({
    obraId: z.string().min(1, 'Selecione a obra.'),
    centroCustoId: z.string().min(1, 'Selecione o centro de custo.'),
    funcao: z.string().min(2, 'Informe a função.'),
    equipe: z.string().min(2, 'Informe a equipe.'),
    jornada: z.string().min(2, 'Informe a jornada.'),
    percentual: z.number().min(1, 'Informe um percentual válido.').max(100, 'O percentual máximo é 100%.'),
    departamento: z.string().min(2, 'Informe o departamento.'),
    periodoInicio: z.string().min(1, 'Informe a vigência inicial.'),
    periodoFim: z.string().optional().nullable(),
    status: z.enum(['ativa', 'planejada', 'encerrada']),
  })
  .superRefine((data, ctx) => {
    if (data.periodoFim && data.periodoFim < data.periodoInicio) {
      ctx.addIssue({
        code: 'custom',
        path: ['periodoFim'],
        message: 'A vigência final não pode ser anterior ao início.',
      });
    }

    if (data.status === 'encerrada' && !data.periodoFim) {
      ctx.addIssue({ code: 'custom', path: ['periodoFim'], message: 'Informe a data final para encerrar a alocação.' });
    }
  });

type AlocacaoFormData = z.infer<typeof alocacaoFormSchema>;

function toFormValues(data?: Partial<AlocacaoFormData>): AlocacaoFormData {
  return {
    obraId: data?.obraId ?? '',
    centroCustoId: data?.centroCustoId ?? '',
    funcao: data?.funcao ?? '',
    equipe: data?.equipe ?? '',
    jornada: data?.jornada ?? '44h semanais',
    percentual: data?.percentual ?? 100,
    departamento: data?.departamento ?? '',
    periodoInicio: data?.periodoInicio ?? new Date().toISOString().slice(0, 10),
    periodoFim: data?.periodoFim ?? null,
    status: data?.status ?? 'ativa',
  };
}

export function AlocacaoMutationDrawerForm({ funcionarioId, alocacaoId }: AlocacaoMutationDrawerFormProps) {
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);
  // Read primitive values individually to avoid re-render on unrelated store changes
  const contextObraId = useContextStore((s) => s.obraId);
  const contextCentroCustoId = useContextStore((s) => s.centroCustoId);
  const contextObras = useContextStore((s) => s.options?.obras ?? []);
  const createMutation = useCreateAlocacao();
  const updateMutation = useUpdateAlocacao();
  const endMutation = useEncerrarAlocacao();
  const isEdit = Boolean(alocacaoId);
  const isPending = createMutation.isPending || updateMutation.isPending || endMutation.isPending;
  const currentAlocacao = useMemo(() => (alocacaoId ? getAlocacaoById(alocacaoId) : null), [alocacaoId]);

  const {
    register,
    control,
    reset,
    setValue,
    getValues,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<AlocacaoFormData>({
    defaultValues: toFormValues({
      obraId: currentAlocacao?.obraId ?? contextObraId ?? '',
      centroCustoId: currentAlocacao?.centroCustoId ?? contextCentroCustoId ?? '',
      funcao: currentAlocacao?.funcao ?? '',
      equipe: currentAlocacao?.equipe ?? '',
      jornada: currentAlocacao?.jornada ?? '44h semanais',
      percentual: currentAlocacao?.percentual ?? 100,
      departamento: currentAlocacao?.departamento ?? '',
      periodoInicio: currentAlocacao?.periodoInicio ?? new Date().toISOString().slice(0, 10),
      periodoFim: currentAlocacao?.periodoFim ?? null,
      status: currentAlocacao?.status ?? 'ativa',
    }),
  });

  useFormDirty(isDirty);

  const obraId = useWatch({ control, name: 'obraId' });
  const status = useWatch({ control, name: 'status' });
  const centrosCusto = useMemo(() => (obraId ? getCentrosCustoByObraId(obraId) : []), [obraId]);
  const obraOptions = useMemo(() => {
    if (contextObras.length > 0) {
      return contextObras.map((obra) => ({ value: obra.value, label: obra.label }));
    }
    return mockObras.map((obra) => ({ value: obra.id, label: `${obra.codigo} — ${obra.nome}` }));
  }, [contextObras]);

  useEffect(() => {
    if (!isEdit) {
      reset(
        toFormValues({
          obraId: contextObraId ?? '',
          centroCustoId: contextCentroCustoId ?? '',
        }),
      );
      return;
    }

    if (currentAlocacao) {
      reset(
        toFormValues({
          obraId: currentAlocacao.obraId,
          centroCustoId: currentAlocacao.centroCustoId,
          funcao: currentAlocacao.funcao,
          equipe: currentAlocacao.equipe,
          jornada: currentAlocacao.jornada,
          percentual: currentAlocacao.percentual,
          departamento: currentAlocacao.departamento,
          periodoInicio: currentAlocacao.periodoInicio,
          periodoFim: currentAlocacao.periodoFim ?? null,
          status: currentAlocacao.status,
        }),
      );
    }
  }, [contextCentroCustoId, contextObraId, currentAlocacao, isEdit, reset]);

  useEffect(() => {
    if (centrosCusto.length === 0) {
      setValue('centroCustoId', '');
      return;
    }

    const current = getValues('centroCustoId');
    if (!current || !centrosCusto.some((item) => item.id === current)) {
      setValue('centroCustoId', centrosCusto[0]?.id ?? '');
    }
  }, [centrosCusto, getValues, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    const parsed = alocacaoFormSchema.safeParse(values);
    const { resetDirty } = useDirtyStore.getState();

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof AlocacaoFormData, { message: issue.message });
        }
      });
      return;
    }

    try {
      if (isEdit && alocacaoId) {
        await updateMutation.mutateAsync({
          id: alocacaoId,
          funcionarioId,
          ...parsed.data,
        } satisfies AlocacaoUpdatePayload);
      } else {
        await createMutation.mutateAsync({ funcionarioId, ...parsed.data } satisfies AlocacaoCreatePayload);
      }
      resetDirty();
      closeDrawer();
    } catch (error) {
      setError('root', { message: error instanceof Error ? error.message : 'Não foi possível salvar a alocação.' });
    }
  });

  const onEnd = async () => {
    if (!alocacaoId) return;

    try {
      await endMutation.mutateAsync(alocacaoId);
      closeDrawer();
    } catch (error) {
      setError('root', { message: error instanceof Error ? error.message : 'Não foi possível encerrar a alocação.' });
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Obra</span>
          <select {...register('obraId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Selecione</option>
            {obraOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.obraId && <span className="text-xs text-red-600">{errors.obraId.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Centro de custo</span>
          <select {...register('centroCustoId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Selecione</option>
            {centrosCusto.map((item) => (
              <option key={item.id} value={item.id}>
                {item.codigo} — {item.nome}
              </option>
            ))}
          </select>
          {errors.centroCustoId && <span className="text-xs text-red-600">{errors.centroCustoId.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Função</span>
          <input {...register('funcao')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.funcao && <span className="text-xs text-red-600">{errors.funcao.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Equipe</span>
          <input {...register('equipe')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.equipe && <span className="text-xs text-red-600">{errors.equipe.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Departamento</span>
          <input {...register('departamento')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.departamento && <span className="text-xs text-red-600">{errors.departamento.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Jornada</span>
          <input {...register('jornada')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.jornada && <span className="text-xs text-red-600">{errors.jornada.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Percentual</span>
          <input
            type="number"
            step="1"
            {...register('percentual', { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.percentual && <span className="text-xs text-red-600">{errors.percentual.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Status</span>
          <select {...register('status')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="ativa">Ativa</option>
            <option value="planejada">Planejada</option>
            <option value="encerrada">Encerrada</option>
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Início da vigência</span>
          <input
            type="date"
            {...register('periodoInicio')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.periodoInicio && <span className="text-xs text-red-600">{errors.periodoInicio.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Fim da vigência</span>
          <input
            type="date"
            {...register('periodoFim')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.periodoFim && <span className="text-xs text-red-600">{errors.periodoFim.message}</span>}
        </label>
      </div>

      {status === 'ativa' && (
        <div className="rounded-md border border-jogab-100 bg-jogab-50 px-3 py-2 text-xs text-jogab-700">
          Alocações ativas podem coexistir desde que a soma dos percentuais do funcionário não ultrapasse 100%.
        </div>
      )}

      {errors.root && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-border-default pt-4">
        <div>
          {isEdit && currentAlocacao?.status !== 'encerrada' && (
            <button
              type="button"
              onClick={() => void onEnd()}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 disabled:opacity-60"
            >
              {endMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
              Encerrar alocação
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-text-body"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-jogab-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? 'Salvar alocação' : 'Criar alocação'}
          </button>
        </div>
      </div>
    </form>
  );
}
