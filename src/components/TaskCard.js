"use client";

import { formatDate } from "@/lib/date";
import { STATUS_COLORS } from "@/lib/constants";

export default function TaskCard({ task, onEdit, onRequestDelete }) {
  return (
    <article className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500">Due: {formatDate(task.dueDate)}</p>
        </div>
        <span
          className="self-start whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold"
          style={{ borderColor: STATUS_COLORS[task.status], color: STATUS_COLORS[task.status] }}
        >
          {task.status}
        </span>
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
