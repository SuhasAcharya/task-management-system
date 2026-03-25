"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import TaskCard from "@/components/TaskCard";
import TaskFormModal from "@/components/TaskFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import SummaryCards from "@/components/SummaryCards";
import { loadTasksFromStorage, saveTasksToStorage } from "@/lib/localStorage";
import { TASK_STATUSES } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTask, deleteTask, hydrateTasks, updateTask } from "@/store/tasksSlice";

export default function TaskDashboard({ view }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  const [isHydrated, setIsHydrated] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    dispatch(hydrateTasks(storedTasks));
    setIsHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) return;
    saveTasksToStorage(tasks);
  }, [tasks, isHydrated]);

  const visibleTasks = useMemo(() => {
    let result = [...tasks];
    if (view === "completed") result = result.filter((task) => task.status === "Completed");
    if (filterStatus !== "All") result = result.filter((task) => task.status === filterStatus);
    result.sort((a, b) => {
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });
    return result;
  }, [tasks, view, filterStatus, sortOrder]);

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmit = (payload) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, updates: payload }));
      toast.success("Task updated");
      return;
    }
    dispatch(addTask(payload));
    toast.success("Task created");
  };

  const confirmDelete = () => {
    if (!taskPendingDelete) return;
    dispatch(deleteTask(taskPendingDelete.id));
    toast.success("Task deleted");
    setTaskPendingDelete(null);
  };

  const emptyText =
    view === "completed"
      ? "No completed tasks yet. Finish some tasks to see them here."
      : "No tasks found. Create your first task to get started.";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <section className="mb-6 rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-sm backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Task Management Dashboard</h1>
            <p className="mt-1 text-slate-500">Track progress, prioritize work, and keep delivery on schedule.</p>
          </div>
        </div>
      </section>

      <SummaryCards tasks={tasks} />

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl border border-indigo-100 bg-white p-1 shadow-sm">
            <Link
              href="/"
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${view === "all"
                  ? "cursor-pointer bg-indigo-600 text-white"
                  : "cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              All Tasks
            </Link>
            <Link
              href="/completed"
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${view === "completed"
                  ? "cursor-pointer bg-indigo-600 text-white"
                  : "cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              Completed Tasks
            </Link>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <p className="text-sm text-slate-500">
              {visibleTasks.length} task{visibleTasks.length === 1 ? "" : "s"} shown
            </p>
            <button
              className="h-10 cursor-pointer rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
              onClick={openCreateModal}
              type="button"
            >
              Add Task
            </button>
          </div>
        </div>
      </section>

      <section className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur md:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm text-slate-500">Filter</span>
          <div className="relative">
            <select
              className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-11 text-slate-800 outline-none ring-indigo-100 transition focus:ring-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm text-slate-500">Sort by Due Date</span>
          <div className="relative">
            <select
              className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-11 text-slate-800 outline-none ring-indigo-100 transition focus:ring-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Earliest first</option>
              <option value="desc">Latest first</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </label>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!isHydrated ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              aria-hidden="true"
            />
          ))
        ) : visibleTasks.length === 0 ? (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            {emptyText}
          </div>
        ) : (
          visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onRequestDelete={setTaskPendingDelete}
            />
          ))
        )}
      </section>

      <TaskFormModal
        isOpen={isModalOpen}
        mode={editingTask ? "edit" : "create"}
        initialTask={editingTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        task={taskPendingDelete}
        onClose={() => setTaskPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
