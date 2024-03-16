import { setMessage } from "features/global.slice";
import { api } from "./api";

const bookingsApi = api
  .enhanceEndpoints({
    addTagTypes: ["Bookings", "BookingById"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      checkout: build.mutation({
        query: (tourId) => ({
          url: `bookings/checkout-session/${tourId}`,
          method: "POST",
          credentials: "include",
        }),
      }),
      getBookings: build.query({
        query: ({ tourId, userId, query }) => ({
          url: `${
            tourId
              ? `tours/${tourId}/bookings${query ? `?${query}` : ""}`
              : userId
              ? `users/${userId}/bookings${query ? `?${query}` : ""}`
              : `bookings${query ? `?${query}` : ""}`
          }`,
          credentials: "include",
        }),
        transformResponse: (res) => res.data,
        providesTags: ["Bookings"],
      }),
      getBookingById: build.query({
        query: (id) => ({
          url: `bookings/${id}`,
          credentials: "include",
        }),
        transformResponse: (res) => res.data,
        providesTags: ["BookingById"],
      }),
      updateBooking: build.mutation({
        query: ({ body, bookingId }) => ({
          url: `bookings/${bookingId}`,
          method: "PATCH",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["Tour", "User", "BookingById"],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Booking has been updated",
              })
            );
          } catch (err) {}
        },
      }),
      deleteBooking: build.mutation({
        query: (bookingId) => ({
          url: `bookings/${bookingId}`,
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: ["Tour", "User", "Bookings"],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Booking has been deleted",
              })
            );
          } catch (err) {}
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useCheckoutMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
