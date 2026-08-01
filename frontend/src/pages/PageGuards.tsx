import { Navigate, Outlet } from "react-router";
// import { useAuthStore } from "../stores/authStore";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute() {
  //   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  //   return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
  const { data: user, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <div className="size-10 bg-sky-200 rounded-full animate-bounce"></div>
      </div>
    );
  }

  if (isError || !user) return <Navigate to="/auth" />;

  return <Outlet />;
}

export function GuestRoute() {
  //   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  //   return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;

  const { data: user, isLoading } = useAuth();

  // if (isLoading) return <div>Loading...</div>;
  if (isLoading) {
    return (
      <div className="min-h-screen flex w-full items-center justify-center">
        <div className="size-10 bg-sky-200 rounded-full animate-bounce"></div>
      </div>
    );
  }

  return !user ? <Outlet /> : <Navigate to="/" />;
}
