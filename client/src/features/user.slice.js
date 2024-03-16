import { createSlice } from "@reduxjs/toolkit";
import { api } from "app/api";

const initialState = {
  user: null,
  bookings: [],
  reviews: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: () => {
      return initialState;
    },
  },
  extraReducers: (build) => {
    build
      .addMatcher(
        api.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          const { bookings, reviews, ...rest } = payload;
          state.user = rest;
          state.bookings = bookings;
          state.reviews = reviews;
        }
      )
      .addMatcher(api.endpoints.logout.matchFulfilled, () => {
        return initialState;
      });
  },
});

export const selectUser = (state) => state.user.user;
export const selectRole = (state) => state.user.user.role;
export const selectUserBookings = (state) => state.user.bookings;
export const selectUserReviews = (state) => state.user.reviews;

export const { clear } = userSlice.actions;

export default userSlice.reducer;
