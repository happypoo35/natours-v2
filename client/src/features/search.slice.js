import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tours: {},
  manageTours: {},
  manageUsers: {},
  manageReviews: {},
  manageBookings: {},
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addParam: (state, { payload }) => {
      const { loc, key, value } = payload;

      switch (key) {
        case "sort":
          let arr = state[loc][key]?.split(",") || [];
          if (arr.includes(value)) {
            const id = arr.indexOf(value);
            arr[id] = `-${value}`;
          } else if (arr.includes(`-${value}`)) {
            const id = arr.indexOf(`-${value}`);
            arr.splice(id, 1);
          } else {
            arr.push(value);
          }

          if (arr.length) {
            state[loc][key] = arr.join(",");
          } else {
            delete state[loc][key];
          }
          break;
        case "difficulty":
          if (!state[loc][key]) state[loc][key] = [];

          if (state[loc][key].includes(value)) {
            const id = state[loc][key].indexOf(value);
            state[loc][key].splice(id, 1);
          } else {
            state[loc][key].push(value);
          }

          if (!state[loc][key].length) delete state[loc][key];
          break;
        default:
          if (key && !value) {
            delete state[loc][key];
          } else {
            state[loc][key] = value;
          }
      }
    },
    clearParam: (state, { payload }) => {
      const { loc, key } = payload;
      delete state[loc][key];
    },
    clearAllParams: (state, { payload }) => {
      state[payload] = {};
    },
  },
});

export const selectToursQuery = (state) => state.search.tours;
export const selectManageToursQuery = (state) => state.search.manageTours;
export const selectManageUsersQuery = (state) => state.search.manageUsers;
export const selectManageReviewsQuery = (state) => state.search.manageReviews;
export const selectManageBookingsQuery = (state) => state.search.manageBookings;

export const { addParam, clearParam, clearAllParams } = searchSlice.actions;

export default searchSlice.reducer;
