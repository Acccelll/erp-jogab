import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-lg font-bold text-white">
            J
          </div>
          <h1 className="text-2xl font-bold text-white">ERP JOGAB</h1>
          <p className="mt-1 text-sm text-sidebar-text">Gestão integrada para construção civil</p>
        </div>
        <div className="rounded-lg border border-sidebar-border bg-surface-card p-8 shadow-overlay">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
