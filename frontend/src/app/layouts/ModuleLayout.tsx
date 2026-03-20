import { Outlet } from 'react-router-dom';

export function ModuleLayout() {
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <Outlet />
    </div>
  );
}
