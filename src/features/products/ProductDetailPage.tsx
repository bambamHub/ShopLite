import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import { useGetProductByIdQuery } from "./productsApi";
import { useAppDispatch } from "@/app/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductDetailPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const dispatch = useAppDispatch();
  const [activeImage, setActiveImage] = useState(0);

  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data: product, isLoading, isError, refetch } = useGetProductByIdQuery(numericId, {
    skip: !isValidId,
  });

  if (!isValidId) {
    return <ErrorState message="Invalid product ID." />;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return <ErrorState message="Product not found." onRetry={refetch} />;
  }

  function handleAddToCart() {
    dispatch(addToCart(product!));
    toast.success(`${product!.title} added to cart`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/products" className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.images[activeImage] ?? product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    activeImage === i ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
            <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </div>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>

          <p className="text-3xl font-bold text-gray-900">${product.price}</p>

          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

          <Button onClick={handleAddToCart} className="mt-2 w-fit" disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
