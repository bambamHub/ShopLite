# ShopLite

A small product store built against [dummyjson.com](https://dummyjson.com) — login, browse/search/filter products, product detail, and a persisted cart.

## Stack

- **React 19 + Vite + TypeScript**
- **Redux Toolkit** for auth and cart state
- **RTK Query** for product data (list, detail, categories) — handles caching, loading/error flags, and tag-based invalidation for free, so there's no hand-rolled fetch/loading/error boilerplate per page
- **redux-persist** for auth + cart (survives a refresh)
- **React Router v7** with a protected-route wrapper and lazy-loaded route chunks
- **React Hook Form + Zod** for the login form
- **Axios**, with one shared instance: request interceptor injects the JWT, response interceptor normalizes errors and handles 401 (expired/invalid token) globally
- **Tailwind CSS** + **lucide-react** icons, **sonner** for toasts

## Why Redux Toolkit (and RTK Query specifically)

Auth and cart are classic global, cross-cutting client state — multiple unrelated components (header badge, cart page, protected routes) all need to read them, so lifting them to context or component state would mean prop-drilling or a messy set of contexts. RTK Query was the better fit for *products* specifically over plain thunks: product data is server state, not client state — it needs caching, refetch-on-demand, and per-request loading/error flags, which RTK Query gives out of the box via `createApi`. Writing that by hand with thunks + slices would mean re-implementing a smaller, buggier version of the same thing.

Both share one Axios instance via a small `axiosBaseQuery` adapter, so the interceptors (token injection, 401 handling) apply uniformly whether a request goes through a thunk or through RTK Query.

## Getting started

```bash
npm install
npm run dev
```

Login with the seeded dummyjson user:

- **username:** `emilys`
- **password:** `emilyspass`

## Folder structure

```
src/
  api/            axios instance + interceptors, RTK Query base adapter
  app/            store setup, typed hooks
  components/ui/  shared primitives (Button, Input, Skeleton, ErrorState, EmptyState)
  features/
    auth/         login form, schema, slice
    products/     list/detail pages, search, filter, pagination, RTK Query API
    cart/         cart slice, selectors, cart page
  hooks/          useDebounce
  layouts/        authenticated shell (header, cart badge, logout)
  routes/         route table + ProtectedRoute
  types/          shared domain types
```

Feature-based, not type-based — everything related to cart (state, selectors, UI) lives in one folder instead of being split across a global `reducers/`, `pages/`, `components/`.

## Notable decisions

- **Search & filter are server-side.** Search hits `/products/search`, category hits `/products/category/:slug` — both debounced/instant respectively — rather than fetching everything and filtering client-side, since the API supports it directly and it keeps payloads small.
- **Pagination resets on any filter change** to avoid landing on an out-of-range page for a narrower result set.
- **401 handling is global**, not per-request: the axios interceptor clears the token and fires a DOM event; `App` listens for it and dispatches `logout()`. This means an expired token gets caught wherever it happens to fail, not just on a hardcoded set of endpoints.
- **Cart only persists `id/title/price/thumbnail/quantity`**, not the full product — enough to render and total the cart without persisting stale product data (price changes, out-of-stock, etc. aren't reflected until you revisit the product itself).

## Known tradeoffs / what I'd add next

- Checkout is a no-op (toast placeholder) — out of scope per the assignment.
- No optimistic updates on cart mutations; not needed since cart is local-only (no cart API on dummyjson).
- dummyjson's category endpoint returns `{slug, name, url}` objects in some environments and plain strings in others — `transformResponse` normalizes both, but a real API contract would remove that ambiguity.
- No E2E tests; given more time, I'd add Vitest + Testing Library for the cart reducer/selectors and the login form's validation states first, since those are the highest-value units.
- Token expiry is time-boxed to dummyjson's mocked 60-minute token; there's no refresh-token flow wired up since dummyjson's refresh endpoint isn't needed for a 60-minute demo session.
