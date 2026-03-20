import { Outlet } from 'react-router-dom';
import { ContextBar } from '@/shared/components/ContextBar';

export function ModuleLayout() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ContextBar />
      <div className="flex flex-1 flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
