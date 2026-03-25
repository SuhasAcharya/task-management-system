import { TASKS_STORAGE_KEY } from "@/lib/constants";

export function loadTasksFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.status === "string" &&
        typeof task.dueDate === "string"
    );
  } catch {
    return [];
  }
}

export function saveTasksToStorage(tasks) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}
