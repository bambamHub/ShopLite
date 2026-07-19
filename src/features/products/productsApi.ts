import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import type { Product, ProductsResponse } from "@/types";

const PAGE_SIZE = 12;

interface ProductsQueryArgs {
  page: number;
  search?: string;
  category?: string;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryArgs>({
      query: ({ page, search, category }) => {
        const skip = (page - 1) * PAGE_SIZE;

        if (search) {
          return { url: "/products/search", params: { q: search, limit: PAGE_SIZE, skip } };
        }
        if (category && category !== "all") {
          return { url: `/products/category/${category}`, params: { limit: PAGE_SIZE, skip } };
        }
        return { url: "/products", params: { limit: PAGE_SIZE, skip } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getCategories: builder.query<string[], void>({
      query: () => ({ url: "/products/categories" }),
      // dummyjson returns objects like { slug, name, url }; normalize to slugs for filtering.
      transformResponse: (response: unknown) => {
        if (Array.isArray(response) && typeof response[0] === "string") {
          return response as string[];
        }
        return (response as { slug: string }[]).map((c) => c.slug);
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useGetCategoriesQuery } = productsApi;
export const PRODUCTS_PAGE_SIZE = PAGE_SIZE;
