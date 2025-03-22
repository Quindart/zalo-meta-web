import { configureStore } from "@reduxjs/toolkit";
import { Store } from "@reduxjs/toolkit";
import useUser from "./slice/use.slice";

export const store: Store = configureStore({
  reducer: {
    userSlice: useUser,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
