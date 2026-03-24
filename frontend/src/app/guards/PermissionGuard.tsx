import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/shared/hooks/usePermissions';
import type { Permissao } from '@/shared/types';

interface PermissionGuardProps {
  /** Permissão(ões) necessárias para acessar o conteúdo protegido. */
  required: Permissao | Permissao[];
  /**
   * Estratégia de verificação quando `required` é array:
   * - `'all'` — exige TODAS as permissões (AND, padrão)
   * - `'any'` — exige pelo menos UMA (OR)
   */
  mode?: 'all' | 'any';
  /**
   * Conteúdo exibido quando o usuário não possui permissão.
   * Se omitido, redireciona para /dashboard.
   */
  fallback?: ReactNode;
  /** Rota para redirecionar quando o acesso é negado (padrão: /dashboard). */
  redirectTo?: string;
  children: ReactNode;
}

/**
 * PermissionGuard — protege componentes ou rotas por permissão.
 *
 * Pode ser usado inline para esconder partes da UI ou como wrapper de rota
 * para bloquear acesso a módulos inteiros.
 *
 * @example
 * // Proteger rota
 * <PermissionGuard required="obras:write">
 *   <ObraCreatePage />
 * </PermissionGuard>
 *
 * // Proteger botão (com fallback vazio)
 * <PermissionGuard required={['obras:write']} fallback={null}>
 *   <Button>Criar Obra</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  required,
  mode = 'all',
  fallback,
  redirectTo = '/dashboard',
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  const requiredList = Array.isArray(required) ? required : [required];

  const hasAccess =
    requiredList.length === 1
      ? hasPermission(requiredList[0])
      : mode === 'any'
        ? hasAnyPermission(requiredList)
        : hasAllPermissions(requiredList);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return <Navigate to={redirectTo} replace />;
}
