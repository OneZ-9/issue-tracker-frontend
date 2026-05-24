import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
