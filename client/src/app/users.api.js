import { api } from "./api";
import { setMessage } from "features/global.slice";

const usersApi = api
  .enhanceEndpoints({
    addTagTypes: ["Users", "UserById"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      adminGetUsers: build.query({
        query: (query) => ({
          url: query ? `users?${query}` : "users",
          credentials: "include",
        }),
        transformResponse: (res) => res.data,
        providesTags: ["Users"],
      }),
      adminUserById: build.query({
        query: (id) => ({
          url: `users/${id}`,
          credentials: "include",
        }),
        transformResponse: (res) => res.data,
        providesTags: ["UserById"],
      }),
      adminUpdateUser: build.mutation({
        query: ({ body, id }) => ({
          url: `users/${id}`,
          method: "PATCH",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["Users", "UserById"],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "User has been successfully updated!",
              })
            );
          } catch (err) {}
        },
      }),
      deleteUser: build.mutation({
        query: (id) => ({
          url: `users/${id}`,
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: ["Users"],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "User has been deleted",
              })
            );
          } catch (err) {
            dispatch(
              setMessage({
                type: "error",
                msg: "Something went wrong, please try again later",
              })
            );
          }
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useAdminGetUsersQuery,
  useAdminUserByIdQuery,
  useAdminUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
