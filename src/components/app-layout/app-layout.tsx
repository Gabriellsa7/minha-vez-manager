import { Outlet } from 'react-router';

function AppLayout() {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export { AppLayout };
