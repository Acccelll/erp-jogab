import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';
import { useFormDirty } from '@/shared/hooks';
import { getCentrosCustoByObraId } from '@/shared/lib/erpRelations';
import { useContextStore, useDrawerStore, useDirtyStore } from '@/shared/stores';
import { mockFuncionarios } from '../data/funcionarios.mock';
import { useCreateFuncionario, useFuncionarioDetails, useUpdateFuncionario } from '../hooks';
import { getFuncionarioFormReferenceData } from '../services/funcionarios.service';
import { funcionarioFormSchema } from '../types';
import type { FuncionarioFormData } from '../types';

interface FuncionarioMutationDrawerFormProps {
  funcionarioId?: string;
}

function toFormValues(data?: Partial<FuncionarioFormData>): FuncionarioFormData {
  return {
    matricula: data?.matricula ?? '',
    nome: data?.nome ?? '',
    cpf: data?.cpf ?? '',
    status: data?.status ?? 'ativo',
    tipoContrato: data?.tipoContrato ?? 'clt',
    cargo: data?.cargo ?? '',
    funcao: data?.funcao ?? '',
    departamento: data?.departamento ?? '',
    filialId: data?.filialId ?? '',
    obraAlocadoId: data?.obraAlocadoId ?? null,
    centroCustoId: data?.centroCustoId ?? null,
    dataAdmissao: data?.dataAdmissao ?? '',
    salarioBase: data?.salarioBase ?? 0,
    email: data?.email ?? '',
    telefone: data?.telefone ?? '',
    cidade: data?.cidade ?? '',
    uf: data?.uf ?? '',
    gestorId: data?.gestorId ?? null,
  };
}

export function FuncionarioMutationDrawerForm({ funcionarioId }: FuncionarioMutationDrawerFormProps) {
  const closeDrawer = useDrawerStore((state) => state.closeDrawer);
  // Read primitive values individually to avoid re-render on unrelated store changes
  const contextFilialId = useContextStore((s) => s.filialId);
  const contextObraId = useContextStore((s) => s.obraId);
  const contextCentroCustoId = useContextStore((s) => s.centroCustoId);
  const { funcionario, isLoading } = useFuncionarioDetails(funcionarioId);
  const createMutation = useCreateFuncionario();
  const updateMutation = useUpdateFuncionario();
  const isEdit = Boolean(funcionarioId);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const referenceData = useMemo(() => getFuncionarioFormReferenceData(), []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    setError,
    formState: { errors, isDirty },
  } = useForm<FuncionarioFormData>({
    defaultValues: toFormValues({
      filialId: contextFilialId ?? referenceData.filiais[0]?.value ?? mockFuncionarios[0]?.filialId ?? '',
      obraAlocadoId: contextObraId ?? null,
      centroCustoId: contextCentroCustoId ?? null,
      gestorId: mockFuncionarios[0]?.id ?? null,
      dataAdmissao: new Date().toISOString().slice(0, 10),
    }),
  });

  useFormDirty(isDirty);

  const obraAlocadoId = useWatch({ control, name: 'obraAlocadoId' });
  const centrosCusto = useMemo(() => (obraAlocadoId ? getCentrosCustoByObraId(obraAlocadoId) : []), [obraAlocadoId]);

  useEffect(() => {
    if (centrosCusto.length === 0) {
      setValue('centroCustoId', null);
      return;
    }

    const current = getValues('centroCustoId');
    if (!current || !centrosCusto.some((item) => item.id === current)) {
      setValue('centroCustoId', centrosCusto[0]?.id ?? null);
    }
  }, [centrosCusto, getValues, setValue]);

  useEffect(() => {
    if (!isEdit) {
      reset(
        toFormValues({
          filialId: contextFilialId ?? referenceData.filiais[0]?.value ?? mockFuncionarios[0]?.filialId ?? '',
          obraAlocadoId: contextObraId ?? null,
          centroCustoId: contextCentroCustoId ?? null,
          gestorId: mockFuncionarios[0]?.id ?? null,
          dataAdmissao: new Date().toISOString().slice(0, 10),
        }),
      );
      return;
    }

    if (funcionario) {
      reset(
        toFormValues({
          matricula: funcionario.matricula,
          nome: funcionario.nome,
          cpf: funcionario.cpf,
          status: funcionario.status,
          tipoContrato: funcionario.tipoContrato,
          cargo: funcionario.cargo,
          funcao: funcionario.funcao,
          departamento: funcionario.departamento,
          filialId: funcionario.filialId,
          obraAlocadoId: funcionario.obraAlocadoId,
          centroCustoId: funcionario.centroCustoId,
          dataAdmissao: funcionario.dataAdmissao,
          salarioBase: funcionario.salarioBase,
          email: funcionario.email,
          telefone: funcionario.telefone,
          cidade: funcionario.cidade,
          uf: funcionario.uf,
          gestorId: funcionario.gestorId,
        }),
      );
    }
  }, [contextCentroCustoId, contextFilialId, contextObraId, funcionario, isEdit, referenceData.filiais, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const parsed = funcionarioFormSchema.safeParse(values);

    const { resetDirty } = useDirtyStore.getState();

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          setError(field as keyof FuncionarioFormData, { message: issue.message });
        }
      });
      return;
    }

    try {
      if (isEdit && funcionarioId) {
        await updateMutation.mutateAsync({ id: funcionarioId, ...parsed.data });
      } else {
        await createMutation.mutateAsync(parsed.data);
      }
      resetDirty();
      closeDrawer();
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Não foi possível salvar o funcionário.',
      });
    }
  });

  if (isEdit && isLoading) {
    return <p className="text-sm text-text-muted">Carregando dados do funcionário...</p>;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Matrícula</span>
          <input {...register('matricula')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.matricula && <span className="text-xs text-red-600">{errors.matricula.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Nome</span>
          <input {...register('nome')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.nome && <span className="text-xs text-red-600">{errors.nome.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">CPF</span>
          <input {...register('cpf')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {errors.cpf && <span className="text-xs text-red-600">{errors.cpf.message}</span>}
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Status</span>
          <select {...register('status')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="ativo">Ativo</option>
            <option value="afastado">Afastado</option>
            <option value="ferias">Férias</option>
            <option value="desligado">Desligado</option>
            <option value="admissao_pendente">Admissão pendente</option>
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Contrato</span>
          <select {...register('tipoContrato')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="clt">CLT</option>
            <option value="pj">PJ</option>
            <option value="temporario">Temporário</option>
            <option value="estagio">Estágio</option>
            <option value="aprendiz">Aprendiz</option>
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Cargo</span>
          <input {...register('cargo')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Função</span>
          <input {...register('funcao')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Departamento</span>
          <input {...register('departamento')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Filial</span>
          <select {...register('filialId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {referenceData.filiais.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Obra</span>
          <select {...register('obraAlocadoId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Sem vínculo</option>
            {referenceData.obras.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Centro de custo</span>
          <select {...register('centroCustoId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Sem vínculo</option>
            {centrosCusto.map((item) => (
              <option key={item.id} value={item.id}>
                {item.codigo} — {item.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Gestor</span>
          <select {...register('gestorId')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Sem gestor</option>
            {referenceData.gestores.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Data de admissão</span>
          <input
            type="date"
            {...register('dataAdmissao')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Salário base</span>
          <input
            type="number"
            step="0.01"
            {...register('salarioBase', { valueAsNumber: true })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-text-body md:col-span-2">
          <span className="mb-1 block font-medium">E-mail</span>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Telefone</span>
          <input {...register('telefone')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">Cidade</span>
          <input {...register('cidade')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-sm text-text-body">
          <span className="mb-1 block font-medium">UF</span>
          <input
            maxLength={2}
            {...register('uf')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase"
          />
        </label>
      </div>

      {errors.root && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-border-default pt-4">
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
          {isEdit ? 'Salvar funcionário' : 'Criar funcionário'}
        </button>
      </div>
    </form>
  );
}
