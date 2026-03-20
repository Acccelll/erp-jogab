import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar-bg">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-jogab-500 text-lg font-bold text-white">
            J
          </div>
          <h1 className="text-2xl font-bold text-white">ERP JOGAB</h1>
          <p className="mt-1 text-sm text-gray-400">
            Gestão integrada para construção civil
          </p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-white p-8 shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
