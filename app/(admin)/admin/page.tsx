"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Lab = {
  id: string;
  lab_name: string;
  lab_code: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export default function AdminPage() {
  const router = useRouter();

  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabId, setEditingLabId] = useState<string | null>(null);
  const [form, setForm] = useState({ lab_name: "", lab_code: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/db/labs", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load labs");
      }
      const rows = (await res.json()) as Lab[];
      rows.sort((a, b) => a.lab_name.localeCompare(b.lab_name));
      setLabs(rows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs().catch((e: unknown) =>
      setError(getErrorMessage(e, "Failed to load labs")),
    );
  }, []);

  const openModal = (lab?: Lab) => {
    setError("");
    if (lab) {
      setEditingLabId(lab.id);
      setForm({ lab_name: lab.lab_name || "", lab_code: lab.lab_code || "" });
    } else {
      setEditingLabId(null);
      setForm({ lab_name: "", lab_code: "" });
    }
    setIsModalOpen(true);
  };

  const saveLab = async () => {
    setSaving(true);
    setError("");
    try {
      if (!form.lab_name.trim() || !form.lab_code.trim()) {
        throw new Error("Lab name and lab code are required.");
      }

      const payload = {
        lab_name: form.lab_name.trim(),
        lab_code: form.lab_code.trim(),
      };

      if (editingLabId) {
        const res = await fetch(`/api/db/labs/${editingLabId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("Failed to update lab");
        }
      } else {
        const res = await fetch("/api/db/labs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("Failed to create lab");
        }
      }

      await fetchLabs();
      setIsModalOpen(false);
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Failed to save lab"));
    } finally {
      setSaving(false);
    }
  };

  const deleteLab = async (labId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this lab and all of its questions?")) {
      return;
    }
    const res = await fetch(`/api/db/labs/${labId}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete lab");
      return;
    }
    await fetchLabs();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fef3c7_0%,#fff_35%),radial-gradient(circle_at_bottom_right,#dbeafe_0%,#fff_40%)] px-4 py-6 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_top_left,#111827_0%,#020617_45%),radial-gradient(circle_at_bottom_right,#0b1120_0%,#030712_45%)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6 dark:border-slate-700/80 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Admin Console
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-100">
                Lab Management
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Create and maintain labs and their question banks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Labs
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {labs.length}
                </p>
              </div>
              <button
                onClick={() => openModal()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                + Add Lab
              </button>
            </div>
          </div>
        </div>

        {error && !isModalOpen ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/70"
              />
            ))
          ) : labs.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/80 p-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              No labs found. Add your first lab to get started.
            </div>
          ) : (
            labs.map((lab) => (
              <div
                key={lab.id}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                onClick={() => router.push(`/admin/labs/${lab.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {lab.lab_name}
                    </p>
                    <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {lab.lab_code}
                    </p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                      Open to manage questions
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(lab);
                      }}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => deleteLab(lab.id, e)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
              {editingLabId ? "Edit Lab" : "Add Lab"}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Lab Name"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                value={form.lab_name}
                onChange={(e) => setForm({ ...form, lab_name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Lab Code"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
                value={form.lab_code}
                onChange={(e) => setForm({ ...form, lab_code: e.target.value })}
              />
              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveLab}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
