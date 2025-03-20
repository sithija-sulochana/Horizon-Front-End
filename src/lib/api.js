import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const BACKEND_URL = "http://localhost:8000"

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/`,
    prepareHeaders: async (headers, { getState }) => {
      const token = await window?.Clerk?.session?.getToken()
      console.log(token)
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    },
  }),
  tagTypes: ["Hotels", "Bookings"],
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
      providesTags: ["Hotels"],
    }),
    getHotelById: builder.query({
      query: (id) => `hotels/${id}`,
      providesTags: (result, error, id) => [{ type: "Hotels", id }],
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
      invalidatesTags: ["Hotels"],
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
      invalidatesTags: ["Bookings"],
    }),
    getUserBookings: builder.query({
      query: () => "bookings",  // Changed from "bookings/user" to "bookings"
      providesTags: ["Bookings"],
    }),
  }),
})

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
} = api
