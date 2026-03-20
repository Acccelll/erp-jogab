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
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
