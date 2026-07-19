import { memo } from "react";
import { Link } from "react-router";
import { Star, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useAppDispatch } from "@/app/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart`);
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white
        transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="line-clamp-1 text-sm font-medium text-gray-900">{product.title}</p>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-gray-900">${product.price}</span>
          <Button
            variant="secondary"
            className="px-2.5 py-1.5"
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent);
