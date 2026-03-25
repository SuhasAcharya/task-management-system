"use client";

import { formatDate } from "@/lib/date";
import { STATUS_COLORS, TASK_STATUSES } from "@/lib/constants";

export default function TaskCard({ task, onEdit, onRequestDelete, onChangeStatus }) {
  return (
    <article className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500">Due: {formatDate(task.dueDate)}</p>
        </div>

        <div
          className="grid w-full grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-inner sm:inline-grid sm:w-auto sm:gap-0.5 sm:p-0.5"
          role="group"
          aria-label="Task status"
        >
          {TASK_STATUSES.map((status) => {
            const active = task.status === status;
            return (
              <button
                key={status}
                type="button"
                aria-pressed={active}
                onClick={() => onChangeStatus?.(task, status)}
                className={`w-full rounded-lg px-1.5 py-1.5 text-[10px] font-semibold leading-tight transition sm:w-auto sm:px-2.5 sm:py-1.5 sm:text-xs ${
                  active ? "text-white shadow-sm" : "text-slate-600 hover:bg-white"
                }`}
                style={
                  active
                    ? { backgroundColor: STATUS_COLORS[status] }
                    : undefined
                }
              >
                {status === "In Progress" ? (
                  <>
                    <span className="sm:hidden">
                      <span className="block">In</span>
                      <span className="block">Progress</span>
                    </span>
                    <span className="hidden sm:inline">In Progress</span>
                  </>
                ) : status === "Completed" ? (
                  <>
                    <span className="sm:hidden">Completed</span>
                    <span className="hidden sm:inline">Completed</span>
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">Pending</span>
                    <span className="hidden sm:inline">Pending</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-700">{task.description || "No description added."}</p>

      <div className="flex gap-2.5">
        <button
          className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          onClick={() => onEdit(task)}
          type="button"
        >
          Edit
        </button>
        <button
          className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          onClick={() => onRequestDelete(task)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
