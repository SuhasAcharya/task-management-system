"use client";

import { useEffect } from "react";

export default function DeleteConfirmModal({ task, onClose, onConfirm }) {
  useEffect(() => {
    if (!task) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [task, onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <h2 id="delete-modal-title" className="text-lg font-semibold text-slate-900">
          Delete task?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Are you sure you want to delete <span className="font-semibold text-slate-800">&quot;{task.title}&quot;</span>? This
          cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
