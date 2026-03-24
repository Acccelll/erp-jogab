import { useCallback, useMemo } from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import type { Permissao, PapelUsuario } from '@/shared/types';

/**
 * Hook utilitário para verificação de permissões do usuário autenticado.
 *
 * Retorna helpers para checar permissões individuais, múltiplas (AND/OR),
 * e o papel (role) do usuário. Preparado para transição futura de mock → API real.
 *
 * @example
 * const { hasPermission, hasAnyPermission, isAdmin } = usePermissions();
 * if (hasPermission('obras:write')) { ... }
 */
export function usePermissions() {
  const usuario = useAuthStore((s) => s.usuario);

  const permissoes = useMemo<Permissao[]>(
    () => (usuario?.permissoes ?? []) as Permissao[],
    [usuario?.permissoes],
  );

  const papel = useMemo<PapelUsuario | null>(
    () => (usuario?.papel as PapelUsuario) ?? null,
    [usuario?.papel],
  );

  /** Verifica se o usuário possui uma permissão específica. */
  const hasPermission = useCallback(
    (permissao: Permissao): boolean => permissoes.includes(permissao),
    [permissoes],
  );

  /** Verifica se o usuário possui TODAS as permissões informadas (AND). */
  const hasAllPermissions = useCallback(
    (required: Permissao[]): boolean => required.every((p) => permissoes.includes(p)),
    [permissoes],
  );

  /** Verifica se o usuário possui PELO MENOS UMA das permissões informadas (OR). */
  const hasAnyPermission = useCallback(
    (required: Permissao[]): boolean => required.some((p) => permissoes.includes(p)),
    [permissoes],
  );

  /** Verifica se o usuário possui papel admin. */
  const isAdmin = papel === 'admin';

  /** Verifica se o usuário possui pelo menos papel de gestor. */
  const isGestorOrAbove = papel === 'admin' || papel === 'gestor';

  return {
    permissoes,
    papel,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isAdmin,
    isGestorOrAbove,
  };
}
