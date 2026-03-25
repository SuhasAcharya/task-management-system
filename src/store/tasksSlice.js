import { createSlice, nanoid } from "@reduxjs/toolkit";
import { TASK_STATUSES } from "@/lib/constants";

const initialState = {
  items: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    hydrateTasks(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    addTask: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(payload) {
        const now = new Date().toISOString();
        return {
          payload: {
            id: nanoid(),
            title: payload.title.trim(),
            description: payload.description?.trim() || "",
            status: payload.status || "Pending",
            dueDate: payload.dueDate,
            createdAt: now,
            updatedAt: now,
          },
        };
      },
    },
    updateTask(state, action) {
      const { id, updates } = action.payload;
      const target = state.items.find((task) => task.id === id);
      if (!target) return;
      if (updates.title !== undefined) target.title = updates.title.trim();
      if (updates.description !== undefined) target.description = updates.description.trim();
      if (updates.status !== undefined && TASK_STATUSES.includes(updates.status)) target.status = updates.status;
      if (updates.dueDate !== undefined) target.dueDate = updates.dueDate;
      target.updatedAt = new Date().toISOString();
    },
    deleteTask(state, action) {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
  },
});

export const { hydrateTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
