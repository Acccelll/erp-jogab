import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import { useContextStore, useDrawerStore } from '@/shared/stores';
import { mockObras } from '../data/obras.mock';
import { useObraDetails, useCreateObra, useUpdateObra } from '../hooks';
import { getObraFormReferenceData } from '../services/obras.service';
import { obraFormSchema } from '../types';
import type { ObraFormData } from '../types';

interface ObraMutationDrawerFormProps {
  obraId?: string;
}

function toFormValues(data?: Partial<ObraFormData>): ObraFormData {
  return {
    codigo: data?.codigo ?? '',
    nome: data?.nome ?? '',
    descricao: data?.descricao ?? '',
    status: data?.status ?? 'planejamento',
    tipo: data?.tipo ?? 'residencial',
    clienteId: data?.clienteId ?? '',
    responsavelId: data?.responsavelId ?? '',
    filialId: data?.filialId ?? '',
    endereco: data?.endereco ?? '',
    cidade: data?.cidade ?? '',
    uf: data?.uf ?? '',
    dataInicio: data?.dataInicio ?? '',
    dataPrevisaoFim: data?.dataPrevisaoFim ?? '',
    orcamentoPrevisto: data?.orcamentoPrevisto ?? 0,
  };
}

export function ObraMutationDrawerForm({ obraId }: ObraMutationDrawerFormProps) {
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);
  const contextFilialId = useContextStore((state) => state.filialId);
  const { obra, isLoading } = useObraDetails(obraId);
  const createMutation = useCreateObra();
  const updateMutation = useUpdateObra();
  const isEdit = Boolean(obraId);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const referenceData = useMemo(() => getObraFormReferenceData(), []);
  const fallbackClienteId = referenceData.clientes[0]?.value ?? mockObras[0]?.clienteId ?? '';
  const fallbackResponsavelId = referenceData.responsaveis[0]?.value ?? mockObras[0]?.responsavelId ?? '';
  const fallbackFilialId = contextFilialId ?? referenceData.filiais[0]?.value ?? mockObras[0]?.filialId ?? '';

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ObraFormData>({
    defaultValues: toFormValues({
      clienteId: fallbackClienteId,
      responsavelId: fallbackResponsavelId,
      filialId: fallbackFilialId,
      dataInicio: new Date().toISOString().slice(0, 10),
      dataPrevisaoFim: new Date().toISOString().slice(0, 10),
    }),
  });

  useEffect(() => {
    if (!isEdit) {
      reset(
        toFormValues({
          clienteId: fallbackClienteId,
          responsavelId: fallbackResponsavelId,
          filialId: fallbackFilialId,
          dataInicio: new Date().toISOString().slice(0, 10),
          dataPrevisaoFim: new Date().toISOString().slice(0, 10),
        }),
      );
      return;
    }

    if (obra) {
      reset(
        toFormValues({
          codigo: obra.codigo,
          nome: obra.nome,
          descricao: obra.descricao,
          status: obra.status,
          tipo: obra.tipo,
          clienteId: obra.clienteId,
          responsavelId: obra.responsavelId,
          filialId: obra.filialId,
          endereco: obra.endereco,
          cidade: obra.cidade,
          uf: obra.uf,
          dataInicio: obra.dataInicio,
          dataPrevisaoFim: obra.dataPrevisaoFim,
          orcamentoPrevisto: obra.orcamentoPrevisto,
        }),
      );
    }
  }, [obra, fallbackClienteId, fallbackFilialId, fallbackResponsavelId, isEdit, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const parsed = obraFormSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof ObraFormData, { message: issue.message });
        }
      });
      return;
    }

    try {
      if (isEdit && obraId) {
        await updateMutation.mutateAsync({ id: obraId, ...parsed.data });
      } else {
        await createMutation.mutateAsync(parsed.data);
      }
      closeDrawer();
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Não foi possível salvar a obra.',
      });
    }
  });

  if (isEdit && isLoading) {
    return <p className="text-sm text-gray-500">Carregando dados da obra...</p>;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Código</span>
          <input {...register('codigo')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.codigo && <span className="text-xs text-red-600">{errors.codigo.message}</span>}
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Nome</span>
          <input {...register('nome')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.nome && <span className="text-xs text-red-600">{errors.nome.message}</span>}
        </label>
        <label className="text-sm text-gray-700 md:col-span-2">
          <span className="mb-1 block font-medium">Descrição</span>
          <textarea {...register('descricao')} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Status</span>
          <select {...register('status')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="planejamento">Planejamento</option>
            <option value="em_andamento">Em andamento</option>
            <option value="paralisada">Paralisada</option>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Tipo</span>
          <select {...register('tipo')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="industrial">Industrial</option>
            <option value="infraestrutura">Infraestrutura</option>
            <option value="reforma">Reforma</option>
            <option value="outros">Outros</option>
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Cliente</span>
          <select {...register('clienteId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {referenceData.clientes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Responsável</span>
          <select {...register('responsavelId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {referenceData.responsaveis.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Filial</span>
          <select {...register('filialId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {referenceData.filiais.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Cidade</span>
          <input {...register('cidade')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">UF</span>
          <input {...register('uf')} maxLength={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase" />
        </label>
        <label className="text-sm text-gray-700 md:col-span-2">
          <span className="mb-1 block font-medium">Endereço</span>
          <input {...register('endereco')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Data de início</span>
          <input type="date" {...register('dataInicio')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-gray-700">
          <span className="mb-1 block font-medium">Previsão de fim</span>
          <input type="date" {...register('dataPrevisaoFim')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-gray-700 md:col-span-2">
          <span className="mb-1 block font-medium">Orçamento previsto</span>
          <input type="number" step="0.01" {...register('orcamentoPrevisto', { valueAsNumber: true })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.orcamentoPrevisto && <span className="text-xs text-red-600">{errors.orcamentoPrevisto.message}</span>}
        </label>
      </div>

      {errors.root && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
        <button type="button" onClick={closeDrawer} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-jogab-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? 'Salvar obra' : 'Criar obra'}
        </button>
      </div>
    </form>
  );
}
