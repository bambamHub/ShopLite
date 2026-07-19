import { Link } from "react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { decrement, increment, removeFromCart } from "./cartSlice";
import { selectCartItems, selectCartTotal } from "./cartSelectors";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your cart</h1>
        <EmptyState message="Your cart is empty." />
        <Link to="/products" className="text-sm font-medium text-brand-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Your cart</h1>

      <div className="flex flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <img src={item.thumbnail} alt={item.title} className="h-16 w-16 rounded-lg object-cover" />

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-gray-200">
              <button
                onClick={() => dispatch(decrement(item.id))}
                className="p-2 text-gray-600 hover:bg-gray-50"
                aria-label={`Decrease quantity of ${item.title}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => dispatch(increment(item.id))}
                className="p-2 text-gray-600 hover:bg-gray-50"
                aria-label={`Increase quantity of ${item.title}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="w-20 text-right text-sm font-semibold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => dispatch(removeFromCart(item.id))}
              className="p-2 text-gray-400 hover:text-red-600"
              aria-label={`Remove ${item.title} from cart`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
      </div>

      <Button
        className="w-full sm:w-fit sm:self-end"
        onClick={() => toast.info("Checkout isn't wired up in this demo yet.")}
      >
        Checkout
      </Button>
    </div>
  );
}
