import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';

/**
 * AuthGuard — protege rotas autenticadas.
 *
 * Se o usuário não estiver autenticado, redireciona para /login
 * preservando a rota original para redirect pós-login.
 *
 * Uso no router:
 *   { element: <AuthGuard />, children: [ ... rotas protegidas ] }
 */
export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const location = useLocation();

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sidebar-bg">
        <div className="rounded-lg border border-gray-700 bg-white px-6 py-5 text-sm text-gray-600 shadow-xl">
          Restaurando sessão...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
