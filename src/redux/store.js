import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./eventsSlice"
import attendeesReducer from "./attendeesSlice"
import frontDeskReducer from "./frontDeskSlice"
import platformReducer from "./platformSlice"
import quickRegistrationsReducer from "./quickRegistrationsSlice"
import feedbackReducer from "./feedbackSlice"
import imageReducer from "./imageSlice"
import notificationsReducer from "./notificationsSlice"

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    attendees: attendeesReducer,
    frontDesk: frontDeskReducer,
    platform: platformReducer,
    quickRegistrations: quickRegistrationsReducer,
    feedback: feedbackReducer,
    image: imageReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["image/updateEventImage/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg.imageUrl", "payload.image_url"],
        // Ignore these paths in the state
        ignoredPaths: ["events.currentEvent.image_url"],
      },
    }),
})

export default store
