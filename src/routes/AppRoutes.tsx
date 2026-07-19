import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "@/layouts/MainLayout";

const LoginPage = lazy(() => import("@/features/auth/LoginPage").then((m) => ({ default: m.LoginPage })));
const ProductListPage = lazy(() =>
  import("@/features/products/ProductListPage").then((m) => ({ default: m.ProductListPage })),
);
const ProductDetailPage = lazy(() =>
  import("@/features/products/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })),
);
const CartPage = lazy(() => import("@/features/cart/CartPage").then((m) => ({ default: m.CartPage })));

function PageFallback() {
  return <div className="p-8 text-center text-sm text-gray-400">Loading…</div>;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Suspense>
  );
}
