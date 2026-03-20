import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700">ERP JOGAB</h1>
          <p className="mt-2 text-sm text-gray-500">
            Gestão integrada para construção civil
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
