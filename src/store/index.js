import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "@/store/tasksSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});
