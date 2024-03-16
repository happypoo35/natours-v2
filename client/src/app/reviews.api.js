import { api } from "./api";
import { setMessage } from "features/global.slice";

const reviewsApi = api
  .enhanceEndpoints({
    addTagTypes: ["Reviews", "ReviewById"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getReviews: build.query({
        query: ({ tourId, userId, query }) => ({
          url: `${
            tourId
              ? `tours/${tourId}/reviews${query ? `?${query}` : ""}`
              : userId
              ? `users/${userId}/reviews${query ? `?${query}` : ""}`
              : `reviews${query ? `?${query}` : ""}`
          }`,
          credentials: "include",
        }),
        transformResponse: (res) => res.data,
        providesTags: ["Reviews"],
      }),
      getReviewById: build.query({
        query: (id) => ({
          url: `reviews/${id}`,
          credentials: "include",
        }),
        transformResponse: (res) => res.data,
        providesTags: ["ReviewById"],
      }),
      addTourReview: build.mutation({
        query: ({ body, tourId }) => ({
          url: `tours/${tourId}/reviews`,
          method: "POST",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["Tour", "Tours", "User"],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Your review has been successfully added!",
              })
            );
          } catch (err) {}
        },
      }),
      updateReview: build.mutation({
        query: ({ body, reviewId }) => ({
          url: `reviews/${reviewId}`,
          method: "PATCH",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["Tour", "Tours", "User", "ReviewById"],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Your review has been updated",
              })
            );
          } catch (err) {}
        },
      }),
      deleteReview: build.mutation({
        query: (reviewId) => ({
          url: `reviews/${reviewId}`,
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: ["Tour", "Tours", "User", "Reviews"],
        async onQueryStarted(_, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Your review has been deleted",
              })
            );
          } catch (err) {}
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetReviewsQuery,
  useAddTourReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewByIdQuery,
} = reviewsApi;
