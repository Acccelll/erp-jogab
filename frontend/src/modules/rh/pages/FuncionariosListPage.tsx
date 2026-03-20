import { Users } from 'lucide-react';
import { PageHeader, ModulePlaceholder } from '@/shared/components';

export function FuncionariosListPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Funcionários"
        subtitle="Cadastro e gestão de funcionários"
      />
      <ModulePlaceholder
        icon={Users}
        title="Recursos Humanos"
        description="Módulo de RH para gestão de funcionários, alocações por obra, histórico salarial, provisões trabalhistas e integração com FOPAG."
        phase="Fase 3"
        features={[
          'Listagem e cadastro de funcionários',
          'Detalhe do funcionário com abas',
          'Alocações por obra e centro de custo',
          'Histórico salarial e provisões',
          'Integração com Horas Extras e FOPAG',
        ]}
      />
    </div>
  );
}
