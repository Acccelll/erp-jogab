import { User, ShieldCheck, Building2, MapPin } from 'lucide-react';
import { PageHeader, MainContent } from '@/shared/components';
import { useAuthStore } from '@/shared/stores';

export function PerfilPage() {
  const usuario = useAuthStore((state) => state.usuario);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Perfil"
        subtitle="Dados do usuário e preferências"
      />
      <MainContent>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-jogab-100 text-jogab-700">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{usuario?.nome ?? 'Usuário'}</h2>
                <p className="text-sm text-gray-500">{usuario?.email ?? 'usuario@jogab.com.br'}</p>
              </div>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Perfil</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                  <ShieldCheck size={16} className="text-jogab-600" />
                  {usuario?.papel ?? 'visualizador'}
                </dd>
              </div>
              <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Permissões</dt>
                <dd className="mt-2 text-sm font-medium text-gray-900">
                  {usuario?.permissoes.length ?? 0} permissões carregadas
                </dd>
              </div>
              <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Empresa</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                  <Building2 size={16} className="text-jogab-600" />
                  {usuario?.empresaId ?? 'Não definida'}
                </dd>
              </div>
              <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Filial</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                  <MapPin size={16} className="text-jogab-600" />
                  {usuario?.filialId ?? 'Não definida'}
                </dd>
              </div>
            </dl>
          </section>

          <aside className="rounded-lg border border-jogab-100 bg-jogab-50 p-5">
            <h3 className="text-sm font-semibold text-jogab-900">Base pronta para Sprint 2</h3>
            <ul className="mt-3 space-y-2 text-sm text-jogab-800">
              <li>• sessão persistida no store global</li>
              <li>• permissões básicas carregadas por perfil</li>
              <li>• contexto inicial derivado do usuário autenticado</li>
              <li>• tela pronta para futura edição de preferências</li>
            </ul>
          </aside>
        </div>
      </MainContent>
    </div>
  );
}
