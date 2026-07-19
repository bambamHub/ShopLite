import { useMemo, useState } from "react";
import { useGetCategoriesQuery, useGetProductsQuery, PRODUCTS_PAGE_SIZE } from "./productsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProductListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  // Any filter change resets pagination — otherwise page 3 of a new search could be empty.
  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }
  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  const { data: categories } = useGetCategoriesQuery();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProductsQuery({ page, search: debouncedSearch, category });

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / PRODUCTS_PAGE_SIZE)) : 1),
    [data],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500">Browse and search the full catalog</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={updateSearch} />
        <CategoryFilter categories={categories ?? []} value={category} onChange={updateCategory} />
      </div>

      {isLoading && <ProductGridSkeleton />}

      {isError && !isLoading && (
        <ErrorState message="Couldn't load products." onRetry={refetch} />
      )}

      {!isLoading && !isError && data && data.products.length === 0 && (
        <EmptyState message="No products match your search." />
      )}

      {!isLoading && !isError && data && data.products.length > 0 && (
        <>
          <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <ProductGrid products={data.products} />
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
