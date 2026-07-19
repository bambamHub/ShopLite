import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { AppRoutes } from "@/routes/AppRoutes";

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Raised by the axios interceptor whenever a request comes back 401 —
    // e.g. the token expired mid-session. Force a clean logout.
    function handleUnauthorized() {
      dispatch(logout());
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}
