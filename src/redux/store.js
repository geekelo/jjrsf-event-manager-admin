import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./eventsSlice"
import eventDetailsReducer from "./eventDetailsSlice"

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    eventDetails: eventDetailsReducer,
  },
})
