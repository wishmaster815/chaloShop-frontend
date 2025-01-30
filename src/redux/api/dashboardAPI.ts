import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  barResponse,
  lineResponse,
  pieResponse,
  statsResponse,
} from "../../types/apiTypes";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    stats: builder.query<statsResponse, string>({
      query: (id) => `stats?id=${id}`,
    }),
    pie: builder.query<pieResponse, string>({
      query: (id) => `pie?id=${id}`,
    }),
    bar: builder.query<barResponse, string>({
      query: (id) => `bar?id=${id}`,
    }),
    line: builder.query<lineResponse, string>({
      query: (id) => `line?id=${id}`,
    }),
  }),
});

export const { useBarQuery, useStatsQuery, usePieQuery, useLineQuery } =
  dashboardAPI;
