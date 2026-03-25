"use client";

import { useMemo } from "react";
import { TASK_STATUSES } from "@/lib/constants";

export default function SummaryCards({ tasks }) {
  const counts = useMemo(() => {
    const summary = {
      total: tasks.length,
    };
    TASK_STATUSES.forEach((status) => {
      summary[status] = tasks.filter((task) => task.status === status).length;
    });
    return summary;
  }, [tasks]);

  return (
    <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Total Tasks</p>
        <strong className="mt-1 block text-3xl font-bold">{counts.total}</strong>
      </div>
      {TASK_STATUSES.map((status) => (
        <div key={status} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{status}</p>
          <strong className="mt-1 block text-3xl font-bold">{counts[status]}</strong>
        </div>
      ))}
    </section>
  );
}
