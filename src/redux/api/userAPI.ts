import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { User } from "../../types/types";
import {
  allUserResponse,
  deleteUserRequest,
  MessageResponse,
  userResponse,
} from "../../types/apiTypes";
import axios from "axios";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    allUsers: builder.query<allUserResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
    deleteUser: builder.mutation<MessageResponse, deleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: userResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const { useLoginMutation, useDeleteUserMutation, useAllUsersQuery } =
  userAPI;
