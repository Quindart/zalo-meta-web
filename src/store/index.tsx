import { configureStore } from "@reduxjs/toolkit";
import { Store } from "@reduxjs/toolkit";
import useUser from "./slice/use.slice";
import useAppStore from "./slice/app.slice";

export const store: Store = configureStore({
  reducer: {
    userSlice: useUser,
    appSlice: useAppStore,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
