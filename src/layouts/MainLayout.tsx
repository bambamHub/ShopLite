import { Link, Outlet, useNavigate } from "react-router";
import { ShoppingCart, LogOut, Store } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { selectCartCount } from "@/features/cart/cartSelectors";

export function MainLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector(selectCartCount);

  function handleLogout() {
    dispatch(logout());
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/products" className="flex items-center gap-2 font-semibold text-gray-900">
            <Store className="h-5 w-5 text-brand-600" />
            ShopLite
          </Link>

          <div className="flex items-center gap-4">
            {user && <span className="hidden text-sm text-gray-500 sm:inline">Hi, {user.firstName}</span>}

            <Link
              to="/cart"
              className="relative flex items-center rounded-lg p-2 text-gray-700 hover:bg-gray-100"
              aria-label={`Cart (${cartCount} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
