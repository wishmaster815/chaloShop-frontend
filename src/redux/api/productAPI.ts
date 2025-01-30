import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  allProductsResponse,
  categoriesResponse,
  deleteProductRequest,
  MessageResponse,
  newProductRequest,
  ProductResponse,
  searchProductsRequest,
  searchProductsResponse,
  updateProductRequest,
} from "../../types/apiTypes";

export const productAPI = createApi({
  reducerPath: "productAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<allProductsResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),

    allProducts: builder.query<allProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),

    categories: builder.query<categoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),

    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    searchProducts: builder.query<
      searchProductsResponse,
      searchProductsRequest
    >({
      query: ({ sort, search, category, price, page }) => {
        let base = `all?search=${search}&page=${page}`;

        if (sort) base += `&sort=${sort}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;

        return base;
      },
      providesTags: ["product"],
    }),

    newProduct: builder.mutation<MessageResponse, newProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation<MessageResponse, updateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<MessageResponse, deleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
