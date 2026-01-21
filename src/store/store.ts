import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/store/api/base";
import weatherReducer from "@/store/slices/weather";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// Export the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;