import { api } from "./api";
import { setMessage } from "features/global.slice";

const authApi = api
  .enhanceEndpoints({
    addTagTypes: ["User"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUser: build.query({
        query: () => ({ url: "account", credentials: "include" }),
        transformResponse: (res) => res.data,
        providesTags: ["User"],
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            await queryFulfilled;
          } catch (err) {
            document.cookie = "auth_session=; max-age=0; SameSite=Strict";
          }
        },
      }),
      login: build.mutation({
        query: (body) => ({
          url: "account/login",
          method: "POST",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["User"],
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            await queryFulfilled;
            document.cookie = "auth_session=; SameSite=Strict";
          } catch (err) {}
        },
      }),
      signup: build.mutation({
        query: (body) => ({
          url: "account/signup",
          method: "POST",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["User"],
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            await queryFulfilled;
            document.cookie = "auth_session=; SameSite=Strict";
          } catch (err) {}
        },
      }),
      updateUser: build.mutation({
        query: (body) => ({
          url: "account/update-user",
          method: "PATCH",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["User"],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Settings have been successfully updated!",
              })
            );
          } catch (err) {}
        },
      }),
      updatePassword: build.mutation({
        query: (body) => ({
          url: "account/update-password",
          method: "PATCH",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["User"],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Password has been successfully changed!",
              })
            );
          } catch (err) {}
        },
      }),
      forgotPassword: build.mutation({
        query: (body) => ({
          url: "account/forgot-password",
          method: "POST",
          credentials: "include",
          body,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            document.cookie = `code_timeout=${
              Date.now() + 30000
            }; max-age=30; SameSite=Strict`;
            dispatch(
              setMessage({
                type: "success",
                msg: "Link with password reset has been sent to your email address!",
              })
            );
          } catch (err) {}
        },
      }),
      resetPassword: build.mutation({
        query: ({ body, token }) => ({
          url: `account/reset-password/${token}`,
          method: "PATCH",
          body,
        }),
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Password has been successfully changed!",
              })
            );
          } catch (err) {
            dispatch(
              setMessage({
                type: "error",
                msg: err.error.data.message,
              })
            );
          }
        },
      }),
      logout: build.mutation({
        query: () => ({
          url: "account/logout",
          method: "DELETE",
          credentials: "include",
        }),
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            await queryFulfilled;
            document.cookie = "auth_session=; max-age=0; SameSite=Strict";
          } catch (err) {}
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetUserQuery,
  useLoginMutation,
  useSignupMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApi;
