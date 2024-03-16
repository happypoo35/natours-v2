import { setMessage } from "features/global.slice";
import { api } from "./api";

const toursApi = api
  .enhanceEndpoints({
    addTagTypes: ["Tours", "Tour", "TourByID"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTours: build.query({
        query: (query) => (query ? `tours?${query}` : "tours"),
        providesTags: ["Tours"],
      }),
      highestRated: build.query({
        query: () => "tours/highest-rated",
        transformResponse: (res) => res.data,
      }),
      stats: build.query({
        query: () => "tours/tour-stats",
        transformResponse: (res) => res[0],
      }),
      singleTour: build.query({
        async queryFn(arg, queryApi, extraOptions, query) {
          const allTours = await query(`tours?slug=${arg}`);
          if (allTours.data.data.length) {
            const tourId = allTours.data.data[0].id;
            const tour = await query(`tours/${tourId}`);
            return { data: tour.data.data };
          } else {
            throw new Error("Tour does not exist");
          }
        },
        providesTags: ["Tour"],
      }),
      singleTourById: build.query({
        query: (id) => `tours/${id}`,
        transformResponse: (res) => res.data,
        providesTags: ["TourByID"],
      }),
      createTour: build.mutation({
        query: (body) => ({
          url: "tours",
          method: "POST",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["Tours"],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Tour has been created",
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
      updateTourByID: build.mutation({
        query: ({ body, id }) => ({
          url: `tours/${id}`,
          method: "PATCH",
          credentials: "include",
          body,
        }),
        invalidatesTags: ["Tours", "TourByID"],
        async onQueryStarted({ body, id }, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Tour has been successfully updated!",
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
      deleteTour: build.mutation({
        query: (id) => ({
          url: `tours/${id}`,
          method: "DELETE",
          credentials: "include",
        }),
        invalidatesTags: ["Tours"],
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            dispatch(
              setMessage({
                type: "success",
                msg: "Tour has been deleted",
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
  useGetToursQuery,
  useHighestRatedQuery,
  useStatsQuery,
  useSingleTourQuery,
  useSingleTourByIdQuery,
  useCreateTourMutation,
  useUpdateTourByIDMutation,
  useDeleteTourMutation,
} = toursApi;
