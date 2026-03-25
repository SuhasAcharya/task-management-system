"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { isDueDateTodayOrFuture, todayISODate } from "@/lib/date";
import { TASK_STATUSES } from "@/lib/constants";

const emptyForm = {
  title: "",
  description: "",
  status: "Pending",
  dueDate: "",
};

export default function TaskFormModal({ isOpen, mode, initialTask, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialTask) {
      setForm({
        title: initialTask.title || "",
        description: initialTask.description || "",
        status: initialTask.status || "Pending",
        dueDate: initialTask.dueDate || "",
      });
      setErrors({});
      return;
    }
    setForm(emptyForm);
    setErrors({});
  }, [isOpen, mode, initialTask]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => titleInputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const modalTitle = useMemo(() => (mode === "edit" ? "Edit task" : "Add task"), [mode]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.dueDate) next.dueDate = "Due date is required";
    else if (!isDueDateTodayOrFuture(form.dueDate)) next.dueDate = "Due date cannot be in the past";
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.dueDate === "Due date cannot be in the past") {
        toast.error(nextErrors.dueDate);
      } else {
        toast.error("Please fill in the required fields");
      }
      return;
    }
    onSubmit({
      title: form.title,
      description: form.description,
      status: form.status,
      dueDate: form.dueDate,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-slate-950/50 p-4" onClick={onClose} role="presentation">
      <div
        className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 id="task-modal-title" className="text-xl font-semibold">
            {modalTitle}
          </h2>
          <button
            className="cursor-pointer rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-slate-500">Title</span>
            <input
              ref={titleInputRef}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none ring-indigo-100 focus:ring-2"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Task title"
              required
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title ? <small className="text-xs text-rose-600">{errors.title}</small> : null}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm text-slate-500">Description</span>
            <textarea
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none ring-indigo-100 focus:ring-2"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Task details"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-slate-500">Status</span>
              <div className="relative">
                <select
                  className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-11 outline-none ring-indigo-100 focus:ring-2"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
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

            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-slate-500">Due Date</span>
              <input
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none ring-indigo-100 focus:ring-2"
                type="date"
                min={todayISODate()}
                value={form.dueDate}
                onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                required
                aria-invalid={Boolean(errors.dueDate)}
              />
              {errors.dueDate ? <small className="text-xs text-rose-600">{errors.dueDate}</small> : null}
            </label>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {mode === "edit" ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
