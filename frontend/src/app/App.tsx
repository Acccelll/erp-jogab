import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { router } from '@/app/router';
import { fetchContextBootstrap, mergeContextWithBootstrap } from '@/shared/lib/context.service';
import { useAuthStore, useContextStore } from '@/shared/stores';

function AppBootstrap() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const usuario = useAuthStore((state) => state.usuario);
  const initializeContext = useContextStore((state) => state.initializeContext);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    async function syncContext() {
      if (!isHydrated || !usuario) return;
      const currentContext = useContextStore.getState();
      const bootstrap = await fetchContextBootstrap(usuario);
      initializeContext({
        ...bootstrap,
        contexto: mergeContextWithBootstrap(currentContext, bootstrap),
      });
    }

    void syncContext();
  }, [initializeContext, isHydrated, usuario]);

  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <QueryProvider>
      <AppBootstrap />
    </QueryProvider>
  );
}
