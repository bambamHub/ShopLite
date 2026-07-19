import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Store } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "./authSlice";
import { loginSchema, type LoginFormValues } from "./loginSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "emilys", password: "emilyspass" },
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (accessToken) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/products";
    return <Navigate to={redirectTo} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      navigate("/products", { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="rounded-xl bg-brand-50 p-3">
            <Store className="h-6 w-6 text-brand-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Sign in to ShopLite</h1>
          <p className="text-sm text-gray-500">Use the demo credentials below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            label="Username"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" isLoading={status === "loading"} className="mt-2 w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Demo: emilys / emilyspass
        </p>
      </div>
    </div>
  );
}
